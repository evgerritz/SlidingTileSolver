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
    if (is_heuristic_search[method_name]) {
       method_name += '_' + document.getElementById('heuristic').value;  
    }
    let visualize = document.getElementById('visualize').checked;
    let solver = new Function('return ' + method_name + '(board, ' + visualize + ');');
    return await solver();
}

let board = create_new_board();
let solution;
let cancelled = false;
let solving = false;
const is_heuristic_search = { 'bfs':false, 'dfs':false, 'greedy':true, 'astar':true };

document.getElementById('search_method').onchange = function () {
    if (solving === false) {
        document.getElementById('solve').disabled = false;
    }

    let hidden_cancel = document.getElementsByClassName('hidden')[0]
    let original_cancel = document.getElementsByClassName('original')[0]
    if (is_heuristic_search[document.getElementById('search_method').value]) {
        document.getElementById('heuristic_div').style = 'display: block;';
        if (hidden_cancel.id === 'hidden_cancel') {
            hidden_cancel.id = 'cancel';
            original_cancel.id = 'hidden_cancel';
        }
    } else {
        document.getElementById('heuristic_div').style = 'display: none;';
        if (original_cancel.id === 'hidden_cancel') {
            original_cancel.id = 'cancel';
            hidden_cancel.id = 'hidden_cancel';
        }
    }
};

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
        document.getElementById('cancel').disabled = false;
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
        document.getElementById('cancel').disabled = true;
        board.display();
    }
};

document.getElementById('cancel').onclick = function () {
    if (solving === true) {
        cancelled = true;
    }
};

window.addEventListener("keydown", event => {
    let neighbors = board.get_neighbors_of_tile(null);
    
    let handle_arrow = (idx_of_move) => {
        board.make_action(neighbors[idx_of_move])
        board.display();
        //don't want to scroll the page too!
        event.preventDefault();
    };

    switch(event.key) {
        case "ArrowUp":
        case "w":
            //move the tile below the empty tile
            handle_arrow(0);
            break;
        case "ArrowDown":
        case "a":
            //move the tile above the empty tile
            handle_arrow(1);
            break;
        case "ArrowRight":
        case "d":
            //move the tile to the left of the empty tile
            handle_arrow(2);
            break;
        case "ArrowLeft":
        case "s":
            //move the tile to the right of the empty tile
            handle_arrow(3);
            break;
        default:
            break;
    }
});
