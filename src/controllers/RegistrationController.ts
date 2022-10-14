import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { UserAlreadyExists } from "../errors/UserAlreadyExists";
import { CreateUserService } from "../services/CreateUserService";
import { getValidatedData, validate } from "./middleware/Validation";

import { StatusCodes } from "http-status-codes";
import { User } from "../entity/User";
import { BasicAuthenticationService } from "../services/BasicAuthenticationService";

export const RegistrationController = Router();

interface RegisterUserBody {
  email: string;
  password: string;
  confirm_password: string;
}
// TODO: Turn into resource
const RegistrationReponse = (user: User, token: string) => {
  const formatted_user = {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.update_at,
  };

  return {
    user: formatted_user,
    jwt: token,
  };
};

RegistrationController.post(
  "/register",
  validate([
    body("email").isEmail().trim(),
    body("password").isString().isLength({ min: 8 }).trim(),
    body("confirm_password").custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ]),
  async (req: Request, res: Response) => {
    const { email, password } = getValidatedData<RegisterUserBody>(req);

    try {
      const create_user_service = new CreateUserService(
        res.app.get("data_source")
      );
      const user = await create_user_service.register(email, password);
      const auth_service = new BasicAuthenticationService(user);
      const token = await auth_service.makeToken();

      return res.json(RegistrationReponse(user, token));
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "User Already Exists" });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);
