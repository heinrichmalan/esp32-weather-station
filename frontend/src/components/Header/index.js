import React, { useState, useEffect } from "react";

import styled from "styled-components";
const HeaderRow = styled.div`
    height: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 50px;
`;

const NavItem = styled.a`
    padding: 0 5px;
`;

const getDevices = async (setDevices) => {
    try {
        const url = "http://192.168.0.111:5000/sensors";

        const res = await fetch(url);
        const data = await res.json();

        setDevices(data.sensors);
    } catch (err) {
        console.error(err);
    }
};

export const Header = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        getDevices(setDevices);
    }, []);

    return (
        <header className="App-header">
            <HeaderRow>
                <img
                    height="25px"
                    src={process.env.PUBLIC_URL + "/assets/clouds.png"}
                />
            </HeaderRow>
            <HeaderRow>
                {devices.map((item) => (
                    <NavItem>{item.name}</NavItem>
                ))}
            </HeaderRow>
        </header>
    );
};
