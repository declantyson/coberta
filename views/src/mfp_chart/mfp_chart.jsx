/*
 *
 *	MFP Chart
 *	v0.1.0
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
        if(macros.length === 0) return ( <div>Loading...</div> );

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
            <div>
                <label>Calories <p>{data.calories}/<span>{macros.calories}</span></p></label>
                <div className={caloriesClass} style={{ width: progress.calories + "%" }}/>

                <label>Protein <p>{data.protein}/<span>{macros.protein}g</span></p></label>
                <div className={proteinClass} style={{ width: progress.protein + "%" }}/>

                <label>Carb <p>{data.carbs}/<span>{macros.carbs}g</span></p></label>
                <div className={carbClass} style={{ width: progress.carbs + "%" }}/>

                <label>Fat <p>{data.fat}/<span>{macros.fat}g</span></p></label>
                <div className={fatClass} style={{ width: progress.fat + "%" }}/>
            </div>
        );

    }
});
