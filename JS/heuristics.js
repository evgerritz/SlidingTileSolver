/**
 * @class       : heuristics
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Aug 22, 2021 14:28:04 EDT
 * @description : heuristics
 */

//Number Wrong heuristic calculates the number of tiles that are out of place
function num_wrong_heuristic(node) {
    const state = node.board.state;
    const num_cols = state[0].length;
    let num_wrong = 0;
    for (let row_idx in state) {
       for (let col_idx in state[0]) {
           if (state[row_idx][col_idx] != null && state[row_idx][col_idx] !== row_idx*num_cols + col_idx + 1)
               num_wrong++;
       } 
    }
    return num_wrong;
}

//manhattan heuristic calculates the sum of the manhattan distances of each tile from its correct location
function manhattan_dist_heuristic(node) {
    const state = node.board.state;
    const num_cols = state[0].length;
    let distances = [];
    for (let row_idx in state) {
       for (let col_idx in state[0]) {
           const entry = state[row_idx][col_idx];
           if (entry != null) {
               correct_j = (entry-1) % num_cols;
               correct_i = Math.floor((entry-1) / num_cols);
               distances.append(Math.abs(i-correct_i) + Math.abs(j-correct_j));
           }
       } 
    }
    return distances.reduce((x,y) => x+y);
}
