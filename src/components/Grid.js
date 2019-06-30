import React from "react";
import Square from "./Square";

export default class Grid extends React.Component {

    renderSquare(i) {
        return <Square value={i}/>;
    }

    createMaze = () => {
        let rows = [];

        for (let i = 0; i < this.props.map.length; i++) {
            let columns = [];

            for (let j = 0; j < this.props.map[0].length; j++) {
                columns.push(this.renderSquare(this.props.map[i][j]))
            }
            rows.push(<div className="board-row">{columns}</div>)
        }
        return rows;
    };

    render() {

        return (
            <div>
                {this.createMaze()}
            </div>

        );
    }
}