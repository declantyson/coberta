/*
 *
 *	Renderer
 *	v0.1.3
 *	28/08/2017
 *  
 */ 

var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
	assetFolder = "/img",
	mountedComponents = 0,
	defaultPollInterval = 5000,
	scrollIndex = 1,
	fullScreenComponents = false;

function setAssetFolder(dir) {
    assetFolder = dir;
}

function renderViews(views, append = true) {
	var content = document.getElementById("content");
	if(!append) content = document.createElement("div");

    // Fetch a nice background
	fetch("https://www.reddit.com/r/EarthPorn+SpacePorn+RoomPorn/hot.json").then(function(response){
		return response.json();
	}).then(function (json) {
		document.getElementsByTagName('body')[0].style.backgroundImage = "url(" + json.data.children[0].data.url + ")";
        if(mountedComponents >= document.getElementsByClassName('component').length) document.body.className = "ready";
    });


	for(var i = 0; i < views.length; i++) {
		var view = views[i],
			componentType = view.type,
			api = view.api,
			data = view.data,
			pollInterval = view.pollInterval || defaultPollInterval,
			el = React.createElement(window[componentType], { data: data, pollInterval: pollInterval, api: api }),
			wrapper = document.createElement('div');

		wrapper.id = generateId();
		wrapper.className = "component " + componentType.toLowerCase();
		content.appendChild(wrapper);

		ReactDOM.render(el, wrapper);
	}

	if(fullScreenComponents) {
		var components = document.getElementsByClassName('component');
		for (var c = 0; c < components.length; c++) {
			components[c].style.height = windowHeight + "px";
		}
	}

	return content;
}

function renderPreparation(views) {
	var preppedViews = [];

    for(var i = 0; i < views.length; i++) {
        var view = views[i],
            componentType = view.type,
            api = view.api,
            data = view.data,
            pollInterval = view.pollInterval || defaultPollInterval,
            el = React.createElement(window[componentType], { data: data, pollInterval: pollInterval, api: api }),
            wrapper = document.createElement('div');

        wrapper.id = generateId();
        wrapper.className = "component " + componentType.toLowerCase();

        preppedViews.push({
			el 		: el,
			wrapper : wrapper
		})
    }

    return preppedViews;
}

function renderComplete() {
	if(document.getElementsByTagName('body')[0].style.backgroundImage !== "") document.body.className = "ready";
	if(fullScreenComponents) {
		document.body.className += " fullscreencomponents"
	}
}

function generateId() {
    var id = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        id += characters.charAt(Math.floor(Math.random() * characters.length));

    return id;
}
