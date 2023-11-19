const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function fetchDataAndGenerateHTML() {
  const db = new sqlite3.Database(
    "database.db",
    sqlite3.OPEN_READONLY,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Connected to the SQLite database");

        fetchLogsDataFromDatabase(db, (logsData) => {
          generateHTMLFile(logsData);

          // Add an input prompt for search
          rl.question("Enter search term: ", (searchTerm) => {
            const filteredLogs = logsData.filter((log) => {
              // Check if any value in the row contains the search term
              for (const key in log) {
                if (
                  log.hasOwnProperty(key) &&
                  String(log[key])
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return true;
                }
              }
              return false;
            });

            // Regenerate HTML with filtered data
            generateHTMLFile(filteredLogs);

            rl.close();

            db.close((err) => {
              if (err) {
                console.error(err.message);
              } else {
                console.log("Closed the database connection");
              }
            });
          });
        });
      }
    }
  );
}

function fetchLogsDataFromDatabase(db, callback) {
  const logsData = [];

  const query = "SELECT * FROM logs";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      rows.forEach((row) => {
        logsData.push(row);
      });

      callback(logsData);
    }
  });
}

function generateHTMLFile(logsData) {
  const tableContent = createTableContent(logsData);
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="styles.css">
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
          }
  
          #searchContainer {
              margin-top: 20px;
              text-align: center;
              animation: fadeInDown 0.8s ease-out;
          }
  
          label {
              font-size: 18px;
              color: #333;
          }
  
          #searchInput {
              padding: 12px;
              font-size: 16px;
              border: 2px solid #3498db;
              border-radius: 6px;
              transition: border-color 0.3s ease;
              width: 300px;
              outline: none;
          }
  
          #searchInput:focus {
              border-color: #007bb5;
          }
  
          #logTableContainer {
              margin-top: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border-radius: 8px;
              animation: fadeInUp 0.8s ease-out;
          }
  
          table {
              width: 100%;
              border-collapse: collapse;
              overflow: hidden;
              border-radius: 8px;
          }
  
          th,
          td {
              padding: 16px;
              text-align: left;
              border-bottom: 1px solid #ddd;
          }
  
          th {
              background-color: #3498db;
              color: white;
          }
  
          tr:hover {
              background-color: #ecf0f1;
              transition: background-color 0.3s ease;
          }
  
          @keyframes fadeInDown {
              from {
                  opacity: 0;
                  transform: translateY(-20px);
              }
  
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
  
          @keyframes fadeInUp {
              from {
                  opacity: 0;
                  transform: translateY(20px);
              }
  
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
      </style>
      <title>Log Viewer</title>
  </head>
  
  <body>
      <div id="searchContainer">
          <label for="searchInput">Search:</label>
          <input type="text" id="searchInput" placeholder="Enter search term...">
      </div>
      <div id="logTableContainer">
          <table>
              ${tableContent}
          </table>
      </div>
      <script>
          const searchInput = document.getElementById("searchInput");
          const tableRows = document.querySelectorAll("tbody tr");
  
          searchInput.addEventListener("input", function () {
              const searchTerm = searchInput.value.toLowerCase();
  
              tableRows.forEach((row) => {
                  const rowData = Array.from(row.children).map(cell => cell.textContent.toLowerCase());
                  if (rowData.some(cellValue => cellValue.includes(searchTerm))) {
                      row.style.display = "";
                  } else {
                      row.style.display = "none";
                  }
              });
          });
      </script>
  </body>
  
  </html>
  
  
  
        `;

  fs.writeFileSync("index.html", htmlContent);
  console.log("HTML file generated: index.html");
}

function createTableContent(logsData) {
  let tableContent = "<thead><tr>";

  // Add table headers
  for (const key in logsData[0]) {
    if (logsData[0].hasOwnProperty(key)) {
      tableContent += `<th>${key}</th>`;
    }
  }

  tableContent += "</tr></thead><tbody>";

  // Add table data
  logsData.forEach((log) => {
    tableContent += "<tr>";
    for (const key in log) {
      if (log.hasOwnProperty(key)) {
        tableContent += `<td>${log[key]}</td>`;
      }
    }
    tableContent += "</tr>";
  });

  tableContent += "</tbody>";

  return tableContent;
}

fetchDataAndGenerateHTML();
