/**
 * @jest-environment jsdom
 */

import request from "supertest";
import { app } from "../../web";
import { HomeController } from "../HomeController";
import { getByText } from "@testing-library/dom";

export const render = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
};

app.use(HomeController);

describe("HomeController Suite", () => {
  it("has a root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
  it("returns home page", async () => {
    const { text } = await request(app).get("/");

    const container = render(text);

    const title = getByText(container, "Tinypost");
    expect(title.textContent).toBe("Tinypost");
  });
});
