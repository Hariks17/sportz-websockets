import express from "express";
import { matchRouter } from "./routes/matches.js";

const app = express();
const PORT = 8080;

app.use(express.json());

// Middleware to log each request
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Root GET route
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.use("/matches", matchRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
