import { HashMap } from "./HashMap";

class Graph {
    constructor() {
        this._neighbors = new HashMap({});
        this._start = {};
        this._goal = {};
    }

    get start() {
        return this._start;
    }

    set start(value) {
        this._start = value;
    }

    get goal() {
        return this._goal;
    }

    set goal(value) {
        this._goal = value;
    }

    addNode(node) {
        this._neighbors.set(node, []);
    }

    addNeighbor(node, nbr) {
        if (this.hasNode(nbr)) { // take only from existing nodes
            this._neighbors.get(node).push(nbr)
        }
    }

    addNeighbors(node) {
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        dirs.forEach(dir => this.addNeighbor(node, {x: node['x'] + dir[1], y: node['y'] + dir[0]}));
    }

    getNeighbors(node) {
        return this._neighbors.get(node);

    }

    getNodes() {
        return this._neighbors.getKeys();
    }

    hasNode(node) {
        return this._neighbors.hasKey(node);
    }

    static gridToGraph(grid) {
        const graph = new Graph();

        // add nodes
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (grid[row][col] !== '*') {
                    graph.addNode({x: col, y: row});
                }
                if (grid[row][col] === 's') {
                    graph.start = {x: col, y: row};
                }
                if (grid[row][col] === 'D') {
                    graph.goal = {x: col, y: row};
                }
            }
        }

        // detect and add all neighbors for each node
        graph.getNodes().forEach(node => graph.addNeighbors(node));
        return graph;
    }
}

export { Graph };