const sqlite3 = require("sqlite3").verbose();
class WarehouseService {
  /**
   * Creates an instance of ProductService.
   * @param {object} app fastify app
   * @memberof CustomerService
   */
  constructor(app) {
    this.connected = false;
    this.table = "warehouses";
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

  async getEventsCount() {
    const count = this.collection.countDocuments();
    return count;
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

  async update({ id, data }) {
    let { key, value } = data;
    const err = new Error();
    if (!id || !key || typeof value !== "number") {
      err.statusCode = 400;
      err.message = "id & data are needed.";
      throw err;
    }
    this.connect();
    return new Promise((resolve, reject) => {
      let sql = `UPDATE ${this.table}
                  SET ${key} = ${value}
                  WHERE id = ${id}`;

      return this.db.run(sql, [], err => {
        if (err) {
          console.error(err.message);
          this.disconnect();
          reject(err);
        } else {
          console.log(this.changes);
          this.disconnect();
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = {
  WarehouseService
};
