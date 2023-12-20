const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path'); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/save-message', async (req, res) => {
    try {
        const message = req.body.message;
        const currentTime = new Date().toLocaleTimeString();
        const formattedMessage = `${message} - ${currentTime}\n`;

        await fs.appendFile('message.txt', formattedMessage);
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'ошибка сервера' });
    }
});

app.get('/get-messages', async (req, res) => {
    try {
        const messages = await fs.readFile('message.txt', 'utf-8');
        const messageArray = messages.split('\n').filter(Boolean);

        res.status(200).json(messageArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`сервер стартанул на порту ${PORT}`);
});