/* 
  * 
  *  coberta 
  *  Declan Tyson 
  *  v0.0.1 
  *  28/06/2017 
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

function renderViews(views) {
	var content = document.getElementById("content");

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
