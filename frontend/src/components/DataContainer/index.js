import React, { useState, useEffect } from "react";

import { Spinner } from "../Spinner";
import Chart from "../WeatherChart";

export const DataContainer = ({ stationId = 1 }) => {
    const [requesting, setRequesting] = useState(false);
    const [chartData, setChartData] = useState({
        tempData: [],
        humData: [],
        pressData: [],
    });
    const [latestData, setLatestData] = useState({
        humidity: "Fetching",
        pressure: "Fetching",
        temperature: "Fetching",
    });
    const [state, setState] = useState({
        latestTimeout: null,
        selectValue: "hours=3",
    });

    useEffect(() => {
        const latestTimeout = setInterval(() => {
            if (!requesting) getLatestData();
        }, 55000);
        setState({ ...state, latestTimeout });
        getHistoricalData();
        getLatestData();

        return function cleanup() {
            clearInterval(state.latestTimeout);
        };
    }, []);

    const getLatestData = async () => {
        setRequesting(true);
        try {
            const url = "http://192.168.0.111:5000/sensor-data/latest";

            const res = await fetch(url);
            const data = await res.json();

            setLatestData({ ...data });
        } catch (err) {
            console.error(err);
        } finally {
            setRequesting(false);
        }
    };

    const getHistoricalData = async (params) => {
        if (requesting) return;
        setRequesting(true);
        try {
            const url = `http://192.168.0.111:5000/sensor-data/historical${
                params ? `?${params}` : ""
            }`;

            const res = await fetch(url);
            const data = await res.json();

            setChartData({ ...data });
        } catch (err) {
            console.error(err);
        } finally {
            setRequesting(false);
        }
    };

    const handleSelectChange = (event) => {
        let { value } = event.target;
        setState({ ...state, selectValue: value });
        getHistoricalData(value);
    };

    const { tempData, humData, pressData } = chartData;
    const { selectValue } = state;
    const timeData = [
        { value: "hours=3", label: "3 Hours" },
        { value: "hours=6", label: "6 Hours" },
        { value: "hours=12", label: "12 Hours" },
        { value: "hours=24", label: "24 Hours" },
        { value: "days=3", label: "3 Days" },
        { value: "days=7", label: "7 Days" },
    ];
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 80px)",
                maxWidth: "1000px",
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                {latestData &&
                    Object.entries(latestData).map((entry) => {
                        const [key, value] = entry;
                        return (
                            <div key={key}>
                                <h4
                                    style={{
                                        margin: "5px 0",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {key}
                                </h4>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        height: "45px",
                                    }}
                                >
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
                            onChange={handleSelectChange}
                            value={selectValue}
                        >
                            {timeData.map((entry) => (
                                <option value={entry.value}>
                                    {entry.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <Chart {...{ tempData, humData, pressData }} />
        </div>
    );
};
