const mongoose = require("mongoose");

const CsvDataSchema = new mongoose.Schema({
  data: [
    {
      type: Map,
      of: String,
    },
  ],
});

const CsvData = mongoose.model("CsvData", CsvDataSchema);
module.exports = CsvData;
