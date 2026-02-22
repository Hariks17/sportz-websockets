import express from "express";

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
