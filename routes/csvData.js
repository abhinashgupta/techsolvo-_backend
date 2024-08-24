const express = require("express");
const Papa = require("papaparse");
const multer = require("multer");
const CsvData = require("../models/CsvData");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer(); 

router.post("/upload", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "No data provided" });
      }
      
    await CsvData.insertMany(data);

    res.status(201).json({ message: "Data successfully uploaded" });
  } catch (error) {
    console.error("Error uploading CSV data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/data", async (req, res) => {
  try {
    const csvData = await CsvData.find();
    res.status(200).json(csvData);
  } catch (error) {
    console.error("Error retrieving CSV data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/data/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedRow } = req.body;

    const csvRecord = await CsvData.findOneAndUpdate(
      { "data._id": id },
      {
        $set: {
          "data.$": updatedRow,
        },
      },
      { new: true }
    );

    if (!csvRecord) {
      return res.status(404).json({ message: "Row not found" });
    }

    res.json(csvRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/export", auth, async (req, res) => {
  try {
    const csvData = await CsvData.find();
    if (!csvData || csvData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const csvContent = Papa.unparse(csvData[0].data);

    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    res.send(csvContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/files", async (req, res) => {
  try {
    const files = await CsvData.find({}, "name _id"); 
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


