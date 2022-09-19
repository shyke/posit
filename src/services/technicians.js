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

  async update({ id, eventData }) {
    await this.getOne(id);

    const { upsertedId } = await this.collection.updateOne(
      {
        _id: ObjectId(id)
      },
      {
        $set: eventData
      },
      {
        upsert: true
      }
    );
    const after = await this.getOne(upsertedId || id);

    return after;
  }

  async updateMany(list, type = false) {
    if (type && type === "merge_form") {
      for (const item of list) {
        if (item.verified === undefined) {
          await this.collection.updateOne(
            {
              _id: ObjectId(item._id)
            },
            {
              $set: { merged: item.merged, owner: item.owner }
            }
          );
        } else {
          await this.collection.updateOne(
            {
              _id: ObjectId(item._id)
            },
            {
              $set: {
                merged: item.merged,
                owner: item.owner,
                verified: item.verified
              }
            }
          );
        }
      }

      // const after = await this.getOne(upsertedId || id);

      return "Done";
    } else if (type && type === "update_form") {
      for (const item of list) {
        let updates = [];
        let updates_data = await this.collection.findOne(
          { _id: ObjectId(item._id) },
          { projection: { updates: 1 } }
        );

        if (updates_data && Array.isArray(updates_data.updates)) {
          // Check & Udate date if time change on the update form
          if (item.data.event_time && !item.data.event_date) {
            //console.log("*****************$$$$$$$$$$$$$$$$$$$$$@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!")
            const eventData = await this.collection.findOne({
              _id: ObjectId(item._id)
            });
            let date = new Date(eventData.event_date);
            let time = item.data.event_time.split(":");
            date.setHours(Number(time[0]));
            date.setMinutes(Number(time[1]));
            date.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
            let final = new Date(date);
            item.data.event_date = final.getTime();
          }
          updates = [...updates_data.updates];
          updates.push(new Date().getTime());
        } else {
          updates = [new Date().getTime()];
        }
        item.data["updates"] = updates;
        await this.collection.updateOne(
          {
            _id: ObjectId(item._id)
          },
          {
            $set: item.data
          }
        );
      }
      return { updated: true };
    }
  }

  async delete({ id }) {
    const before = await this.getOne(id);

    await this.collection.deleteOne({ _id: ObjectId(id) });

    delete before._id;

    return before;
  }

  async deleteList(list) {
    let deleted = [];
    for (const eventID of list) {
      deleted.push(eventID);
      await this.collection.deleteOne({ _id: ObjectId(eventID) });
    }

    return deleted;
  }
}

module.exports = {
  TechnicianService
};
