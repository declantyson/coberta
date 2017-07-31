/*
 *
 *	MFP Chart
 *	v0.0.2
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
        let data = this.props.data;
        if(data.length === 0 || this.props.api !== "") {
            data = this.state.data;
        }

        let macros = this.state.macros;

        if(macros.length === 0) return ( <div>Loading...</div> );

        let progress = {
                protein : (data.protein / macros.protein) * 100,
                carb    : (data.carb / macros.carb) * 100,
                fat     : (data.fat / macros.fat) * 100,
            },
            proteinClass = progress.protein > 100 ? "progress protein-progress overflow-progress" : "progress protein-progress",
            carbClass = progress.carb > 100 ? "progress carb-progress overflow-progress" : "progress carb-progress",
            fatClass = progress.fat > 100 ? "progress fat-progress overflow-progress" : "progress fat-progress";

        return (
            <div>
                <label>Protein <p>{data.protein}/<span>{macros.protein}g</span></p></label>
                <div className={proteinClass} style={{ width: progress.protein + "%" }}/>

                <label>Carb <p>{data.carb}/<span>{macros.carb}g</span></p></label>
                <div className={carbClass} style={{ width: progress.carb + "%" }}/>

                <label>Fat <p>{data.fat}/<span>{macros.fat}g</span></p></label>
                <div className={fatClass} style={{ width: progress.fat + "%" }}/>
            </div>
        );

    }
});
