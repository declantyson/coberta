/*
 *
 *	Finance
 *	v0.0.1
 *	02/08/2016
 *  
 */

window.Finance = React.createClass({
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
            <div>
                <h1 className={className}>
                    &pound;2.21
                    <span>&pound;12.79 spent</span>
                </h1>
                <TransactionList/>
            </div>
        );
    }
});

window.TransactionList = React.createClass({
   render: function () {

       let transactions = [0,1,2,3,4].map(function (i) {
           return (
                <Transaction description="Test transaction" value="2.50"/>
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
               <div className="transaction-value">{this.props.value}</div>
           </div>
       )
   }
});
