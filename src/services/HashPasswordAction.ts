import bcyrpt from "bcryptjs";

export class HashPasswordAction {
  public static async execute(password: string) {
    return await bcyrpt.hash(password, 10);
  }
}
