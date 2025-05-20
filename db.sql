CREATE DATABASE whatsapp_bot;

USE whatsapp_bot;

CREATE TABLE pesan_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_tujuan VARCHAR(20) NOT NULL,
    isi_pesan TEXT,
    url_media VARCHAR(255),
    tipe_media ENUM('text', 'gambar', 'dokumen') DEFAULT 'text',
    status ENUM('MENUNGGU', 'TERKIRIM', 'GAGAL') DEFAULT 'MENUNGGU',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE log_pengiriman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pesan_id INT,
    status VARCHAR(20),
    response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pesan_id) REFERENCES pesan_queue(id)
);