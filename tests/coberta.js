/*
 *  Coberta / Tests / Application
 *  Declan Tyson
 *  v0.1.1
 *  31/07/2017
 */

const notYetImplemented = false;

describe('Coberta', function() {

    it('should probably have a fancy clock, because all dashboards have a fancy clock', function(){
        assert(notYetImplemented, 'fancy clock not found');
    });

    it('should show different items based on the time of day', function(){
        assert(notYetImplemented, 'thingy still todo');
    });

    it('should pull open issues assigned to me from my HWC tracker for a list of specified projects', function(){
        assert(notYetImplemented, 'hwc issues not found');
    });

    it('should pull open stories assigned to me from my current project jira', function(){
        assert(notYetImplemented, 'jira stories not found');
    });

    it('should pull my latest run data from fitbit and when I am next scheduled for exercise', function(){
        assert(notYetImplemented, 'fitbit data not found');
    });

    describe('MyFitnessPal integration', function () {
        let mfpTestData = [{
            "type" : "Card",
            "api"  : "",
            "data" : {
                "title" : "Nutrition",
                "children": [{
                    "type": "MFPChart",
                    "api": "",
                    "data": {
                        "protein": "24",
                        "carb": "44",
                        "fat": "19"
                    }
                }]
            }
        }];

        renderViews(mfpTestData);

        let mfpHeader  = document.querySelector('.component.card').querySelector('h2');

        it('should have a card with the title "Nutrition"', function(){
            assert(cardHeader.innerText === "Nutrition", `expected card title "Nutrition", instead ${cardHeader.innerText}`);
        });

    });

    it('should pull the last paragraph from the latest modified blog from the 2017.declantyson repository and provide me with an option to extend it', function(){
        assert(notYetImplemented, 'blog data not found');
    });

    it('should prompt me at a specified time on a specified day to write a paragraph on a specified blog topic and save it to a .md file in the 2017.declantyson repository', function(){
        assert(notYetImplemented, 'blog prompt not found');
    });

    it('should pull the last paragraph of the last chapter I worked on in StoryStore and provide me with an option to extend it', function(){
        assert(notYetImplemented, 'book data not found');
    });

    it('should prompt me at a specified time on a specified day to write a paragraph on the last chapter I worked on in StoryStore', function(){
        assert(notYetImplemented, 'book prompt not found');
    });

});
