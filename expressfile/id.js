const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/verify-id", upload.single("idPhoto"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const apiKey = "Gx2Qq4WoLTLZfpOo1hSnexdvZ8XLR5G1"; // Replace with your ID Analyzer API key
  const url = "https://api.idanalyzer.com"; // ID Analyzer API endpoint

  const formData = new FormData();
  formData.append("file", fs.createReadStream(file.path));
  formData.append("apikey", apiKey);

  axios
    .post(`${url}/v1/identity/document`, formData, {
      headers: formData.getHeaders(),
    })
    .then((response) => {
      fs.unlinkSync(file.path); // Delete the uploaded file after use
      res.json(response.data);
    })
    .catch((error) => {
      fs.unlinkSync(file.path); // Delete the uploaded file after use
      res.status(500).send(error.response.data);
    });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
