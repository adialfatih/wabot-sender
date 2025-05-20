const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const PesanQueue = require('../models/PesanQueue');
const LogPengiriman = require('../models/LogPengiriman');

class WhatsAppService {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });
        this.ready = false;
        this.qrCode = null;
        this.connectedNumber = null;

        this.setupEvents();
    }

    setupEvents() {
        this.client.on('qr', (qr) => {
            this.qrCode = qr;
            qrcode.generate(qr, { small: true });
            console.log('QR Code generated, please scan it with your phone');
        });

        this.client.on('ready', () => {
            this.ready = true;
            this.connectedNumber = this.client.info.wid.user;
            console.log('Client is ready!');
        });

        this.client.on('disconnected', () => {
            this.ready = false;
            this.connectedNumber = null;
            console.log('Client disconnected');
        });
    }

    async start() {
        await this.client.initialize();
    }

    async stop() {
        await this.client.destroy();
    }

    async sendMessage(number, message, mediaUrl = null, mediaType = 'text') {
        try {
            const chatId = number.includes('@') ? number : `${number}@c.us`;
            
            if (mediaType === 'text') {
                await this.client.sendMessage(chatId, message);
            } else if (mediaType === 'gambar') {
                await this.client.sendMessage(chatId, {
                    body: message,
                    media: mediaUrl
                });
            } else if (mediaType === 'dokumen') {
                await this.client.sendMessage(chatId, {
                    body: message,
                    media: mediaUrl,
                    sendMediaAsDocument: true
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, error: error.message };
        }
    }

    getStatus() {
        return {
            isReady: this.ready,
            qrCode: this.qrCode,
            connectedNumber: this.connectedNumber
        };
    }
}

module.exports = new WhatsAppService();