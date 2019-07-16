import React from "react";

const GameInfo = ({queueSize, step, cameFromSize}) => (
    <div className="game-info">
        <p>Queue: {queueSize}</p>
        <p>Step: {step}</p>
        <p>Visited: {cameFromSize}</p>
    </div>
);

export { GameInfo };