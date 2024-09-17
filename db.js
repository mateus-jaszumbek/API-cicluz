const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'banco', 'meubanco.db');

class Database {
    constructor() {
        const dbPath = process.env.DB_PATH || './banco/banco.db';
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Conectado ao banco de dados SQLite');
            }
        });
    }

    criarTabelas() {
        const sql = `
            CREATE TABLE IF NOT EXISTS eu_ser_ter_areas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                icone TEXT NOT NULL
            );
    
            CREATE TABLE IF NOT EXISTS topicos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_est INTEGER,
                nome TEXT NOT NULL,
                FOREIGN KEY (id_est) REFERENCES eu_ser_ter_areas(id)
            );
    
            CREATE TABLE IF NOT EXISTS subtopicos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_topico INTEGER,
                nome TEXT NOT NULL,
                FOREIGN KEY (id_topico) REFERENCES topicos(id)
            );
    
            CREATE VIEW IF NOT EXISTS vw_subtopicos AS
            SELECT est.este AS est, est.nome AS est_area, t.id AS id_topico, t.nome AS nome_topico, s.id AS id_subtopico, s.nome AS nome_subtopico
            FROM topicos t
            LEFT JOIN subtopicos s ON t.id = s.id_topico
            LEFT JOIN eu_ser_ter_areas est ON t.id_est = est.id;

            CREATE VIEW IF NOT EXISTS vw_topicos AS
            SELECT est.id AS est_id, est.est AS est, est.nome AS est_area, t.id AS id_topico, t.nome AS nome_topico
            FROM topicos t
            LEFT JOIN eu_ser_ter_areas est ON t.id_est = est.id;
        `;

        return new Promise((resolve, reject) => {
            this.db.exec(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log('Tabelas e view criadas com sucesso');
                    resolve('Tabelas criadas com sucesso');
                }
            });
        });
    }

    consultarEstAreas(est) {
        let sql = `SELECT * FROM eu_ser_ter_areas WHERE est = ?`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [est], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    consultarEstArea(id) {
        let sql = `SELECT * FROM eu_ser_ter_areas WHERE id = ? `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    inserirTopico(nome, id_est) {
        const sql = `INSERT INTO topicos (nome, id_est) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [nome, id_est], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(`Usuário inserido com ID: ${this.lastID}`);
                }
            });
        });
    }

    inserirSubtopico(nome, id_topico) {
        const sql = `INSERT INTO subtopicos (nome, id_topico) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [nome, id_topico], function (err) {
                if (err) {
                    console.log('n deu')
                    reject(err);
                } else {
                    console.log('deu')
                    resolve(`Usuário inserido com ID: ${this.lastID}`);
                }
            });
        });
    }


    consultarTopicos(id_est) {
        const sql = `SELECT * FROM vw_topicos WHERE est_id = ?`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [id_est], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    consultarTopico(id_topico) {
        const sql = `SELECT * FROM topicos WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [id_topico], (err, rows) => {
                if (err) {

                    reject(err);
                } else {

                    resolve(rows);
                }
            });
        });
    }

    consultarSubtopicos(id_topico) {
        const sql = `SELECT * FROM vw_subtopicos WHERE id_topico = ?`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [id_topico], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    deletarTopico(idTopico) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM topicos WHERE id = ?';
            this.db.run(sql, [idTopico], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`Tópico com ID ${idTopico} deletado.`);
                    resolve("deu"); // Resolve a promessa quando a exclusão é bem-sucedida
                }
            });
        });
    }

    deletarSubtopico(idTopico) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM subtopicos WHERE id = ?';
            this.db.run(sql, [idTopico], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`Subtópico  deletado.`);
                    resolve(); // Resolve a promessa quando a exclusão é bem-sucedida
                }
            });
        });
    }

    deletarSubtopicos(idTopico) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM subtopicos WHERE id_topico = ?';
            this.db.run(sql, [idTopico], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`Subtópico  deletado.`);
                    resolve(); // Resolve a promessa quando a exclusão é bem-sucedida
                }
            });
        });
    }
}

module.exports = new Database();
