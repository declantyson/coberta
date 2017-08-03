/*
 *  Coberta / Local Server
 *  Declan Tyson
 *  v0.3.1
 *  03/08/2017
 */

const http = require('http'),
    ejs = require('ejs'),
    fs = require('fs'),
    express = require('express'),
    mfp = require('mfp'),
    bodyParser = require('body-parser'),
    app = express(),
    port = 1234;

app.use("/renderer", express.static('renderer'));
app.use("/views", express.static('views'));
app.use("/data", express.static('data'));
app.use("/libs", express.static('libs'));
app.use("/node_modules", express.static('node_modules'));
app.use("/fonts", express.static('fonts'));
app.use("/img", express.static('renderer/img'));
app.use("/media", express.static('media'));
app.use("/tests", express.static('tests'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        try {
            mfp.fetchSingleDate(username, today.toISOString().substring(0, 10), 'all', function (data) {
                res.json(data);
            });
        } catch (ex) {
            console.error(ex);
        }
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

app.get('/finance/transaction/:date', (req, res) => {
    let path = `data/private/finance_${req.params.date}.json`;
    if(!fs.existsSync(path)) {
        let defaultObject = {
            "date"  : req.params.date,
            "transactions"  :  []
        };

        fs.writeFile(path, JSON.stringify(defaultObject), function (err) {
            if(err) {
                res.statusCode = 500;
                res.end("Error check logs");
                console.error(err);

                return;
            }

            res.end(JSON.stringify(defaultObject));
        });

        return;
    }

    fs.readFile(path, 'utf8', (err, content) => {
        if (err) {
            res.statusCode = 500;
            res.end("Error check logs");
            console.error(err);

            return;
        }
        res.end(content);
    });
});

app.post('/finance/transaction/:date', (req, res) => {
    let path = `data/private/finance_${req.params.date}.json`;

    fs.writeFile(path, JSON.stringify(req.body), function (err) {
        if(err) {
            res.statusCode = 500;
            res.end("Error check logs");
            console.error(err);

            return;
        }

        res.end(JSON.stringify(req.body));
    });
});


http.createServer(app).listen(port);

console.log(`App running on ${port}`);
