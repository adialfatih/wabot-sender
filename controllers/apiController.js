const PesanQueue = require('../models/PesanQueue');
const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Tambahkan ini

router.use(express.json());

router.post('/send-message', async (req, res) => {
    console.log('Received request body:', req.body); // Log request
    try {
        const { nomor_tujuan, isi_pesan, url_media, tipe_media } = req.body;

        if (!nomor_tujuan || !isi_pesan) {
            return res.status(400).json({ 
                success: false, 
                error: 'nomor_tujuan and isi_pesan are required' 
            });
        }

        const data = {
            nomor_tujuan,
            isi_pesan,
            url_media: url_media || null,
            tipe_media: tipe_media || 'text',
            status: 'MENUNGGU'
        };

        const id = await PesanQueue.create(data);

        res.json({ 
            success: true, 
            message: 'Message added to queue', 
            data: { id, ...data } 
        });
    } catch (error) {
        console.error('Error adding message to queue:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

router.get('/queue-status', async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT status, COUNT(*) as count 
            FROM pesan_queue 
            GROUP BY status
        `);
        
        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Error getting queue status:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;