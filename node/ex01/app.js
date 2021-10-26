const http = require('http');
const url = require('url');

//create a server object:
http.createServer(function (req, res) {
  const query = url.parse(req.url, true).query;
  console.log(req.method, req.url, req.headers, query)
  if (req.url=='/desconocido') {
      res.statusCode = 404
      res.statusMessage = 'Not found'
      res.end()
      return
  }
  if (req.url=='/reubicado') {
    res.writeHead(301,{Location: 'http://google.com/'})
    res.end()
    return
    }
    
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
