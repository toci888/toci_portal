const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

// Konfiguracja aplikacji
const app = express();
app.use(cors()); // Obsługa CORS dla komunikacji z frontendem
app.use(express.json()); // Obsługa JSON w żądaniach

// Konfiguracja OpenAI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: "TWÓJ_KLUCZ_API_OPENAI", // Podaj swój klucz API
  })
);

// Endpoint testowy
app.get("/", (req, res) => {
  res.send("CRM Backend działa poprawnie!");
});

// Endpoint generowania sceny
app.post("/api/chat/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt jest wymagany." });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
    });

    const generatedText = response.data.choices[0].text.trim();
    res.json({ generatedText });
  } catch (error) {
    console.error("Błąd podczas generowania sceny:", error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas generowania sceny." });
  }
});

// Uruchomienie serwera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
