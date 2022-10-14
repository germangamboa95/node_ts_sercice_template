import express from "express";
import { engine } from "express-handlebars";

export const app = express();

app.use(express.json());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
