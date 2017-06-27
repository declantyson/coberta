/*
 *
 *	Test View
 *	v0.1.0
 *	22/06/2016
 *  
 */

window.TestView = React.createClass({
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
                <TestItem text={i.text} />
            );
        });
        return ( 
            <div>
                <h2 className="testView">Test items</h2>
                {testItems}
            </div>
        );
    }
});

window.TestItem = React.createClass({
    render: function() {
        return (
            <p>{this.props.text}</p>
        )
    }
});
