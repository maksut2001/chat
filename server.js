const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GROK_API_KEY = process.env.GROK_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROK_API_KEY
      },
      body: JSON.stringify({
        model: 'grok-3-latest',
        max_tokens: 1000,
        messages: req.body.messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Grok API error' });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('BilimALL AI Server — жұмыс істеп тұр ✅'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
