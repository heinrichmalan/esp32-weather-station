import React, { Component } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const timezone = new Date().getTimezoneOffset();

class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pressData: [],
            tempData: [],
            humData: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                ...this.props,
            });
        }
    }

    render() {
        const chartOpts = {
            chart: {
                type: "spline",
                animation: false,
                zoomType: "x",
                marginTop: 50,
            },
            credits: false,
            title: {
                text: this.props.title,
            },
            // subtitle: {
            //     text: "Irregular time data in Highcharts JS",
            // },
            xAxis: {
                type: "datetime",
                dateTimeLabelFormats: {
                    // don't display the dummy year
                    month: "%e. %b",
                    year: "%b",
                },
                title: {
                    text: "Date",
                },
            },
            yAxis: [
                {
                    // Primary yAxis
                    labels: {
                        format: "{value}°C",
                        style: {
                            color: "#54FBCB",
                        },
                    },
                    title: {
                        text: "Temperature",
                        style: {
                            color: "#54FBCB",
                        },
                    },
                    opposite: true,
                },
                {
                    // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: "Humidity",
                        style: {
                            color: "#5483FB",
                        },
                    },
                    labels: {
                        format: "{value} %",
                        style: {
                            color: "#5483FB",
                        },
                    },
                },
                {
                    // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: "Barometric Pressure",
                        style: {
                            color: "#54D7FB",
                        },
                    },
                    labels: {
                        format: "{value} hPa",
                        style: {
                            color: "#54D7FB",
                        },
                    },
                    opposite: true,
                },
            ],
            // tooltip: {
            //     shared: true,
            // },
            // tooltip: {
            //     headerFormat: "<b>{series.name}</b><br>",
            //     pointFormat: "{point.x:%e. %b}: {point.y:.2f} C",
            // },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                    },
                },
            },

            // colors: ["#6CF", "#39F", "#06C", "#036", "#000"],

            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            series: [
                {
                    name: "Humidity",
                    type: "spline",
                    yAxis: 1,
                    color: "#5483FB",
                    data: this.state.humData,
                    marker: {
                        enabled: false,
                    },
                    tooltip: {
                        valueSuffix: " %",
                    },
                },
                {
                    name: "Barometric Pressure",
                    type: "spline",
                    yAxis: 2,
                    color: "#54D7FB",
                    data: this.state.pressData,
                    marker: {
                        enabled: false,
                    },
                    tooltip: {
                        valueSuffix: " hPa",
                    },
                },
                {
                    name: "Temperature",
                    type: "spline",
                    color: "#54FBCB",
                    data: this.state.tempData,
                    marker: {
                        enabled: false,
                    },
                    tooltip: {
                        valueSuffix: " °C",
                    },
                },
            ],

            time: {
                timezoneOffset: timezone,
            },
        };
        return (
            <div id="chart" style={{ minWidth: "800px" }}>
                <HighchartsReact highcharts={Highcharts} options={chartOpts} />
            </div>
        );
    }
}

export default Chart;
