import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

dotenv.config();
const MONGO_URL: string = process.env.MONGO_URL as string;
if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in the environment variables.");
}

console.log("dotenv: ", MONGO_URL);

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());

app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("server running on http://localhost:8080/");
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from the database");
});

mongoose.connection.on("error", (error: Error) => {
  console.error("Mongoose connection error:", error);
});

app.use("/", router());
