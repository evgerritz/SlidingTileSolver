/**
 * @class       : heuristics
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Aug 22, 2021 14:28:04 EDT
 * @description : heuristics
 */

//Number Wrong heuristic calculates the number of tiles that are out of place
function num_wrong_heuristic(node) {
    const state = node.state.state;
    let num_wrong = 0;
    let num_rows, num_cols;
    [num_rows, num_cols] = state.size();
    for (let i = 0; i < num_rows; i++) {
       for (let j = 0; j < num_cols; j++) {
           if (state.get([i, j]) != null && state.get([i, j]) !== i*num_cols + j + 1)
               num_wrong++;
       } 
    }
    return num_wrong;
}

//manhattan heuristic calculates the sum of the manhattan distances of each tile from its correct location
function manhattan_dist_heuristic(node) {
    const state = node.state.state;
    let num_rows, num_cols;
    [num_rows, num_cols] = state.size();
    let distances = [];
    for (let i = 0; i < num_rows; i++) {
       for (let j = 0; j < num_cols; j++) {
           const entry = state.get([i, j]);
           if (entry != null) {
               correct_j = (entry-1) % num_cols;
               correct_i = Math.floor((entry-1) / num_cols);
               distances.push(Math.abs(i-correct_i) + Math.abs(j-correct_j));
           }
       } 
    }
    return distances.reduce((x,y) => x+y);
}
