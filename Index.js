const axios = require("axios");
require("dotenv").config();

const API_URL = "https://api.openai.com/v1/chat/completions";

const apiKey = process.env.OPEN_API_KEY;

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

const requestBody = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Say this is a test!" }],
  temperature: 0.7,
};

const MAX_RETRIES = 3;
let retries = 0;

function makeRequest() {
  axios.post(API_URL, requestBody, config)
    .then((response) => {
      console.log(response.data.choices[0].message.content);
    })
    .catch((error) => {
      if (error.response && error.response.status === 429 && retries < MAX_RETRIES) {
        retries++;
        const retryAfter = error.response.headers["retry-after"] || 1;
        console.log(`Too many requests. Retrying after ${retryAfter} seconds...`);
        setTimeout(makeRequest, retryAfter * 1000);
      } else {
        console.error(error);
      }
    });
}

makeRequest();
