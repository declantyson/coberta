(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	Finance
 *	v0.0.1
 *	02/08/2016
 *  
 */

window.Finance = React.createClass({displayName: "Finance",
    getInitialState: function() {
        return { data: [] }
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

        let className = "danger";

        return (
            React.createElement("div", null, 
                React.createElement("h1", {className: className}, 
                    "£2.21", 
                    React.createElement("span", null, "£12.79 spent")
                ), 
                React.createElement(TransactionList, null)
            )
        );
    }
});

window.TransactionList = React.createClass({displayName: "TransactionList",
   render: function () {

       let transactions = [0,1,2,3,4].map(function (i) {
           return (
                React.createElement(Transaction, {description: "Test transaction", value: "2.50"})
           );
       });

       return (
           React.createElement("div", {className: "transactions"}, 
               transactions, 

               React.createElement("div", {className: "transaction add-transaction"}, 
                   React.createElement("div", {className: "transaction-description"}, 
                       React.createElement("input", {type: "text", name: "transaction-description"})
                   ), 
                   React.createElement("div", {className: "transaction-value"}, 
                       React.createElement("input", {type: "number", name: "transaction-value"})
                   )
               )

           )
       );
   }
});

window.Transaction = React.createClass({displayName: "Transaction",
   render: function () {
       return (
           React.createElement("div", {className: "transaction"}, 
               React.createElement("div", {className: "transaction-description"}, this.props.description), 
               React.createElement("div", {className: "transaction-value"}, this.props.value)
           )
       )
   }
});

},{}]},{},[1]);
