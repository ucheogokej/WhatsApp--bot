const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const PHONE_ID = process.env.PHONE_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] == VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (msg) {
    const from = msg.from;
    await axios.post(`https://graph.facebook.com/v22.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp",
      to: from,
      text: { body: "Hi! Thanks for messaging. How can I help?" }
    }, { headers: { Authorization: `Bearer ${TOKEN}` }});
  }
  res.sendStatus(200);
});

app.listen(10000, () => console.log("Bot running"));
