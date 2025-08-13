const express = require("express");
const connectDB = require("./config/database");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
dotenv.config();
connectDB();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
    });
  }
app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/api/users", (req, res) => {
    res.send("Hello world from API");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
}).on("error", (err) => {
    console.log("Error in server", err);
});