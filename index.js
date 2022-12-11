import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";

const app = express();

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
