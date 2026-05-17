const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GROK_API_KEY = process.env.GROK_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    if (!GROK_API_KEY) {
      return res.status(500).json({ error: 'GROK_API_KEY орнатылмаған' });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROK_API_KEY
      },
      body: JSON.stringify({
        model: 'grok-beta',
        max_tokens: 1000,
        messages: req.body.messages
      })
    });

    const data = await response.json();
    console.log('Grok response status:', response.status);

    if (!response.ok) {
      console.error('Grok error:', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || JSON.stringify(data) });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('BilimALL AI Server OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
