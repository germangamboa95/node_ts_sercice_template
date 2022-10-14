import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { getValidatedData, validate } from "./middleware/Validation";
import { StatusCodes } from "http-status-codes";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { UserResetPasswordAction } from "../services/UserResetPasswordAction";

export const PasswordResetController = Router();

interface PasswordResetBody {
  password: string;
  confirm_password: string;
}

PasswordResetController.post(
  "/reset",
  AuthMiddleware,
  validate([
    body("password").isString().isLength({ min: 8 }).trim(),
    body("confirm_password").custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ]),
  async (req: Request, res: Response) => {
    const { password } = getValidatedData<PasswordResetBody>(req);

    try {
      const user = res.locals.user;
      const user_password_reset_action = new UserResetPasswordAction(
        res.app.get("data_source")
      );

      await user_password_reset_action
        .setUser(user)
        .setPassword(password)
        .execute();

      return res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Password changed" });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);
