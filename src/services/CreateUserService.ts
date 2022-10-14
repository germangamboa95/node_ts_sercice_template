import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";
import { FindUserService } from "./FindUserService";
import { UserAlreadyExists } from "../errors/UserAlreadyExists";
import { HashPasswordAction } from "./HashPasswordAction";

export class CreateUserService {
  private user_repo: Repository<User>;
  private find_user_service: FindUserService;

  constructor(data_source: DataSource) {
    this.user_repo = data_source.getRepository(User);
    this.find_user_service = new FindUserService(data_source);
  }

  public async register(email: string, password: string) {
    const existing_user = await this.find_user_service.findByEmail(email);

    if (existing_user) {
      throw new UserAlreadyExists();
    }

    const password_hash = await HashPasswordAction.execute(password);

    return this.user_repo.save({
      email,
      password: password_hash,
    });
  }
}
