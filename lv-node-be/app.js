const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'public/' })
var fs = require('fs')

const app = express()
const port = 3001

//curl http://localhost:3001/data/test.txt  
app.use('/data', express.static('public'))

app.use(express.json())

//applies to all requests
app.use(function (req, res, next) {
    //console.log(req)
    console.log("################################################################")
    console.log("path", req.path)
    console.log("query", req.query)
    console.log("rawHeaders", req.rawHeaders)
    console.log("headers", req.headers)
    console.log("body", req.body)
    console.log("params", req.params)
    next()
})

//curl http://localhost:3001/ping
app.get('/ping', (req, res) => {  
  res.end(JSON.stringify({ ping: "pong" }))
})

//curl -F 'data=@./howto.txt' "http://localhost:3001/upload?path=public/howto.txt"
app.post('/upload', upload.single('data'), function (req, res) {
    console.log("req.file", req.file)
    console.log("req.query.path", req.query.path)
    fs.renameSync(req.file.path, req.query.path)
    res.end("ok")
})

//curl -X POST http://localhost:3001/net/setup/eth0 -H "Content-Type: application/json" -d '{"prop":"val"}'
//curl -X POST http://localhost:3001/net/setup/eth0 -d '{"prop":"val"}' (wont parse body)
app.post('/net/setup/:name', (req, res) => {  
    console.log("name", req.params.name)
    console.log("body", req.body)
    res.end("ok")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})