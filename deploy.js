/*
 *  React Schnell / Deploy Standalone
 *  Declan Tyson
 *  v0.5.0
 *  15/06/2017
 */

import { LOCAL_API_URL, STAGE_API_URL, REMOTE_API_URL } from 'deploy-config';

const request   = require('request'),
    fs        = require('fs'),
    fsPath    = require('fs-path'),
    fsExtra   = require('fs-extra'),
    api       = {
        remote : REMOTE_API_URL,
        stage  : STAGE_API_URL,
        local  : LOCAL_API_URL
    },
    api_src   = process.env.npm_config_src || 'local',
    api_base  = api[api_src],
    media_api = '',
    page_list = {
        remote : `${REMOTE_API_URL}/page_list_handler`,
        stage  : `${STAGE_API_URL}/page_list_handler`,
        local  : `${LOCAL_API_URL}/page_list.json`
    },
    rootUrl   = {
        remote : "",
        stage  : "",
        local  : ""
    };

const savePage = (wrapperContent, page) => {
    request.get(api_base + page.url, (err, res, body) => {
        let path = page.url;
        path = path === '/' ? 'index' : page.url.replace(/\//g, '');

        if (err) {
            console.log(err);
        }

        fsPath.writeFile(`${__dirname}/output/data/${path}.json`, body, (err) => {
            let renderedHtml = wrapperContent.replace(/____root____/g, rootUrl[api_src]).replace(/____url____/g, `/data/${path}.json?_u=${pen.generateId()}`).replace(/____title____/g, page.title);
            fsPath.writeFile(`${__dirname}/output/${page.url}index.html`, renderedHtml, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Successfully saved ${page.url} to ${page.url}`);
                }
            });
        });
    });
};

const copyResources = (folder, rename = folder) => {
    fsExtra.ensureDir(`${__dirname}/output/${rename}`, (err) => {
        if(err) console.log(err);
        fsExtra.copy(`${__dirname}/${folder}`, `${__dirname}/output/${rename}`, (err) => {
            if(err) console.log(err);
            console.log(`Copied ${folder} resources.`);
        });
    });
};
// Create pages

request.get(page_list[api_src], 'utf8', (err, res, body) => {
    if (err) {
        console.log(err);
    }

    fsPath.writeFile(`${__dirname}/output/data/page_list.json`, body, (err) => {
        if (err) {
            console.log(err);
        }
    });

    let pages = JSON.parse(body);

    fs.readFile('index_rendered.html', 'utf8', (err, wrapperContent) => {
        if (err) {
            console.log(err);
        }
        pages.forEach((page) => {
            savePage(wrapperContent, page);

            // TODO : recurse this
            page.children.forEach((child) => {
                savePage(wrapperContent, child);


            });
        });
    });
});

// Download media
request.get(media_api, (err, res, body) => {
    let images = JSON.parse(body);

    for(var i = 0; i < images.length; i++) {
        let uri = images[i].url,
            path = `output/media/${images[i].filename}`;

        if (!fs.existsSync(path)) {
            request.head(uri, function (err, res, body) {
                request(uri).pipe(fs.createWriteStream(path)).on('close', function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Downloaded " + uri);
                });
            });
        } else {
            console.log(path + " already exists.");
        }
    }
});

// Copy resources

let resources = [['img', 'media'], ['media', 'media'], ['libs', 'js'], ['fonts', 'fonts']];
resources.forEach((resource) => {
    copyResources(resource[0], resource[1]);
});

fs.readFile('views.js', 'utf8', (err, content) => {
    if (err) {
        console.log(err);
        return;
    }
    fsPath.writeFile(`${__dirname}/output/js/views.js`, content, (err) => {
        if (err) console.log(err);
    });
});

fs.readFile(`${__dirname}/views/compiled/styles.css`, 'utf8', (err, content) => {
    if (err) {
        console.log(err);
        return;
    }
    fsPath.writeFile(`${__dirname}/output/css/styles.css`, content, (err) => {
        if (err) console.log(err);
    });
});
