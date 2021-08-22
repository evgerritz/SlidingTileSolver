/**
 * @class       : game
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Aug 22, 2021 15:40:52 EDT
 * @description : game
 */

class Board {
    constructor(n, start=null) {
        this.board_size = n;
        let board_values = math.matrix();
        for (let i = 1; i < n**2; i++) {
            board_values.push(i);
        }
        board_values.push(null);
        console.log(board_values);
        this.solved_board = board_values.resize(n, n);
        console.log(this.solved_board);
        if (start == null || !(this.is_valid_state(start))) {
            this.state = this.solved_board.clone();
            this.shuffle_board();
        } else {
            this.state = nj.array(start);
        }
    }

    shuffle_board() {
        /* Monte Carlo Board Shuffling */
        const prob_of_term = 0.3 ** this.board_size;
        while (Math.random() > prob_of_term) {
            const valid_moves = this.get_valid_actions();
            const rand_idx = Math.floor(Math.random() * valid_moves.length);
            const move = valid_moves[rand_idx];
            this.make_action(move);
        }
    }

    is_valid_state(state) {
        /* A state (multidimensional list or numpy array) is valid if it satisfies the following:
              The number of dimensions matches that in board_size
              The state contains each number from 1 to board_size^2-1 exactly once
              The state contains an empty space (represented by None) */
        state = nj.array(state);
        const n = this.board_size;
        is_of_correct_dimensions = (nj.shape(state) === [n, n]);
        if (!(is_of_correct_dimensions)) return false;

        state = state.flatten(); //collapse multidim array
        const empty_space_idx = state.indexOf(null);
        has_empty_space = empty_space_idx > -1;
        if (has_empty_space) {
            state.splice(empty_space_idx,1) //keep only integers
        } else { return false }

        const unique_vals = nj.unique(state);
        const sorted_vals = nj.sort(state);
        const all_unique = (unique_vals.size === sorted_vals.size) && unique_vals == sorted_vals
        const values_correct = (all_unique && state.reduce((x,y) => x+y) === (n**2)*((n**2)+1)/2);
        return values_correct;
    }

    is_valid_coord(coord) {
        return 0 <= coord && coord[0] < this.board_size;
    }

    is_valid_location(loc) {
        return this.is_valid_coord(loc[0]) && this.is_valid_coord(loc[1])
    }
    
    get_tile_location(tile) {
        let num_rows, num_cols;
        [num_rows, num_cols] = this.state.shape;
        for (let row_idx = 0; row_idx < num_rows; row_idx++) {
            for (let col_idx = 0; col_idx < num_cols; col_idx++) {
                if (this.state.get(row_idx, col_idx) == tile) {
                    return [row_idx, col_idx];
                }
            }
        }
        return null;
    }

    get_tile_from_location(location) {
        return this.state.get(location[0], location[1]);
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
        return neighbors;
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
        this.state.get(tile1_row, tile1_col) = tile2;
        this.state.get(tile2_row, tile2_col) = tile1;
    }
    
    make_action(tile) {
        if (this.is_valid_action(tile)) {
            this.swap_tiles(tile, null);
        } else {
            return null;
        }
    }
    
    is_solved() {
        return (this.state == this.solved_board).all();
    }

    copy() {
        return Board(this.board_size, this.state.clone());
    }

    flatten(state) {
        let flattened = [];
        let num_rows = state.size[0];
        for (let i = 0; i < num_rows; i++) {
            flattened.push(state.slice(i));        
        }
        return flattened;
    }

    display(padding = 1) {
        //first get width of largest digit
        let flattened = this.flatten(this.state);
        console.log(flattened);
        const empty_space_idx = flattened.indexOf(null);
        flattened.splice(empty_space_idx,1) //keep only integers
        let max_digit = nj.max(flattened);
        let max_digit_width = 0;
        while (max_digit != 0) {
            max_digit_width += 1;
            max_digit = Math.floor(max_digit/10);
        }

        for (let i = 0; i < padding; i++) {
            document.write('<br>');
        }
        for (let i = 0; i < this.state.shape[0]; i++) {
            let strings = [];
            for (let entry of this.state.slice(i)) {
                let str = '';
                if (entry !== null) {
                    str = entry.toString();         
                } 
                while (str.length < max_digit_width) {
                    str = ' ' + str;        
                }
                strings.push(str);
            }
            document.write(' '.repeat(padding*2));
            document.write(strings.reduce((x,y) => x+' '+y));
            document.write(' '.repeat(padding*2));
        }
        for (let i = 0; i < padding; i++) {
            document.write('<br>');
        }
    }
}

let size = 4;
let board = new Board(size);
board.display();

const solution = search.astar_manhattan(board);
document.write(solution.toString() + '<br>');
