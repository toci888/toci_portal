const express = require("express");
const cors = require("cors");
const { OpenAIApi, Configuration } = require("openai");

// Konfiguracja aplikacji
const app = express();
app.use(cors());
app.use(express.json());

// Konfiguracja OpenAI
const configuration = new Configuration({
  apiKey: "TWÓJ_KLUCZ_API_OPENAI", // Podaj swój klucz API OpenAI
});

const openai = new OpenAIApi(configuration);

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
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Możesz użyć np. gpt-4, jeśli masz dostęp
      messages: [
        { role: "system", content: "Jesteś pomocnym asystentem." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
    });

    const generatedText = response.data.choices[0].message.content.trim();
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
