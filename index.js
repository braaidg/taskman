import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

dbConnection();

const corsWhitelist = ["http://localhost:5173", "http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (corsWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS error"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
