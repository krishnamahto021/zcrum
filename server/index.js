require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const port = process.env.PORT || 8080;
const cors = require("cors");
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "http://localhost:5173",
    // deployed url later
  ],
  optionsSuccessStatus: 200,
  exposedHeaders: ["Content-Disposition", "Content-Type"],
};
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Test api for zcrum"));

app.use("/api/v1", require("./routes"));
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
