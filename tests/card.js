/*
 *  Coberta / Tests / Static HTML
 *  Declan Tyson
 *  v0.1.0
 *  28/06/2017
 */

var cardSchema = [{
    "type" : "Card",
    "api"  : "",
    "data" : {
        "title" : "Test card"
    }
}];

describe('Card', function() {

    it('should output a card', function () {
        renderViews(cardSchema);
        var cards  = document.querySelectorAll('.component.card');

        assert(cards.length === 1, `expected to find 1 card, instead ${cards.length}`);
    });

    it('should contain a title', function () {
        renderViews(cardSchema);
        var cardHeader  = document.querySelector('.component.card h2');

        assert(cardHeader.innerText === "Test card", `expected card to be blank, instead ${cardHeader.innerText}`);
    });

});
