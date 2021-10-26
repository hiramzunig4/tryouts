const http = require('http');
const url = require('url');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db3');

//create a server object:
http.createServer(function (req, res) {
  const query = url.parse(req.url, true).query;
  console.log(req.method, req.url, req.headers, query)

  if (req.method=="POST" && req.url=='/table/init') {
    db.run("CREATE TABLE events (name TEXT)");
    res.write('OK');      
    res.end()
    return
}

  if (req.method=="POST" && req.url=='/table/new') {
      var stmt = db.prepare("INSERT INTO events VALUES (?)");
      stmt.run(req.headers["name"]);
      stmt.finalize();
      res.write('OK');            
      res.end()
      return
  }
  if (req.method=="GET" && req.url=='/table') {
    db.all("SELECT name FROM events", [], (err, rows) => {
      rows.forEach(function(row){
        res.write(row.name + "\n");
      })
      res.end()  
    });
    return
  }
  
  res.statusCode = 404
  res.statusMessage = 'Not found'
  res.end()
}).listen(8080); //the server object listens on port 8080
