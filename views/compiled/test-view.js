(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	Test View
 *	v0.1.0
 *	22/06/2016
 *  
 */

window.TestView = React.createClass({displayName: "TestView",
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

        if(data.length === 0) return false;
        var testItems = data.testItems.map(function (i) {
            return (
                React.createElement(TestItem, {text: i.text})
            );
        });
        return ( 
            React.createElement("div", null, 
                React.createElement("h2", {className: "testView"}, "Test items"), 
                testItems
            )
        );
    }
});

window.TestItem = React.createClass({displayName: "TestItem",
    render: function() {
        return (
            React.createElement("p", null, this.props.text)
        )
    }
});

},{}]},{},[1]);
