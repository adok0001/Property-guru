const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const WIT_TOKEN = process.env.WIT_TOKEN;

app.post('/message', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: 'No message provided.' });
    }

    try {
        // Send request to Wit.ai
        const response = await axios.get(`https://api.wit.ai/message?v=20230401&q=${encodeURIComponent(userMessage)}`, {
            headers: { Authorization: `Bearer ${WIT_TOKEN}` }
        });

        // Extract response from Wit.ai
        const witData = response.data;
        let reply = "I'm sorry, I didn't understand that.";

        // Check for intent or other relevant information in Wit.ai response
        if (witData.entities && Object.keys(witData.entities).length > 0) {
            const entityKey = Object.keys(witData.entities)[0];
            reply = witData.entities[entityKey][0].value || reply;
        }

        res.json({ reply });
    } catch (error) {
        console.error('Error fetching data from Wit.ai:', error.message);
        if (error.response) {
            console.error("Error response data:", error.response.data);
        }
        res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
