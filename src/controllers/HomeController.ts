import { Router } from "express";

import { HOME_PAGE } from "../constants";

export const HomeController = Router();

HomeController.get("/", (req, res) => {
  return res.render(HOME_PAGE);
});
