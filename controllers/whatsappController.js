const WhatsAppService = require('../services/whatsappService');
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    const status = WhatsAppService.getStatus();
    res.json(status);
});

router.get('/qr', async (req, res) => {
    const status = WhatsAppService.getStatus();
    if (status.isReady) {
        return res.json({ status: 'already_connected', number: status.connectedNumber });
    }

    if (!status.qrCode) {
        return res.status(404).json({ error: 'QR code not generated yet' });
    }

    res.json({ qrCode: status.qrCode });
});

router.post('/start', async (req, res) => {
    try {
        await WhatsAppService.start();
        res.json({ success: true, message: 'WhatsApp client started' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/stop', async (req, res) => {
    try {
        await WhatsAppService.stop();
        res.json({ success: true, message: 'WhatsApp client stopped' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;