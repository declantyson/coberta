(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	MFP Chart
 *	v0.1.1
 *	04/08/2016
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

        fetch("/config/mfp").then(function(response) {
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

        if(!data.calories) data.calories = 0;
        if(!data.protein) data.protein = 0;
        if(!data.carbs) data.carbs = 0;
        if(!data.fat) data.fat = 0;

        let macros = this.state.macros;
        if(macros.length === 0) return ( React.createElement("div", null, "Loading...") );

        let progress = {
                calories : (data.calories / macros.calories) * 100,
                protein  : (data.protein / macros.protein) * 100,
                carbs    : (data.carbs / macros.carbs) * 100,
                fat      : (data.fat / macros.fat) * 100,
            },
            caloriesClass = progress.calories > 100 ? "progress calories-progress overflow-progress" : "progress calories-progress",
            proteinClass = progress.protein > 100 ? "progress protein-progress overflow-progress" : "progress protein-progress",
            carbClass = progress.carbs > 100 ? "progress carb-progress overflow-progress" : "progress carb-progress",
            fatClass = progress.fat > 100 ? "progress fat-progress overflow-progress" : "progress fat-progress";

        return (
            React.createElement("div", null, 
                React.createElement("label", null, "Calories ", React.createElement("p", null, data.calories, "/", React.createElement("span", null, macros.calories))), 
                React.createElement("div", {className: caloriesClass, style: { width: progress.calories + "%"}}), 

                React.createElement("label", null, "Protein ", React.createElement("p", null, data.protein, "/", React.createElement("span", null, macros.protein, "g"))), 
                React.createElement("div", {className: proteinClass, style: { width: progress.protein + "%"}}), 

                React.createElement("label", null, "Carb ", React.createElement("p", null, data.carbs, "/", React.createElement("span", null, macros.carbs, "g"))), 
                React.createElement("div", {className: carbClass, style: { width: progress.carbs + "%"}}), 

                React.createElement("label", null, "Fat ", React.createElement("p", null, data.fat, "/", React.createElement("span", null, macros.fat, "g"))), 
                React.createElement("div", {className: fatClass, style: { width: progress.fat + "%"}})
            )
        );

    }
});

},{}]},{},[1]);
