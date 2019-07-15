import React, { useState } from "react";
import { Grid } from "./Grid";
import { Graph } from "../common/Graph";
import { HashMap } from "../common/HashMap";
import { PriorityQueue } from "../common/PriorityQueue";
import useInterval from 'use-interval'
import { heuristic } from "../common/Util";
import * as _ from "lodash";

const Maze = () => {
    const [steps, setSteps] = useState([]);
    const [step, setStep] = useState(0);
    const [playBack, setPlayBack] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [graph, setGraph] = useState(new Graph());

    useInterval(() => makeStep(), playBack ? 100 : null);

    const makeStep = () => {
        if (!steps[step].queue.isEmpty()) {
            const history = steps.slice(0, step + 1);
            const currentStep = history[history.length - 1];
            const grid = currentStep.map.slice().map(row => row.slice());
            const queue = PriorityQueue.copy(currentStep.queue);
            const cameFrom = HashMap.copy(currentStep.cameFrom);
            const costSoFar = HashMap.copy(currentStep.costSoFar);
            const current = _.omit(queue.pop(), 'f');
            const {x, y} = current;

            grid[y][x] = grid[y][x] !== 's' ? 'v' : 's';

            if (isGoal(current)) {
                setPlayBack(false);
                reconstructPath(cameFrom, grid);
            }

            graph.getNeighbors(current).forEach((nbr) => {
                    const newCost = costSoFar.get(current) + 1;
                    if (!costSoFar.hasKey(nbr) || newCost < costSoFar.get(nbr)) {
                        costSoFar.set(nbr, newCost);
                        const priority = newCost + heuristic(graph.goal, current);
                        queue.push({...nbr, f: priority});
                        cameFrom.set(nbr, current);
                    }
                }
            );
            setSteps(history.concat([{
                map: grid,
                cameFrom: cameFrom,
                queue: queue,
                costSoFar: costSoFar
            }]));
            setStep(history.length);
        }
    };

    const isGoal = ({x, y}) => y === graph.goal.y && x === graph.goal.x;

    const isStart = ({x, y}) => y === graph.start.y && x === graph.start.x;

    const reconstructPath = (cameFrom, map) => {
        let current = graph.goal;

        while (!isStart(current)) {
            const {x, y} = current;
            map[y][x] = 'p';
            if (cameFrom.hasKey(current)) {
                current = cameFrom.get(current);
            }
        }
    };

    const handleForward = () => {
        togglePause();
        makeStep();
    };

    const handleBack = () => {
        togglePause();

        let currentStep = step - 1;
        if (currentStep >= 0) {
            jumpTo(currentStep);
        }
    };

    const handlePlay = () => setPlayBack(!playBack);

    const handleReset = () => {
        togglePause();
        jumpTo(0);
    };

    const handleNew = () => {
        handleReset();
        setFileUploaded(false);
    };

    const togglePause = () => {
        if (playBack) setPlayBack(false);
    };

    const jumpTo = (step) => setStep(step);

    const handleFileChosen = (file) => {
        // TODO: validate file
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const text = fileReader.result;
            const asciiMap = text.split('\n').map(row => row.split(''));
            const graph = Graph.gridToGraph(asciiMap);
            setGraph(graph);
            setSteps([{
                map: asciiMap,
                queue: new PriorityQueue([{
                    ...graph.start, f: 0
                }], (a, b) => a.f < b.f),
                costSoFar: new HashMap({entries: [[graph.start, 0]]}),
                cameFrom: new HashMap({entries: [[graph.start, null]]})
            }]);
            setStep(0);
            setFileUploaded(true);
        };
        fileReader.readAsText(file);
    };

    const current = fileUploaded ? steps[step] : null;

    if (fileUploaded) {
        return (
            <div className="game">

                <div className="game-board">
                    <Grid map={current.map}/>

                    <div className={"btn-group-lg mt-4 text-center"}>
                        <button className={"btn btn-outline-primary"} onClick={() => handleReset()}>
                            Reset
                        </button>

                        <button className={"btn btn-outline-primary"} onClick={() => handleBack()}>
                            Back
                        </button>

                        <button className={"btn btn-outline-primary"} onClick={() => handlePlay()}>
                            {playBack ? 'Pause' : 'Play'}
                        </button>

                        <button className={"btn btn-outline-primary"} onClick={() => handleForward()}>
                            Forward
                        </button>

                        <button className={"btn btn-outline-primary"} onClick={() => handleNew()}>
                            New
                        </button>
                    </div>
                </div>
                <div className="game-info">
                    <p>Queue: {current.queue.size()}</p>
                    <p>Step: {step}</p>
                    <p>Visited: {current.cameFrom.size}</p>
                </div>
            </div>
        );
    }
    return (
        <div className={"btn-group-lg mt-4 text-center"}>
            <h1>A * Animation</h1>
            <label className={"btn btn-outline-primary"}>
                Upload File
                <input type={"file"} accept={".txt"} onChange={e => handleFileChosen(e.target.files[0])} hidden/>
            </label>
        </div>
    );
};

export { Maze };