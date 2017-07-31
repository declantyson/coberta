(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	MFP Chart
 *	v0.0.1
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
        let self = this,
            data = self.props.data,
            macros = self.state.macros;

        if(macros.length === 0) return ( React.createElement("div", null, "Loading...") );

        return (
            React.createElement("div", null, 
                React.createElement("label", null, "Protein ", macros.protein, "g"), 
                React.createElement("label", null, "Carbs ", macros.protein, "g"), 
                React.createElement("label", null, "Fat ", macros.fat, "g")
            )
        );

    }
});

},{}]},{},[1]);
