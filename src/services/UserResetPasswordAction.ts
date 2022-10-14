import { DataSource, Repository } from "typeorm";

import { User } from "../entity/User";
import { HashPasswordAction } from "./HashPasswordAction";

export class UserResetPasswordAction {
  private user_repo: Repository<User>;
  private user: User;
  private password: string;

  constructor(data_source: DataSource) {
    this.user_repo = data_source.getRepository(User);
  }

  public setUser(user: User) {
    this.user = user;
    return this;
  }

  public setPassword(password: string) {
    this.password = password;

    return this;
  }

  public async execute() {
    const password = await HashPasswordAction.execute(this.password);

    this.user.password = password;

    await this.user_repo.save(this.user);

    return this.user;
  }
}
