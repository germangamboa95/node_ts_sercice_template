import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";

export class FindUserService {
  private user_repo: Repository<User>;

  constructor(data_source: DataSource) {
    this.user_repo = data_source.getRepository(User);
  }

  public async findByEmail(email: string) {
    return this.user_repo.findOne({ where: { email } });
  }
}
