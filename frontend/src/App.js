// import io from "socket.io-client";
import React, { Component, useEffect, useState } from "react";
import { DataContainer } from "./components/DataContainer";
import { Header } from "./components/Header";
import "./App.css";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <DataContainer />
            </div>
        );
    }
}

export default App;
