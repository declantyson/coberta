/*
 *
 *	Finance
 *	v0.1.0
 *	02/08/2016
 *  
 */

window.Finance = React.createClass({
    getInitialState: function() {
        return { data: {} }
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
        setInterval(this.getDataFromEndpoint, this.props.pollInterval);

        mountedComponents++;
        if(mountedComponents >= document.getElementsByClassName('component').length) {
            renderComplete();
        }
    },
    render: function() {
        let data = this.props.data,
            financialData = this.state.data,
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

                console.log(financialData);
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
            <div className={dayClass}>
                <h1 className={statusClass}>
                    {sign}&pound;{remaining}
                    <span>&pound;<em className="day-total">{total}</em> spent</span>
                </h1>
                <TransactionList transactions={financialData[data.day]} />
            </div>
        );
    }
});

window.TransactionList = React.createClass({
   render: function () {
       if(typeof this.props.transactions === "undefined") return ( <div>Loading...</div> );

       let transactionData = this.props.transactions,
           transactions = transactionData.transactions.map(function (transaction) {
           return (
                <Transaction description={transaction.description} value={transaction.value} />
           );
       });

       return (
           <div className="transactions">
               {transactions}

               <div className="transaction add-transaction">
                   <div className="transaction-description">
                       <input type="text" name="transaction-description" />
                   </div>
                   <div className="transaction-value">
                       <input type="number" name="transaction-value" />
                   </div>
               </div>

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
