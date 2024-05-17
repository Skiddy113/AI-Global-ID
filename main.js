const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const openai = require("./openai.js");
const Input = require("./model/input.model.js");
const Output = require("./model/output.model.js");
const axios = require("axios");

//Function for speech to text
async function speechToText(audioBuffer) {
  try {
    const Url = "https://sangria-hummingbird-1439.twil.io/assets/input_speech.mp3";
    const fileUrl = await axios.post(Url, audioBuffer, {
      headers: {
        'Content-Type': 'audio/mp3'
      }
    });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(fileUrl),
      model: "whisper-1",
      max_tokens: 1,
      response_format: "text",
    });
    console.log("Speech to text done.");

    const input = new Input({
      input_file: JSON.stringify(transcription, null, 2),
    });
    await input.save();
    console.log("Transcription saved to MongoDB");

    await unlinkAsync(tempFilePath);
    return input._id;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

//Function for chat completion
async function chatCompletion(inputId) {
  try {
    const input = await Input.findById(inputId);
    if (!input) {
      throw new Error("Input not found.");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input.input_file }],
      max_tokens: 15,
    });

    const output = response.choices[0].message.content;
    console.log("Chat generation done.");

    const newOutput = new Output({
      output_file: output,
    });
    await newOutput.save();
    console.log("Transcription saved to MongoDB");

    return newOutput._id;
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    throw error;
  }
}

//Function for text to speech
async function textToSpeech(outputId) {
  try {
    const output = await Output.findById(outputId);
    if (!output) {
      throw new Error("Output not found.");
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: output.output_file,
      format: "flac",
      max_tokens: 1,
    });
    console.log("Text to speech done.");

    return mp3;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

//Route for main page
router.get("/main", async (req,res) => {
  res.send("Voice Bot using OpenAI made by Shreyas");
});

//Route for the main API
router.post("/main", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const audioBuffer = req.file.buffer;
    // Speech to text
    const inputId = await speechToText(audioBuffer);
    // Chat completion
    const outputId = await chatCompletion(inputId);
    // Text to speech
    const mp3 = await textToSpeech(outputId);

    res.set("Content-Type", "audio/flac");
    res.send(Buffer.from(await mp3.arrayBuffer()));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
