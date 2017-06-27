/*
 *  React Schnell / Tests
 *  Declan Tyson
 *  v0.1.0
 *  27/06/2017
 */

var testViewSchema = [{
    "type" : "TestView",
    "api"  : "",
    "data" : {
        "testItems" : [
            { "text" : "Test Item A"},
            { "text" : "Test Item B"},
        ]
    }
}];

describe('TestView', function() {

    it('should have two children', function () {
        renderViews(testViewSchema);
        var testItem  = document.querySelectorAll('.component.testview p');

        assert(testItem.length === 2, `expected 2 test items, instead ${testItem.length}`);
    });

});
