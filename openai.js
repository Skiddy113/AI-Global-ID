// Import the OpenAI class from the package
const { OpenAI } = require("openai");

// Instantiate the OpenAI object with your API key
const openai = new OpenAI({
    apiKey: "api-key",
});

module.exports = openai;
