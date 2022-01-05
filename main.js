/**
 * @class       : main
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Jan 02, 2022 17:10:34 EST
 * @description : main
 */

function create_new_board () {
    let size = parseInt(document.getElementById('size').value);
    let board = new Board(size);
    board.display()
    return board;
}

async function solve_board (board) {
    let method_name = document.getElementById('search_method').value;
    let solver = new Function('return ' + method_name + '(board);')
    return await solver();
}


let board = create_new_board();
let solution;
let cancelled = false;
let solving = false;

document.getElementById('new_board').onclick = function () {
    board = create_new_board()
};

document.getElementById('scramble').onclick = function () {
    board.shuffle_board();
    board.display()
};

document.getElementById('solve').onclick = async function () {
    if (solving === false) {
        solving = true;
        document.getElementById('solve').disabled = true;
        let solution_ele = document.getElementById("solution");
        solution_ele.innerText = '';
        solution = await solve_board(board);
        solving = false;
        document.getElementById('solve').disabled = false;
        if (solution.length !== 0) {
            solution_ele.innerText = solution.toString();
        } else if (!(board.is_solved())) {
            solution_ele.innerText = 'Maximum number of nodes expanded without reaching a solution!';
        }
        cancelled = false;
    }
};

document.getElementById('cancel').onclick = function () {
    if (solving === true) {
        cancelled = true;
    }
};

window.addEventListener("keydown", event => {
    let neighbors = board.get_neighbors_of_tile(null);
    switch(event.key) {
        case "ArrowUp":
        case "w":
            //move the tile below the empty tile
            board.make_action(neighbors[0]);
            board.display();
            break;
        case "ArrowDown":
        case "a":
            //move the tile above the empty tile
            board.make_action(neighbors[1]);
            board.display();
            break;
        case "ArrowRight":
        case "d":
            //move the tile to the left of the empty tile
            board.make_action(neighbors[2]);
            board.display();
            break;
        case "ArrowLeft":
        case "s":
            //move the tile to the right of the empty tile
            board.make_action(neighbors[3]);
            board.display();
            break;
        default:
            break;
    }
});
