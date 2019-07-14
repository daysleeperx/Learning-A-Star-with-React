import React from "react";
import { Square } from "./Square";

const Grid = ({map}) => {
    const renderSquare = (i) => <Square value={i}/>;

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
        <div>
            {createMaze()}
        </div>
    );
};

export { Grid };