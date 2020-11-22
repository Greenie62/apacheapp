const http = require("http");
const fs = require('fs');
const path = require("path")



http.createServer((req,res)=>{
    var fileName = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

    let extname = path.extname(fileName);
    let contentType;

    switch(extname){

        case ".js":
            contentType="application/json"
        break;

        case ".css":
            contentType="text/css"
        break;

        case ".html":
            contentType="text/html"
        break;

        default:
            console.log("Unknown MIME type")
    }

    fs.readFile(fileName,(err,content)=>{
        if(err)throw err;
        res.writeHead(200,{'Content-Type':contentType})
        res.end(content)
    })
}).listen(3001,console.log(`Listening in on port 3001, ${process.env.USER}`))