import { Controllers } from "./controllers";
import { data_source } from "./db";
import { app } from "./web";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const main = async () => {
  await data_source.initialize();

  app.set("data_source", data_source);

  app.use(Controllers);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err?.message });
  });

  app.listen(3000);
};
