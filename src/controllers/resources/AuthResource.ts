import { User } from "../../entity/User";

export class AuthResource {
  public static toResource(user: User, token: string) {
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
  }
}
