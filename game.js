/**
 * @class       : game
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Aug 22, 2021 15:40:52 EDT
 * @description : game
 */

class Board {
    constructor(n, start=null) {
        this.board_size = n;
        let board_values = [];
        for (let i = 0; i < n; i++) {
            board_values.push([]);
            for (let j = 0; j < n; j++) {
                board_values[i][j] = i*n+j+1;
            }
        }
        board_values[n-1][n-1] = null;
        board_values = math.matrix(board_values);
        this.solved_board = board_values;
        if (start == null || !(this.is_valid_state(start))) {
            this.state = this.solved_board.clone();
        } else {
            this.state = math.matrix(start);
        }
    }

    shuffle_board() {
        let n_cubed = this.board_size**3
        for (let i = 0; i < n_cubed; i++) {
            const valid_moves = this.get_valid_actions();
            const rand_idx = Math.floor(Math.random() * valid_moves.length);
            const move = valid_moves[rand_idx];
            this.make_action(move);
        }
    }

    is_valid_state(state) {
        /* A state (multidimensional list or mathjs matrix) is valid if it satisfies the following:
              The number of dimensions matches that in board_size
              The state contains each number from 1 to board_size^2-1 exactly once
              The state contains an empty space (represented by None) */
        function list_equal (lst1, lst2) {
            return lst1.length === lst2.length && lst1.every((v, i) => v === lst2[i]);
        }
        state = math.matrix(state);
        const n = this.board_size;
        const is_of_correct_dimensions = (state.size()[0] === n && state.size()[1] === n);
        if (!(is_of_correct_dimensions)) return false;

        let flat_state = state.clone().reshape([1,n**2])._data[0]; //collapse multidim array
        const empty_space_idx = flat_state.indexOf(null);
        let has_empty_space = empty_space_idx > -1;
        if (has_empty_space) {
            flat_state.splice(empty_space_idx,1) //keep only integers
        } else { return false }

        const sorted_vals = math.sort(flat_state);
        const correct_vals = math.range(1,n**2);
        return list_equal(sorted_vals, correct_vals._data);
    }

    is_valid_coord(coord) {
        return 0 <= coord && coord < this.board_size;
    }

    is_valid_location(loc) {
        return this.is_valid_coord(loc[0]) && this.is_valid_coord(loc[1])
    }
    
    get_tile_location(tile) {
        let num_rows, num_cols;
        [num_rows, num_cols] = this.state.size();
        for (let row_idx = 0; row_idx < num_rows; row_idx++) {
            for (let col_idx = 0; col_idx < num_cols; col_idx++) {
                if (this.state.get([row_idx, col_idx]) === tile) {
                    return [row_idx, col_idx];
                }
            }
        }
        return null;
    }

    get_tile_from_location(location) {
        return this.state.get([location[0], location[1]]);
    }

    get_neighbors_of_tile(tile) {
        const tile_location = this.get_tile_location(tile);
        const direction_offsets = [[0,1], [0,-1], [1,0], [-1,0]];
        let neighbors = [];
        for (let direction_offset of direction_offsets) {
            const neighbor = [tile_location[0] + direction_offset[0],tile_location[1] + direction_offset[1]];
            if (this.is_valid_location(neighbor)) {
                neighbors.push(neighbor);
            }
        }
        return neighbors.map(loc => this.get_tile_from_location(loc));
    }

    is_valid_action(tile) {
         /* A move is valid iff it moves a tile that is horizontally or vertically adjacent to the empty space*/
        return this.get_neighbors_of_tile(null).includes(tile);
    }

    get_valid_actions() {
        return this.get_neighbors_of_tile(null);
    }

    swap_tiles(tile1, tile2) {
        let tile1_row, tile1_col, tile2_row, tile2_col;
        [tile1_row, tile1_col] = this.get_tile_location(tile1);
        [tile2_row, tile2_col] = this.get_tile_location(tile2);
        this.state.set([tile1_row, tile1_col], tile2);
        this.state.set([tile2_row, tile2_col], tile1);
    }
    
    make_action(tile) {
        if (this.is_valid_action(tile)) {
            this.swap_tiles(tile, null);
        } else {
            return null;
        }
    }
    
    is_solved() {
        return math.deepEqual(this.solved_board, this.state);
    }

    copy() {
        return new Board(this.board_size, this.state.clone());
    }

    flatten(state) {
        let flattened = [];
        let num_cols, num_rows;
        [num_rows, num_cols] = state.size();
        for (let i = 0; i < num_rows; i++) {
            for (let j = 0; j < num_cols; j++) {
                flattened.push(state.get([i, j]));        
            }
        }
        return flattened;
    }

    display(state=null) {
        if (state === null) {
            state=this.state;
        }
        
        let is_first_draw = (document.getElementsByTagName("td").length !== this.board_size**2);
        let table_ref = document.getElementsByTagName('tbody')[0];
        if (is_first_draw) {
            while (table_ref.firstChild) {
                table_ref.removeChild(table_ref.firstChild);
            }
            let num_rows, num_cols, new_row;
            [num_rows, num_cols] = state.size();
            for (let i = 0; i < num_rows; i++) {
                new_row = table_ref.insertRow(table_ref.rows.length);
                let new_cell;
                for (let j = 0; j < num_cols; j++) {
                    new_cell  = new_row.insertCell(new_row.cells.length);
                    new_cell.setAttribute('style', 'border: 1px solid black; text-align: center');
                }
            }
        }
        let tds = document.getElementsByTagName("td");
        let num_rows, num_cols;
        [num_rows, num_cols] = state.size();
        for (let i = 0; i < num_rows; i++) {
            for (let j = 0; j < num_cols; j++) {
                let entry = state.get([i, j]);
                if (entry != null) {
                    tds[i*num_rows+j].innerHTML = entry.toString();         
                    tds[i*num_rows+j].setAttribute('onclick', 'board.make_action('+entry.toString()+'); board.display()');
                } else {
                    tds[i*num_rows+j].innerHTML = ' ';
                } 
            }
        }
    }
}

function create_new_board () {
    let size = parseInt(document.getElementById('size').value);
    let board = new Board(size);
    board.display()
    return board;
}

function solve_board (board) {
    let method_name = document.getElementById('search_method').value;
    let solver = new Function('return ' + method_name + '(board);')
    let solution = solver();
    document.getElementById("solution").innerText = solution.toString();
    return solution;
}

let board = create_new_board();
let solution;

