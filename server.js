import cors from "cors";
import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import initialDataRoutes from "./src/routes/admin/initialData.js";

import adminRoutes from "./src/routes/admin/auth.js";
import authRoutes from "./src/routes/auth.js";
import cartRoutes from "./src/routes/cart.js";
import categoryRoutes from "./src/routes/category.js";
import productRoutes from "./src/routes/product.js";
import testingRoutes from "./src/routes/testing.js";
import pageRoutes from "./src/routes/admin/page.js";
// import initialData from "./src/routes/admin/initialData.js";
const __dirname = path.resolve();

//Routes
const app = express();

//environment variable
env.config();

//mongodb connection stringord>@cluster0.lkdbo.mongodb.net/<dbname>?retryWrites=true&w=majority
const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.lkdbo.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Error : Not connected to database");
  });

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, `\\src\\uploads`)));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/testing", testingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App Listing To Port ${process.env.PORT}`);
});
