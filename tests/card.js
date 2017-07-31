/*
 *  Coberta / Tests / Static HTML
 *  Declan Tyson
 *  v0.1.2
 *  31/07/2017
 */

var cardSchema = [{
    "type" : "Card",
    "api"  : "",
    "data" : {
        "title"    : "Test card",
        "children" : []
    }
},{
    "type" : "Card",
    "api"  : "",
    "data" : {
        "title"    : "Test card",
        "children" :  [
            {
                "type"  : "StaticHTML",
                "api"  : "",
                "data"  : {
                    "html"  : "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet orci fringilla, congue dolor ut, consectetur ex. In purus risus, ornare imperdiet scelerisque eu, porta rutrum tortor. Aenean tempor velit nec sem interdum, ut finibus magna suscipit.</p>"
                }
            }
        ]
    }
}];

describe('Card', function() {
    let content = renderViews(cardSchema, false);

    it('should output a card', function () {
        var cards  = content.querySelectorAll('.component.card');

        assert(cards.length >= 2, `expected to find at least 2 cards, instead ${cards.length}`);
    });

    it('should contain a title', function () {
        var cardHeader  = content.querySelector('.component.card').querySelector('h2');

        assert(cardHeader.innerText === "Test card", `expected card header, instead ${cardHeader.innerText}`);
    });

    it('should contain HTML when given StaticHTML children', function() {
        var paragraph = content.querySelectorAll('.component.card .component.statichtml p');

        assert(paragraph.length === 1, `expected to find 1 paragraph, instead ${paragraph.length}`);
    });

});
