/**
 * @class       : search
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Aug 22, 2021 13:57:47 EDT
 * @description : search
 */

// depends upon util.js

//Node class used by search to keep track of cost and the current sequence of actions
class Node {
    constructor (state, action, parent_node) {
        this.state = state;
        this.cost = (parent_node) ? parent_node.cost + 1 : 1;
        this.action = action;
        this.parent_node = parent_node
    }
}

function get_actions_to(node) {
    let actions = [];
    while (node.parent_node !== null) {
        actions.unshift(node.action);
        node = node.parent_node;
    } 
    return actions;
}

function generic_search(state, empty_frontier) {
    let frontier = empty_frontier;
    let visited = new Set();
    let new_state = state.copy();

    let num_expanded = 0; //for statistics

    let initial_node = Node(new_state, null, null);
    frontier.push(initial_node);
    while (!(frontier.is_empty())) {
        let node = frontier.pop();
        num_expanded += 1;
        new_state = node.state;

        if (new_state.is_solved()) {
            console.log(num_expanded);
            return get_actions_to(node);
        }

        if (!(visited.has(new_state.state))) {
            visited.add(new_state.state)
            for (const possible_action of new_state.get_valid_actions()) {
                let resulting_state = new_state.copy();
                resulting_state.make_action(possible_action);
                const child = Node(resulting_state, possible_move, node);
                frontier.push(child);
            }
        }
    }

    return []; //search failed
}

function bfs(board) {
    let empty_frontier = new Queue();
    return search(board, empty_frontier);
}

function greedy_bfs(board, heuristic) {
    let empty_frontier = new PriorityQueue(heuristic, item => item.board.state);
    return search(board, empty_frontier);
}

function astar(board, heuristic) {
    let eval_func = node => heuristic(node) + node.cost;
    empty_frontier = new PriorityQueue(eval_func, item => item.board.state);
    return search(board, empty_frontier);
}

function greedy_wrong(board) {
    return greedy_bfs(board, num_wrong_heuristic);
}

function astar_wrong(board) {
    return astar(board, num_wrong_heuristic);
}

function greedy_manhattan(board) {
    return greedy_bfs(board, manhattan_dist_heuristic);
}

function astar_manhattan(board) {
    return astar(board, manhattan_dist_heuristic);
}
