/* 
  * 
  *  coberta 
  *  Declan Tyson 
  *  v0.0.1 
  *  04/08/2017 
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
 *	Finance
 *	v0.1.5
 *	04/08/2016
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

        fetch(`${this.props.api}${day}`).then(function(response) {
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
            day = new Date(),
            financialData = this.state.data,
            dayData = financialData[data.day];

        dayData.transactions.push(transaction);
        financialData[data.day] = dayData;

        if(data.day === "Yesterday") {
            day = new Date(day.setDate(day.getDate() - 1));
        }

        fetch(`/finance/transaction/${day.toISOString().substring(0, 10)}`, {
            headers: {
                'Accept'       : 'application/json',
                'Content-Type' : 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(dayData)
        });

        this.setState({
           data : financialData
        });
    },
    render: function() {
        let self = this,
            data = self.props.data,
            financialData = self.state.data,
            total = 0,
            budget = 125/7, // TODO: make this configurable
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
        total = total.toFixed(2);

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
    addToList: function(e) {
        e.preventDefault();

        let transactionNameInput = document.getElementById(this.state.transactionDescriptionInputId),
            transactionValueInput = document.getElementById(this.state.transactionValueInputId),
            transactionName = transactionNameInput.value,
            transactionValue = transactionValueInput.value,
            transaction = {
                "description" : transactionName,
                "value"      : parseFloat(transactionValue)
            };

        if(isNaN(parseFloat(transactionValue))) {
            alert("error"); // todo: nicer
            return;
        }

        transactionNameInput.value = "";
        transactionValueInput.value = "";

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

               React.createElement("form", {className: "transaction add-transaction", onDoubleClick: self.addToList.bind(self), onSubmit: self.addToList.bind(self)}, 
                   React.createElement("div", {className: "transaction-description"}, 
                       React.createElement("input", {type: "text", name: "transaction-description", id: self.state.transactionDescriptionInputId})
                   ), 
                   React.createElement("div", {className: "transaction-value"}, 
                       React.createElement("input", {type: "number", name: "transaction-value", id: self.state.transactionValueInputId})
                   ), 
                   React.createElement("input", {type: "submit", value: ""})
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
