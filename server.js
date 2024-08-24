require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const csvDataRoutes = require("./routes/csvData");
const cors = require("cors");

const app = express();


app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/csv", csvDataRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
