require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressWs = require('express-ws');
const path = require('path');

// Initialize services
const WhatsAppService = require('./services/whatsappService');
const QueueService = require('./services/queueService');

// Start WhatsApp client and queue processing
WhatsAppService.start();
QueueService.startProcessing();

// Create Express app
const app = express();
expressWs(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const whatsappRouter = require('./controllers/whatsappController');
const apiRouter = require('./controllers/apiController');

app.use('/whatsapp', whatsappRouter);
app.use('/api', apiRouter);

// Web interface
app.get('/', (req, res) => {
    res.render('index');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Web interface: http://localhost:${PORT}`);
});