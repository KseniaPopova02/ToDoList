// IGNORE THIS FILE

var http = require("http");
const fs = require("fs");

let todoData = fs.readFileSync("db.json");
let todos = JSON.parse(todoData);

var server = http.createServer(function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.url == "/todos") {
    // set response header
    res.writeHead(200, { "Content-Type": "application/json" });

    // set response content
    res.write(JSON.stringify(todos.todos));
    res.end();
  }
});

server.listen(3000);
