import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { getValidatedData, validate } from "./middleware/Validation";
import { StatusCodes } from "http-status-codes";
import { BasicAuthenticationService } from "../services/BasicAuthenticationService";
import { FindUserService } from "../services/FindUserService";
import { UserDoesNotExist } from "../errors/UserDoesNotExist";
import { InvalidPassword } from "../errors/InvalidPassword";
import { AuthResource } from "./resources/AuthResource";

export const AuthController = Router();

interface LoginBody {
  email: string;
  password: string;
}

AuthController.post(
  "/login",
  validate([
    body("email").isEmail().trim(),
    body("password").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { email, password } = getValidatedData<LoginBody>(req);

    try {
      const find_user_service = new FindUserService(res.app.get("data_source"));
      const user = await find_user_service.findByEmail(email);

      if (user === null) {
        throw new UserDoesNotExist();
      }

      const auth_service = new BasicAuthenticationService(user);

      const password_is_valid = await auth_service.check(password);

      if (!password_is_valid) {
        throw new InvalidPassword();
      }

      const token = await auth_service.makeToken();

      return res.json(AuthResource.toResource(user, token));
    } catch (error) {
      if (
        error instanceof UserDoesNotExist ||
        error instanceof InvalidPassword
      ) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid Credentials",
        });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);
