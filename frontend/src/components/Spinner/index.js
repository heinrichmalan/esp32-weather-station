import React from "react";
import styled, { keyframes } from "styled-components";

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

export const Spinner = ({
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
