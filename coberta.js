/* 
  * 
  *  coberta 
  *  Declan Tyson 
  *  v0.0.1 
  *  31/07/2017 
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
	document.body.className = "ready";
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

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	Card View
 *	v0.1.1
 *	29/06/2016
 *  
 */

window.Card = React.createClass({displayName: "Card",
    getInitialState: function() {
        return { data: [] };
    },
    getDataFromEndpoint: function() {
        var self = this;

        fetch(this.props.api).then(function(response) {
            return response.json().then(function(data) {
                self.setState({ data: data });
            });
        }).catch(function (err) {
            console.error(self.api, err.toString());
        });
    },
    componentDidMount: function() {
        if(this.props.data.length === 0 || this.props.api !== "") {
            this.getDataFromEndpoint();
            setInterval(this.getDataFromEndpoint, this.props.pollInterval);
        }

        mountedComponents++;
        if(mountedComponents >= document.getElementsByClassName('component').length) {
            renderComplete();
        }
    },
    render: function() {
        let data = this.props.data;
        if(data.length === 0 || this.props.api !== "") {
            data = this.state.data;
        }

        let children = [];
        if(typeof data.children !== "undefined" && data.children.length > 0) {
            children = renderPreparation(data.children);
        }
        children = children.map(function (child) {
            return (
                React.createElement("div", {id: child.wrapper.id, className: child.wrapper.className}, 
                    child.el
                )
            );
        });

        return (
            React.createElement("div", null, 
                React.createElement("h2", null, data.title), 
                React.createElement("div", {className: "childcomponents"}, 
                    children
                )
            )
        );
    }
});

},{}]},{},[1]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	MFP Chart
 *	v0.0.2
 *	31/07/2016
 *  
 */

window.MFPChart = React.createClass({displayName: "MFPChart",
    getInitialState: function() {
        return {
            data: [],
            macros: []
        }
    },
    getDataFromEndpoint: function() {
        var self = this;

        fetch(this.props.api).then(function(response) {
            return response.json().then(function(data) {
                self.setState({ data: data });
            });
        }).catch(function (err) {
            console.error(self.api, err.toString());
        });
    },
    componentDidMount: function() {
        if(this.props.data.length === 0 || this.props.api !== "") {
            this.getDataFromEndpoint();
            setInterval(this.getDataFromEndpoint, this.props.pollInterval);
        }

        this.getMfpMacroLimits();

        mountedComponents++;
        if(mountedComponents >= document.getElementsByClassName('component').length) {
            renderComplete();
        }
    },
    getMfpMacroLimits: function() {
        var self = this;

        fetch("/data/private/mfp.json").then(function(response) {
            return response.json().then(function(data) {
                self.setState({ macros: data.macros });
            });
        }).catch(function (err) {
            console.error(self.api, err.toString());
        });
    },
    render: function() {
        let data = this.props.data;
        if(data.length === 0 || this.props.api !== "") {
            data = this.state.data;
        }

        let macros = this.state.macros;

        if(macros.length === 0) return ( React.createElement("div", null, "Loading...") );

        let progress = {
                protein : (data.protein / macros.protein) * 100,
                carb    : (data.carb / macros.carb) * 100,
                fat     : (data.fat / macros.fat) * 100,
            },
            proteinClass = progress.protein > 100 ? "progress protein-progress overflow-progress" : "progress protein-progress",
            carbClass = progress.carb > 100 ? "progress carb-progress overflow-progress" : "progress carb-progress",
            fatClass = progress.fat > 100 ? "progress fat-progress overflow-progress" : "progress fat-progress";

        return (
            React.createElement("div", null, 
                React.createElement("label", null, "Protein ", React.createElement("p", null, data.protein, "/", React.createElement("span", null, macros.protein, "g"))), 
                React.createElement("div", {className: proteinClass, style: { width: progress.protein + "%"}}), 

                React.createElement("label", null, "Carb ", React.createElement("p", null, data.carb, "/", React.createElement("span", null, macros.carb, "g"))), 
                React.createElement("div", {className: carbClass, style: { width: progress.carb + "%"}}), 

                React.createElement("label", null, "Fat ", React.createElement("p", null, data.fat, "/", React.createElement("span", null, macros.fat, "g"))), 
                React.createElement("div", {className: fatClass, style: { width: progress.fat + "%"}})
            )
        );

    }
});

},{}]},{},[1]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	Static HTML View
 *	v0.1.0
 *	28/06/2016
 *  
 */

window.StaticHTML = React.createClass({displayName: "StaticHTML",
    getInitialState: function() {
        return { data: [] };
    },
    getDataFromEndpoint: function() {
        var self = this;

        fetch(this.props.api).then(function(response) {
            return response.json().then(function(data) {
                self.setState({ data: data });
            });
        }).catch(function (err) {
            console.error(self.api, err.toString());
        });
    },
    componentDidMount: function() {
        if(this.props.data.length === 0 || this.props.api !== "") {
            this.getDataFromEndpoint();
            setInterval(this.getDataFromEndpoint, this.props.pollInterval);
        }
        mountedComponents++;
        if(mountedComponents >= document.getElementsByClassName('component').length) {
            renderComplete();
        }
    },
    render: function() {
        var data = this.props.data;
        if(data.length === 0 || this.props.api !== "") {
            data = this.state.data;
        }

        return ( 
            React.createElement("div", {dangerouslySetInnerHTML: { __html: data.html}})
        );
    }
});

},{}]},{},[1]);
