const WhatsAppService = require('./whatsappService');
const PesanQueue = require('../models/PesanQueue');
const LogPengiriman = require('../models/LogPengiriman');

class QueueService {
    constructor() {
        this.isProcessing = false;
        this.limit = 50; // Batas pengiriman per interval
        this.interval = 5000; // 5 detik
        this.intervalId = null;
    }

    startProcessing() {
        if (this.intervalId) return;

        this.intervalId = setInterval(async () => {
            if (this.isProcessing || !WhatsAppService.getStatus().isReady) return;

            this.isProcessing = true;
            try {
                const messages = await PesanQueue.getPesanMenunggu(this.limit);
                
                for (const message of messages) {
                    try {
                        const result = await WhatsAppService.sendMessage(
                            message.nomor_tujuan,
                            message.isi_pesan,
                            message.url_media,
                            message.tipe_media
                        );

                        if (result.success) {
                            await PesanQueue.updateStatus(message.id, 'TERKIRIM');
                            await LogPengiriman.create(message.id, 'TERKIRIM');
                        } else {
                            await PesanQueue.updateStatus(message.id, 'GAGAL');
                            await LogPengiriman.create(message.id, 'GAGAL', result.error);
                        }
                    } catch (error) {
                        console.error(`Error processing message ${message.id}:`, error);
                        await PesanQueue.updateStatus(message.id, 'GAGAL');
                        await LogPengiriman.create(message.id, 'GAGAL', error.message);
                    }
                }
            } catch (error) {
                console.error('Error in queue processing:', error);
            } finally {
                this.isProcessing = false;
            }
        }, this.interval);
    }

    stopProcessing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

module.exports = new QueueService();