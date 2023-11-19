# ERROR LOGS DATABASE
![Screenshot 2023-11-19 220941](https://github.com/codesmith17/ERROR_LOGS_DATABASE/assets/121955562/dc3a5841-562f-4e78-8d35-021226cde9f1)



https://github.com/codesmith17/ERROR_LOGS_DATABASE/assets/121955562/ad446014-c0ba-4622-9732-f79e6409008f




Welcome to the Log Viewer repository! Log Viewer is a powerful web-based tool designed to simplify the viewing and searching of log data stored in an SQLite database. The tool is equipped with features such as error logging, log search capabilities, and a modern user interface for a seamless experience.

## Features

- **Error Logging:** Easily send error JSON files to the server through the `/logs` endpoint for efficient database storage.
  
- **Log Search:** Utilize the responsive web interface to search logs based on keywords, streamlining the process of finding relevant information.

- **Modern UI:** Enjoy a clean and modern user interface that enhances usability and provides a visually pleasing experience.

## Installation

Follow these steps to get Log Viewer up and running:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/codesmith17/ERROR_LOGS_DATABASE
    ```

2. **Install Dependencies:**
    ```bash
    npm install sqlite3
    ```

3. **Send Error JSON:**
    Use your preferred method to send error JSON to the server (e.g., HTTP POST to http://localhost:3000/logs).
    ```bash
    curl -X POST -H "Content-Type: application/json" -d "path to logs.json file" http://localhost:3000/logs
    ```

4. **View Logs:**
    - Open `index.html` in a web browser.
    - Enter search terms in the search input to filter logs.

## Directory Structure

- **server.js:** Node.js server script handling log data storage.
  
- **index.html:** HTML file for log visualization and search functionality.
  
- **script.js:** JavaScript script for client-side log filtering.
  
- **styles.css:** CSS file for styling the HTML file.
  
- **database.db:** SQLite database file for storing log data.

## Database

The log data is stored in an SQLite database named `database.db`. The database schema includes fields such as level, message, resourceId, timestamp, traceId, spanId, commitHash, and parentResourceId.



Happy logging! 🚀






