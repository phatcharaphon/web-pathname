const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(req.url);

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    let extname = path.extname(filePath);

    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            // Prevent complex url such as /tttt/ttttt, /oooo/ooo/o
            filePath = path.join(__dirname, 'css', 'style.css');
            break;
        case '.jpg':
            contentType = 'image/jpg'
            break;
        case '.json':
            contentType = 'application/json'
            break;
    }
    if (contentType == "text/html" && extname == "") filePath += ".html";

    console.log(filePath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    res.writeHead(200, { 'content-type': 'text/html' });
                    res.end(content);
                })
            } else {
                res.writeHead(200, { 'content-type': 'text/html' });
                res.end(SVGTextContentElement);
            }
        }else{
            res.writeHead(200, {'content-type': contentType});
            res.end(content);
        }
    })
});

const port = process.env.PORT || 5500;
server.listen(port, () => console.log('Server is runing on port ', port));