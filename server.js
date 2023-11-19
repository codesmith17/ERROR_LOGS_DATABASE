const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

app.use(express.json({ limit: "50mb" }));

app.post("/logs", async (req, res) => {
  const logDataArray = req.body;

  if (!Array.isArray(logDataArray)) {
    res.status(400).send("Bad Request: Expected an array of log entries.");
    return;
  }

  db.serialize(async () => {
    const runStatementAsync = (statement, data) => {
      return new Promise((resolve, reject) => {
        statement.run(data, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        });
      });
    };

    db.run("BEGIN TRANSACTION");

    const stmt = db.prepare(
      "INSERT INTO logs (level, message, resourceId, timestamp, traceId, spanId, commitHash, parentResourceId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    try {
      for (const logData of logDataArray) {
        const level = logData.level || null;
        const message = logData.message || null;
        const resourceId = logData.resourceId || null;
        const timestamp = logData.timestamp || null;
        const traceId = logData.traceId || null;
        const spanId = logData.spanId || null;
        const commitHash = logData.commit || null;
        const parentResourceId = logData.parentResourceId || null;

        await runStatementAsync(stmt, [
          level,
          message,
          resourceId,
          timestamp,
          traceId,
          spanId,
          commitHash,
          parentResourceId,
        ]);
      }

      stmt.finalize();

      db.run("COMMIT", () => {
        res
          .status(200)
          .send("Logs received and saved successfully. Acknowledged.");
      });
    } catch (error) {
      db.run("ROLLBACK");
      console.error("Error inserting logs:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/getLogs", (req, res) => {
  db.all("SELECT * FROM logs", (err, logs) => {
    if (err) {
      console.error("Error querying logs:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).json(logs);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing SQLite database:", err.message);
    } else {
      console.log("Closed SQLite database connection");
      process.exit();
    }
  });
});
