// import io from "socket.io-client";
import React, { Component } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import styled, { keyframes } from "styled-components";

import "./App.css";

const timezone = new Date().getTimezoneOffset();

const spinningAnimation = keyframes`
        100% {
        transform: rotate(360deg);
        filter: hue-rotate(45deg);
    }
`;

const SpinnerWrap = styled.div`
  position: relative;
  width: ${(props) => (props.width ? props.width : 25)}px;
  height: ${(props) => (props.height ? props.height : 25)}px;
  &.spinner {
    position: relative;
    animation: ${spinningAnimation} 0.65s linear infinite;
    border: 0.3em solid;
    border-radius: 50%;
    border-color: #817aff #817aff transparent;
    bottom: 0;

    left: 0;
    margin: auto;
    &.fixed {
      right: 0;
      top: 0;
      position: fixed;
    }
  }
  &.overlay {
    background: rgba(255, 255, 255, 0.7);
    bottom: 0;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    width: 100%;
    display: none;

    &-visible {
      display: block;
    }
  }
`;

const Spinner = ({
  width = 25,
  height = 25,
  fixed = false,
  overlay = false,
  ...rest
}) => {
  return (
    <SpinnerWrap
      className={`spinner ${fixed ? "fixed" : ""}`}
      height={height}
      width={width}
      style={{ height, width }}
      {...rest}
    >
      <div
        className={`overlay ${overlay ? "visible" : ""}`}
        style={{ height, width }}
      />
      <div className="spinner" style={{ height, width }} />
    </SpinnerWrap>
  );
};

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

      // responsive: {
      //   rules: [
      //     {
      //       condition: {
      //         maxWidth: 500,
      //       },
      //       chartOptions: {
      //         plotOptions: {
      //           series: {
      //             marker: {
      //               radius: 1,
      //             },
      //           },
      //         },
      //       },
      //     },
      //   ],
      // },
    };
    return (
      <div id="chart" style={{ minWidth: "800px" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOpts} />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempData: [],
      humData: [],
      pressData: [],
      latestTimeout: null,
      latest: {
        humidity: "Fetching",
        pressure: "Fetching",
        temperature: "Fetching",
      },
      requesting: false,
      selectValue: "hours=3",
    };
  }

  async getLatestData() {
    try {
      const url = "http://192.168.0.111:5000/sensor-data/latest";

      const res = await fetch(url);
      const data = await res.json();

      this.setState({ latest: { ...data } });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ requesting: false });
    }
  }

  async getHistoricalData(params) {
    try {
      const url = `http://192.168.0.111:5000/sensor-data/historical${
        params ? `?${params}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();
      const { tempData, humData, pressData } = data;
      this.setState({ ...data });
    } catch (err) {
      console.error(err);
    }
  }

  async componentDidMount() {
    const latestTimeout = setInterval(() => {
      if (!this.state.requesting)
        this.setState({ requesting: true }, this.getLatestData);
    }, 55000);
    this.setState({ latestTimeout });
    this.getHistoricalData();
    this.getLatestData();
  }

  componentWillUnmount() {
    this.state.latestTimeout.cancel();
  }

  handleSelectChange = (event) => {
    let { value } = event.target;
    console.log(value);
    this.setState({ selectValue: value }, () => this.getHistoricalData(value));
  };

  render() {
    const { tempData, humData, pressData, latest, selectValue } = this.state;
    const timeData = [
      { value: "hours=3", label: "3 Hours" },
      { value: "hours=6", label: "6 Hours" },
      { value: "hours=12", label: "12 Hours" },
      { value: "hours=24", label: "24 Hours" },
      { value: "days=3", label: "3 Days" },
      { value: "days=7", label: "7 Days" },
    ];
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {latest &&
                Object.entries(latest).map((entry) => {
                  const [key, value] = entry;
                  return (
                    <div key={key}>
                      <h4
                        style={{ margin: "5px 0", textTransform: "capitalize" }}
                      >
                        {key}
                      </h4>
                      <p style={{ margin: "5px 0", height: "45px" }}>
                        {value === "Fetching" ? <Spinner /> : value}
                      </p>
                    </div>
                  );
                })}
              <div>
                <h4 style={{ margin: "5px 0" }}>Time Scale</h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                  }}
                >
                  <select
                    onChange={this.handleSelectChange}
                    value={selectValue}
                  >
                    {timeData.map((entry) => (
                      <option value={entry.value}>{entry.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Chart {...{ tempData, humData, pressData }} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
