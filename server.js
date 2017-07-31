/*
 *  Coberta / Local Server
 *  Declan Tyson
 *  v0.2.1
 *  22/06/2017
 */

const http = require('http'),
    ejs = require('ejs'),
    fs = require('fs'),
    express = require('express'),
    mfp = require('mfp'),
    app = express(),
    port = 1234;

app.use("/renderer", express.static('renderer'));
app.use("/views", express.static('views'));
app.use("/data", express.static('data'));
app.use("/libs", express.static('libs'));
app.use("/node_modules", express.static('node_modules'));
app.use("/fonts", express.static('fonts'));
app.use("/img", express.static('media'));
app.use("/media", express.static('media'));
app.use("/tests", express.static('tests'));

app.get('/', (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('index.ejs', 'utf8', (err, wrapperContent) => {
        if (err) {
            res.statusCode = 500;
            res.end(err);
            return;
        }
        fs.readFile('data/index.json', 'utf-8', (err, content) => {
            if (err) {
                res.statusCode = 500;
                res.end(err);
                return;
            }

            let renderedHtml = ejs.render(wrapperContent, { data: content });
            res.end(renderedHtml);
        });
    });
});


app.get('/tests', (req,res) => {
    fs.readFile('tests/testrunner.html', 'utf-8', (err, content) => {
        if (err) {
            res.statusCode = 500;
            res.end(err);
            return;
        }

        let renderedHtml = ejs.render(content);
        res.end(renderedHtml);
    });
});

app.get('/mfp', (req, res) => {
    let today = new Date();
    fs.readFile('data/private/mfp.json', 'utf8', (err, content) => {
        if (err) {
            res.statusCode = 500;
            res.end(err);
            return;
        }

        let username = JSON.parse(content).username;

        mfp.fetchSingleDate(username, today.toISOString().substring(0, 10), 'all', function (data) {
            res.json(data);
        });
    });
});

app.get('/:file', (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('index.ejs', 'utf8', (err, wrapperContent) => {
        if (err) {
            res.statusCode = 500;
            res.end(err);
            return;
        }
        if(!fs.existsSync(`data/${req.params.file}.json`)) {
            res.statusCode = 404;
            res.end("404");
            return;
        }

        fs.readFile(`data/${req.params.file}.json`, 'utf-8', (err, content) => {
            if (err) {
                res.statusCode = 500;
                res.end(err);
                return;
            }

            let renderedHtml = ejs.render(wrapperContent, { data: content });
            res.end(renderedHtml);
        });
    });
});


http.createServer(app).listen(port);

console.log(`App running on ${port}`);
