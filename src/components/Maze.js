import React from "react";
import Grid from "./Grid";
import {asciiMap} from "../common/ASCIIMap";
import Graph from "../common/Graph";
import HashMap from "../common/HashMap";

export default class Maze extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            steps: [{
                map: asciiMap,
                queue: [[16, 14, 0]],
                costSoFar: new HashMap({
                    entries: [[{x: 16, y: 14}, 0]]
                }),
                cameFrom: new HashMap({
                    entries: [[{x: 16, y: 14}, null]]
                }),
            }],
            step: 0,
            playBack: false,
        };
    }

    componentDidMount() {
        this._graph = Graph.gridToGraph(this.state.steps[0].map)
    }

    makeStep() {
        if (this.state.steps[this.state.step].queue.length > 0) {
            const history = this.state.steps.slice(0, this.state.step + 1);
            const currentStep = history[history.length - 1];
            const grid = currentStep.map.slice().map(row => row.slice());
            const queue = currentStep.queue.slice().map(row => row.slice());
            const cameFrom = HashMap.copy(currentStep.cameFrom);
            const costSoFar = HashMap.copy(currentStep.costSoFar);

            let min = Number.MAX_VALUE;
            let minIndex = -1;
            for (let i = 0; i < queue.length; i++) {
                if (queue[i][2] < min) {
                    min = queue[i][2];
                    minIndex = i;
                }
            }

            const current = queue[minIndex];
            queue.splice(minIndex, 1);
            grid[current[1]][current[0]] = 'v';

            // TODO: goal should not be hardcoded

            if (current[1] === 1 && current[0] === 13) {
                this.setState({
                    playBack: false,
                });
                clearInterval(this._interval);
                // Maze.reconstructPath('16, 14', '13, 1', cameFrom, grid);
            }

            // TODO: refactor this -> possibly separate class for location (x, y)
            this._graph.getNeighbors({x: current[0], y: current[1]}).forEach(
                (nbr) => {
                    const newCost = costSoFar.get({x: current[0], y: current[1]}) + 1;
                    if (!costSoFar.hasKey(nbr) || newCost < costSoFar.get(nbr)) {
                        costSoFar.set(nbr, newCost);
                        const priority = newCost + Maze.heuristic([13, 1], [nbr['x'], nbr['y']]);
                        queue.push([nbr['x'], nbr['y'], priority]);
                        cameFrom.set(nbr, current.slice(0, 2));
                    }
                }
            );

            this.setState({
                steps: history.concat([{
                    map: grid,
                    cameFrom: cameFrom,
                    queue: queue,
                    costSoFar: costSoFar,
                }]),
                step: history.length,
            });
        }
    }

    static reconstructPath(start, goal, cameFrom, grid) {
        let current = goal;

        while (current !== start) {
            grid[Number(current.split(', ')[1])][Number(current.split(', ')[0])] = 'p';
            if (!!cameFrom.get(current)) {
                current = cameFrom.get(current);
            }
        }
        grid[Number(current.split(', ')[1])][Number(current.split(', ')[0])] = 'p';
    }

    static heuristic(goal, nbr) {
        // Manhattan distance on a square grid
        return Math.abs(goal[0] - nbr[0]) + Math.abs(goal[1] - nbr[1]);
    }

    handlePlay() {
        this.togglePlay();
        this.state.playBack ? clearInterval(this._interval) : this.doPlay();
    }

    handleForward() {
        this.togglePause();
        clearInterval(this._interval);
        this.makeStep();
    }

    handleBack() {
        this.togglePause();
        clearInterval(this._interval);

        let currentStep = this.state.step - 1;
        if (currentStep >= 0) {
            this.jumpTo(currentStep);
        }
    }

    togglePlay() {
        this.setState(prevState => ({
            playBack: !prevState.playBack,
        }));
    }

    togglePause() {
        if (this.state.playBack) {
            this.setState({
                playBack: false,
            });
        }
    }

    doPlay() {
        this._interval = setInterval(() => this.makeStep(), 100);
    }

    jumpTo(step) {
        this.setState({
            step: step
        });
    }

    render() {
        const steps = this.state.steps;
        const current = steps[this.state.step];

        return (
            <div className="game">
                <div className="game-board">
                    <Grid
                        map={current.map}
                    />

                    <div className={"btn-group-lg mt-4 text-center"}>
                        <button className={"btn btn-outline-primary"} onClick={() => this.handleBack()}>
                            Back
                        </button>

                        <button className={"btn btn-outline-primary"} onClick={() => this.handlePlay()}>
                            {this.state.playBack ? 'Pause' : 'Play'}
                        </button>

                        <button className={"btn btn-outline-primary"} onClick={() => this.handleForward()}>
                            Forward
                        </button>
                    </div>
                </div>
                <div className="game-info">
                    <p>Queue: {current.queue.length}</p>
                    <p>Step: {this.state.step}</p>
                    <p>Visited: {current.cameFrom.size()}</p>
                </div>
            </div>
        );
    }
}