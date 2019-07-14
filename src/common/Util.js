// Manhattan distance on a square grid
const heuristic = (goal, nbr) => Math.abs(goal.x - nbr.x) + Math.abs(goal.y - nbr.y);

export { heuristic };