import React from "react";
import styled from "styled-components";
const HeaderRow = styled.div`
    height: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 50px;
`;

export const Header = () => (
    <header className="App-header">
        <HeaderRow>LOGO</HeaderRow>
        <HeaderRow>Nav Items</HeaderRow>
    </header>
);
