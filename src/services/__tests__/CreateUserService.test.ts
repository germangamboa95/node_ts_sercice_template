import { data_source_test } from "../../db";
import { CreateUserService } from "../CreateUserService";

describe("CreateUserService tests", () => {
  beforeEach(async () => {
    await data_source_test.initialize();
    await data_source_test.synchronize(true);
  });

  it("it can create user", async () => {
    const service = new CreateUserService(data_source_test);

    const user = await service.register("germangamboa95@gmail.com", "password");

    expect(user.email).toBe("germangamboa95@gmail.com");
  });
});
