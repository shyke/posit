const sqlite3 = require("sqlite3").verbose();

function DB() {
  // Sanity Check

  connect = () => {
    this.db = new sqlite3.Database(
      "./db/task.db",
      sqlite3.OPEN_READWRITE,
      err => {
        if (err) {
          console.error(err.message);
        }
        console.log("Connected to the task database.");
      }
    );
  };
}

module.exports = DB;

/*
let db = new sqlite3.Database("./db/task.db", sqlite3.OPEN_READWRITE, err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the task database.");
});

let customers = "customers";
let warehouses = "warehouses";
let technicians = "technicians";

let sql = `SELECT * FROM technicians`;

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach(row => {
    console.log(row);
  });
});

// close the database connection
db.close(err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Close the database connection.");
});
*/
