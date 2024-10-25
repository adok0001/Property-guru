const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const WIT_TOKEN = process.env.WIT_TOKEN;

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await axios.get(`https://api.wit.ai/message?v=20230401&q=${encodeURIComponent(userMessage)}`, {
      headers: { Authorization: `Bearer ${WIT_TOKEN}` }
    });
    const witResponse = response.data;
    const reply = witResponse.text || "I'm sorry, I didn't understand that.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Something went wrong.' });
  }
});


app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
