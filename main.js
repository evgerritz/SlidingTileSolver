/**
 * @class       : main
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Jan 02, 2022 17:10:34 EST
 * @description : main
 */

(function () {
    let board = create_new_board();
    let solving = false;

    const is_heuristic_search = {
        'bfs':false,
        'dfs':false,
        'greedy':true,
        'astar':true
    };

    document.getElementById('cancel').checked = false;
    
    function make_move_on_click_fn(move) {
        let move_fn = new Function('board', 'board.make_action('+move.toString()+'); board.display()');
        return () => { move_fn(board) };
    }

    function create_new_board () {
        let size = parseInt(document.getElementById('size').value);
        let board = new Board(size);
        board.display();
        return board;
    }

    async function solve_board (board) {
        let method_name = document.getElementById('search_method').value;
        if (is_heuristic_search[method_name]) {
           method_name += '_' + document.getElementById('heuristic').value;  
        }
        let visualize = document.getElementById('visualize').checked;
        let fn_body_string = 'return ' + method_name + '(board, ' + visualize + ');';
        let solver = new Function('board', fn_body_string);
        return await solver(board);
    }

    function display_solution(solution_object) {
        let solution_elmnt = document.getElementById("solution");
        document.getElementById("nodes_expanded").innerText = solution_object.num_expanded.toLocaleString("en-US");
        
        if (solution_object.success) {
            if (solution_object.num_expanded > 1) {
                let solution_row = document.createElement('div');
                solution_row.className = 'solution_row'; 
                solution_elmnt.appendChild(solution_row);
                let new_div, new_span;
                for (let move of solution_object.solution) {
                    //create new nodes
                    new_div = document.createElement('div'); 
                    new_span = document.createElement('span'); 

                    //append to solution_row
                    solution_row.appendChild(new_div);
                    new_div.appendChild(new_span);

                    new_div.className = "solution_move";
                    new_div.onclick = make_move_on_click_fn(move);
                    new_span.className = "solution_text";
                    new_span.innerText = move.toString();
                }
            } else {
                solution_elmnt.innerText = 'Board is already solved!'
            }
        } else if (solution_object.was_cancelled) {
            solution_elmnt.innerText = 'Search cancelled!';
        } else {
            solution_elmnt.innerText = 'Maximum number of nodes expanded (300k) without reaching a solution!';
        }
             
    }

    document.getElementById('size').onchange = function () {
        board = create_new_board();
    }
    document.getElementById('search_method').onchange = function () {
        if (solving === false) {
            document.getElementById('solve').disabled = false;
        }

        let hidden_cancel = document.getElementsByClassName('hidden')[0]
        let original_cancel = document.getElementsByClassName('original')[0]
        if (is_heuristic_search[document.getElementById('search_method').value] ) {
            document.getElementById('heuristic_div').style = 'display: block;';
            if (document.getElementById('heuristic').value === '') {
                document.getElementById('solve').disabled = true;
            }
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

    document.getElementById('heuristic').onchange = function () {
        document.getElementById('solve').disabled = false;
    }

    document.getElementById('new_board').onclick = function () {
        board = create_new_board()
    };

    document.getElementById('scramble').onclick = function () {
        board.shuffle_board();
        board.display();
    };

    document.getElementById('solve').onclick = async function () {
        if (solving === false) {
            let solution_object;
            solving = true;

            //change appearance of UI to signify search in progress
            document.getElementById('solve').disabled = true;
            document.getElementById('cancel').disabled = false;
            document.getElementById('demo_content').style = 'cursor: progress;';

            let solution_elmnt = document.getElementById("solution");
            solution_elmnt.innerText = '';

            //attempt to find a solution
            solution_object = await solve_board(board);

            display_solution(solution_object);

            solving = false;
            document.getElementById('solve').disabled = false;
            document.getElementById('cancel').disabled = true;
            document.getElementById('demo_content').style = 'cursor: normal;';
            await new Promise(r => setTimeout(r, 250));
            board.display();
        }
    };

    // idea: want the cancel 'button' (checkbox) to appear like a button to the user,
    // but in fact be a toggle that the search function can periodically read
    document.getElementById('cancel').onclick = function (event) {
        // don't want user to be able to change status of cancel 'button'
        event.preventDefault();
        //and it should only change when a solution is onging
        if (solving === true) {
            document.getElementById('cancel').checked = true;
            solving = false;
        } 
    };

    window.addEventListener("keydown", event => {
        let neighbors = board.get_neighbors_of_tile(null);
        
        let handle_arrow = (idx_of_move) => {
            //don't want to absorb scrolling arrows for selecting options
            if (document.activeElement.tagName != "SELECT") {
                board.make_action(neighbors[idx_of_move])
                board.display();
                //don't want to scroll the page too!
                event.preventDefault();
            }
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
}());
