import React from "react";
import { Square } from "./Square";

const Grid = ({map}) => {
    const renderSquare = (i) => {
        const size = `calc(90vw / ${map[0].length})`;
        return <Square value={i} style={{width: size, height: size}}/>;
    };

    const createMaze = () => {
        let rows = [];

        for (let i = 0; i < map.length; i++) {
            let columns = [];

            for (let j = 0; j < map[0].length; j++) {
                columns.push(renderSquare(map[i][j]))
            }
            rows.push(<div className="board-row">{columns}</div>)
        }
        return rows;
    };

    return (
        <div className={'board'}>
            {createMaze()}
        </div>
    );
};

export { Grid };