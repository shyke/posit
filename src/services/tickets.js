const sqlite3 = require("sqlite3").verbose();

class TicketsService {
  constructor() {
    this.connected = false;
    this.table = "tickets";
  }

  connect() {
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
      // this.connected = false;
    });
  }

  async create(data, options = {}) {
    this.connect();
    let ticket_id = await new Promise((resolve, reject) => {
      const cols = Object.keys(data).join(", ");
      const placeholders = Object.keys(data)
        .fill("?")
        .join(", ");
      return this.db.run(
        "INSERT INTO tickets (" + cols + ") VALUES (" + placeholders + ")",
        Object.values(data),
        function(err, db = this) {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
    this.disconnect();
    return ticket_id;
  }

  async getAll(technician) {
    this.connect();
    return new Promise((resolve, reject) => {
      let sql = technician
        ? `SELECT * FROM ${this.table} WHERE technician_id = ${technician}`
        : `SELECT * FROM ${this.table}`;
      return this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          if (err.message.includes("no such table")) resolve([]);
          else reject(err);
          this.disconnect();
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

  async delete(id) {
    this.connect();
    return new Promise((resolve, reject) => {
      let sqlQuery = `SELECT * FROM ${this.table} WHERE id = ?`;
      this.db.get(sqlQuery, [id], (err, rows) => {
        if (err) {
          console.error(err.message);
          this.disconnect();
          reject(err);
        } else {
          let sql = `DELETE FROM ${this.table} WHERE id = ?`;
          return this.db.run(sql, [id], err => {
            if (err) {
              console.error(err.message);
              this.disconnect();
              reject(err);
            } else {
              this.disconnect();
              resolve(rows);
            }
          });
        }
      });
    });

    await this.collection.deleteOne({ _id: ObjectId(id) });

    delete before._id;

    return before;
  }
}

module.exports = {
  TicketsService
};
