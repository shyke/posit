const sqlite3 = require("sqlite3").verbose();

class TechnicianService {
  constructor() {
    this.connected = false;
    this.table = "technicians";
  }

  connect() {
    // Sanity check
    if (this.connected) return;
    this.db = new sqlite3.Database(
      "./db/task.db",
      sqlite3.OPEN_READWRITE,
      err => {
        if (err) {
          console.error(err.message);
        }
        console.log("********** Connected to the task database ************");
        this.connected = true;
      }
    );
  }

  disconnect() {
    // Sanity check
    if (!this.connected) return;
    this.db.close(err => {
      if (err) {
        return console.error(err.message);
      }
      console.log("************ Close the database connection ***************");
      this.connected = false;
    });
  }

  async create(event_data, options = {}) {
    const res = this.collection.insert(event_data, options);
    return res;
  }

  async getAll() {
    this.connect();
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${this.table}`;
      return this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          this.disconnect();
          reject(err);
        } else {
          this.disconnect();
          resolve(rows);
        }
      });
    });
  }

  async getOne(id) {
    const err = new Error();
    if (!id) {
      err.statusCode = 400;
      err.message = "id is needed.";
      throw err;
    }
    this.connect();
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${this.table} WHERE id = ?`;
      return this.db.get(sql, [id], (err, rows) => {
        if (err) {
          console.error(err.message);
          this.disconnect();
          reject(err);
        } else {
          console.log(rows);
          this.disconnect();
          resolve(rows);
        }
      });
    });
  }
}

module.exports = {
  TechnicianService
};
