const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working fine!" });
});

app.use("/api", require("./routes"));

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
