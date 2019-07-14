import React, { useState } from "react";
import { Grid } from "./Grid";
import { asciiMap } from "../common/ASCIIMap";
import { Graph } from "../common/Graph";
import { HashMap } from "../common/HashMap";
import { PriorityQueue } from "../common/PriorityQueue";
import useInterval from 'use-interval'
import { heuristic } from "../common/Util";
import * as _ from "lodash";

const Maze = () => {
    const [steps, setSteps] = useState([{
        map: asciiMap,
        queue: new PriorityQueue([{x: 16, y: 14, f: 0}], (a, b) => a.f < b.f),
        costSoFar: new HashMap({entries: [[{x: 16, y: 14}, 0]]}),
        cameFrom: new HashMap({entries: [[{x: 16, y: 14}, null]]})
    }]);
    const [step, setStep] = useState(0);
    const [playBack, setPlayBack] = useState(false);

    const _graph = Graph.gridToGraph(steps[0].map);

    useInterval(() => makeStep(), playBack ? 10 : null);

    const makeStep = () => {
        if (!steps[step].queue.isEmpty()) {
            const history = steps.slice(0, step + 1);
            const currentStep = history[history.length - 1];
            const grid = currentStep.map.slice().map(row => row.slice());
            const queue = PriorityQueue.copy(currentStep.queue);
            const cameFrom = HashMap.copy(currentStep.cameFrom);
            const costSoFar = HashMap.copy(currentStep.costSoFar);
            const current = _.omit(queue.pop(), 'f');


            grid[current.y][current.x] = 'v';
            if (isGoal(current)) {
                setPlayBack(false);
                reconstructPath(cameFrom, grid);
            }

            _graph.getNeighbors(current).forEach((nbr) => {
                    const newCost = costSoFar.get(current) + 1;
                    if (!costSoFar.hasKey(nbr) || newCost < costSoFar.get(nbr)) {
                        costSoFar.set(nbr, newCost);
                        const priority = newCost + heuristic(_graph.goal, current);
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
            let number = history.length;
            setStep(number);
        }
    };

    const isGoal = ({x, y}) => {
        return y === _graph.goal.y && x === _graph.goal.x;
    };

    const reconstructPath = (cameFrom, map) => {
        let current = _graph.goal;

        while (JSON.stringify(current) !== JSON.stringify(_graph.start)) {
            map[current.y][current.x] = 'p';
            if (cameFrom.hasKey(current)) {
                current = cameFrom.get(current);
            }
        }
        map[current.y][current.x] = 'p';
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

    const togglePause = () => {
        if (playBack) setPlayBack(false);
    };

    const jumpTo = (step) => setStep(step);

    const current = steps[step];

    return (
        <div className="game">
            <div className="game-board">
                <Grid map={current.map}/>

                <div className={"btn-group-lg mt-4 text-center"}>
                    <button className={"btn btn-outline-primary"} onClick={() => handleBack()}>
                        Back
                    </button>

                    <button className={"btn btn-outline-primary"} onClick={() => handlePlay()}>
                        {playBack ? 'Pause' : 'Play'}
                    </button>

                    <button className={"btn btn-outline-primary"} onClick={() => handleForward()}>
                        Forward
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
};

export { Maze };