const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: "TWÓJ_KLUCZ_API_OPENAI",
  })
);

app.post("/api/chat/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd w komunikacji z OpenAI");
  }
});

app.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});
