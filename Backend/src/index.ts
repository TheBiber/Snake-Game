import express from "express";
import cors from "cors"; // 1. ייבוא החבילה
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use(cors()); // 2. מאפשר לכל אפליקציית React להתחבר לשרת הזה

app.use("/api", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection successful!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error: any) => console.error("Error:", error));
