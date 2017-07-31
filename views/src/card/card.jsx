/*
 *
 *	Card View
 *	v0.1.1
 *	29/06/2016
 *  
 */

window.Card = React.createClass({
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
                <div id={child.wrapper.id} className={child.wrapper.className}>
                    {child.el}
                </div>
            );
        });

        return (
            <div>
                <h2>{data.title}</h2>
                <div className="childcomponents">
                    {children}
                </div>
            </div>
        );
    }
});
