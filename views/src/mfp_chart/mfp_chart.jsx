/*
 *
 *	MFP Chart
 *	v0.0.1
 *	31/07/2016
 *  
 */

window.MFPChart = React.createClass({
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

        if(macros.length === 0) return ( <div>Loading...</div> );

        return (
            <div>
                <label>Protein {macros.protein}g</label>
                <label>Carbs {macros.protein}g</label>
                <label>Fat {macros.fat}g</label>
            </div>
        );

    }
});
