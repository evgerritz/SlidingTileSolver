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
           const entry = state.get([i,j]);
           const numeric_in_wrong_spot = (entry != null && entry !== i*num_cols + j + 1);
           const empty_in_wrong_spot = (entry == null && !(i === num_rows-1 && j === num_cols-1));
           if (numeric_in_wrong_spot || empty_in_wrong_spot) {
               num_wrong++;
           }
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
           let correct_j, correct_i;
           if (entry != null) {
               correct_i = Math.floor((entry-1) / num_cols);
               correct_j = (entry-1) % num_cols;
           } else {
                correct_i = num_rows-1;
                correct_j = num_cols-1;
           }
           distances.push(Math.abs(i-correct_i) + Math.abs(j-correct_j));
       } 
    }
    return distances.reduce((x,y) => x+y);
}
