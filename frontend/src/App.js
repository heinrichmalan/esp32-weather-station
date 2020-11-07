// import io from "socket.io-client";
import React, { Component, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import { DataContainer } from "./components/DataContainer";
import { Header } from "./components/Header";
import "./App.css";

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/">
                        <DataContainer />
                    </Route>
                    <Route path="/device/:deviceId">
                        <DataContainer />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
