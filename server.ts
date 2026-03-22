import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
//routes
import routes from "./routes/index";
//db
import connectDB from "./config/db";
//swagger
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./docs/swagger";
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

const server = express();
dotenv.config();

//middlewares
server.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
  }),
);
server.use(bodyParser.json());
server.use(express.json());
server.use(cookieParser());
server.use("/api", routes);
server.get("/ping", (req, res) => {
  res.sendStatus(200);
});
//Swagger config
server.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(swaggerConfig)),
);

connectDB();
server.listen(Number(process.env.PORT) || 4200, "0.0.0.0", async () => {
  console.log("listening");
});

export default server;
