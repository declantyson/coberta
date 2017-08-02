(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *
 *	Finance
 *	v0.1.1
 *	02/08/2016
 *  
 */

window.Finance = React.createClass({displayName: "Finance",
    getInitialState: function() {
        return {
            data: {}
        }
    },
    setFinanceData: function(day, key) {
        var self = this;

        fetch(`${this.props.api}_${day}.json`).then(function(response) {
            return response.json().then(function(data) {
                let financialData = self.state.data;
                financialData[key] = data;
                self.setState({ data: financialData });
            });
        }).catch(function (err) {
            console.error(self.api, err.toString());
        });
    },
    getDataFromEndpoint: function () {
        let data = this.props.data,
            day = new Date();

        if(data.day === "Today") {
            this.setFinanceData(day.toISOString().substring(0, 10), "Today");
        }

        day = new Date(day.setDate(day.getDate() - 1));
        this.setFinanceData(day.toISOString().substring(0, 10), "Yesterday");
    },
    componentDidMount: function() {
        this.getDataFromEndpoint();
        //setInterval(this.getDataFromEndpoint, this.props.pollInterval);

        mountedComponents++;
        if(mountedComponents >= document.getElementsByClassName('component').length) {
            renderComplete();
        }
    },
    updateTransactionList: function(transaction) {
        let data = this.props.data,
            financialData = this.state.data,
            dayData = financialData[data.day];

        dayData.transactions.push(transaction);
        financialData[data.day] = dayData;

        this.setState({
           data : financialData
        });
    },
    render: function() {
        let self = this,
            data = self.props.data,
            financialData = self.state.data,
            total = 0,
            budget = 15, // TODO: make this configurable
            remaining = budget,
            dayClass = `finance_day-${data.day}`,
            statusClass = "",
            sign = "";

        if(typeof financialData[data.day] !== "undefined") {
            financialData[data.day].transactions.map(function (transaction) {
                total += transaction.value;
            });

            if(data.day === "Today") {
                let spentYesterday = 0;

                financialData.Yesterday.transactions.map(function (transaction) {
                    spentYesterday += transaction.value;
                });
                budget = (budget + (budget - spentYesterday)).toFixed(2);
            }
        }

        remaining = (budget - total).toFixed(2);

        if(remaining < 0) {
            statusClass = "danger";
            sign = "-";
            remaining = remaining * -1;
        }

        return (
            React.createElement("div", {className: dayClass}, 
                React.createElement("h1", {className: statusClass}, 
                    sign, "£", remaining, 
                    React.createElement("span", null, "£", React.createElement("em", {className: "day-total"}, total), " spent")
                ), 
                React.createElement(TransactionList, {transactions: financialData[data.day], updateTransactionList: self.updateTransactionList})
            )
        );
    }
});

window.TransactionList = React.createClass({displayName: "TransactionList",
    getInitialState: function() {
        return {
            transactionDescriptionInputId : generateId(),
            transactionValueInputId : generateId()
        }
    },
    addToList: function() {
        let transactionName = document.getElementById(this.state.transactionDescriptionInputId).value,
            transactionValue = document.getElementById(this.state.transactionValueInputId).value,
            transaction = {
                "description" : transactionName,
                "value"      : parseFloat(transactionValue)
            };

        if(isNaN(parseFloat(transactionValue))) {
            alert("error"); // todo: nice
            return;
        }

        this.props.updateTransactionList(transaction);
    },

    render: function () {
        if(typeof this.props.transactions === "undefined") return ( React.createElement("div", null, "Loading...") );

        let self = this,
            transactionData = self.props.transactions,
            transactions = transactionData.transactions.map(function (transaction) {
            return (
                 React.createElement(Transaction, {description: transaction.description, value: transaction.value})
            );
        });

        return (
           React.createElement("div", {className: "transactions"}, 
               transactions, 

               React.createElement("form", {className: "transaction add-transaction", onDoubleClick: self.addToList.bind(self)}, 
                   React.createElement("div", {className: "transaction-description"}, 
                       React.createElement("input", {type: "text", name: "transaction-description", id: self.state.transactionDescriptionInputId})
                   ), 
                   React.createElement("div", {className: "transaction-value"}, 
                       React.createElement("input", {type: "number", name: "transaction-value", id: self.state.transactionValueInputId})
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
               React.createElement("div", {className: "transaction-value"}, this.props.value.toFixed(2))
           )
       )
   }
});

},{}]},{},[1]);
