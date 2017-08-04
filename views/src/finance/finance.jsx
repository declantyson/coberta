/*
 *
 *	Finance
 *	v0.1.5
 *	04/08/2016
 *  
 */

window.Finance = React.createClass({
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
            <div className={dayClass}>
                <h1 className={statusClass}>
                    {sign}&pound;{remaining}
                    <span>&pound;<em className="day-total">{total}</em> spent</span>
                </h1>
                <TransactionList transactions={financialData[data.day]} updateTransactionList={self.updateTransactionList} />
            </div>
        );
    }
});

window.TransactionList = React.createClass({
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
        if(typeof this.props.transactions === "undefined") return ( <div>Loading...</div> );

        let self = this,
            transactionData = self.props.transactions,
            transactions = transactionData.transactions.map(function (transaction) {
            return (
                 <Transaction description={transaction.description} value={transaction.value} />
            );
        });

        return (
           <div className="transactions">
               {transactions}

               <form className="transaction add-transaction" onDoubleClick={self.addToList.bind(self)} onSubmit={self.addToList.bind(self)}>
                   <div className="transaction-description">
                       <input type="text" name="transaction-description" id={self.state.transactionDescriptionInputId} />
                   </div>
                   <div className="transaction-value">
                       <input type="number" name="transaction-value" id={self.state.transactionValueInputId} />
                   </div>
                   <input type="submit" value=""/>
               </form>

           </div>
        );
   }
});

window.Transaction = React.createClass({
   render: function () {
       return (
           <div className="transaction">
               <div className="transaction-description">{this.props.description}</div>
               <div className="transaction-value">{this.props.value.toFixed(2)}</div>
           </div>
       )
   }
});
