const pool = require('../config/database');

class PesanQueue {
    static async create(data) {
        const [result] = await pool.query('INSERT INTO pesan_queue SET ?', [data]);
        return result.insertId;
    }

    static async getPesanMenunggu(limit = 50) {
        const [rows] = await pool.query(
            'SELECT * FROM pesan_queue WHERE status = "MENUNGGU" LIMIT ?',
            [limit]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        await pool.query(
            'UPDATE pesan_queue SET status = ? WHERE id = ?',
            [status, id]
        );
    }
}

module.exports = PesanQueue;