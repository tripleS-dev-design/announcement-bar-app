import express from "express";
import { createRequestHandler } from "@remix-run/node";

const app = express();

app.all(
  "*",
  createRequestHandler({
    build: require("./build/index.js"),
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
