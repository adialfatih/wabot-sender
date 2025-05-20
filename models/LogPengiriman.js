const pool = require('../config/database');

class LogPengiriman {
    static async create(pesanId, status, response = null) {
        await pool.query(
            'INSERT INTO log_pengiriman (pesan_id, status, response) VALUES (?, ?, ?)',
            [pesanId, status, response]
        );
    }
}

module.exports = LogPengiriman;