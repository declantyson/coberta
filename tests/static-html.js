/*
 *  Coberta / Tests / Static HTML
 *  Declan Tyson
 *  v0.1.1
 *  31/07/2017
 */

var staticHTMLSchema = [{
    "type" : "StaticHTML",
    "api"  : "",
    "data" : {
        "html"  : "<h1>Test HTML</h1>"
    }
}];

describe('Static HTML', function() {

    let content = renderViews(staticHTMLSchema, false);

    it('should output the HTML passed in', function () {
        var staticHTML  = content.querySelectorAll('.component.statichtml h1');

        assert(staticHTML.length === 1, `expected to find 1 h1 tag, instead ${staticHTML.length}`);
        assert(staticHTML[0].innerText === "Test HTML", `expected to read 'Test HTML', instead ${staticHTML[0].innerText}`);
    });

});
