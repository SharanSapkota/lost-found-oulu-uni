import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./src/routes/auth.routes";
import userRoutes from "./src/routes/user.routes";
import eventRoutes from "./src/routes/event.routes";
import itemRoutes from "./src/routes/item.routes";
import claimRoutes from "./src/routes/claim.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admins", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "OuluFound API running " });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
