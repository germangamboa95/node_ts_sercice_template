import { User } from "../entity/User";
import bcyrpt from "bcryptjs";
import jwt from "jsonwebtoken";
export class BasicAuthenticationService {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  public async check(password: string) {
    return this.isValidPassword(password, this.user.password);
  }

  public async makeToken() {
    return jwt.sign(
      { sub: this.user.id, email: this.user.email },
      "testicles",
      { expiresIn: "12h" }
    );
  }

  private async isValidPassword(password: string, hashed_password: string) {
    return await bcyrpt.compare(password, hashed_password);
  }
}
