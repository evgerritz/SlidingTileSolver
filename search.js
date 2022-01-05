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
        this.cost = (parent_node) ? parent_node.cost + 1 : 0;
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

async function check_for_events() {
    return await new Promise(r => setTimeout(r, 10));
}

async function generic_search(state, empty_frontier, view=false) {
    let frontier = empty_frontier;
    let visited = new Set();
    let new_state = state.copy();

    let max_nodes = 1000000;
    let num_expanded = 0; //for statistics
    
    //let interval_id = setInterval(check_for_events, 1);

    let initial_node = new Node(new_state, null, null);
    frontier.push(initial_node);
    while (!(frontier.is_empty()) && num_expanded < max_nodes && cancelled === false) {
        if (num_expanded % 1000 == 0) { //only refreshUI every 1000 nodes expanded
            await new Promise(r => setTimeout(r, 0));
        }
        let node = frontier.pop();
        num_expanded += 1;
        new_state = node.state;

        if (new_state.is_solved()) {
            console.log(num_expanded);
            //clearInterval(interval_id);
            return get_actions_to(node);
        }

        //let string_key = String(new_state.state);
        if (!(visited.has(new_state.state))) {//string_key))) {
            visited.add(new_state.state);//string_key);
            for (let possible_action of new_state.get_valid_actions()) {
                let resulting_state = new_state.copy();
                resulting_state.make_action(possible_action);
                const child = new Node(resulting_state, possible_action, node);
                frontier.push(child);
            }
        }
    }

    //clearInterval(interval_id);
    return []; //search failed
}

function bfs(board, view=false) {
    let empty_frontier = new Queue();
    return generic_search(board, empty_frontier, view);
}

function dfs(board, view=false) {
    let empty_frontier = new Stack();
    return generic_search(board, empty_frontier, view);
}

function greedy_bfs(board, heuristic, view=false) {
    let empty_frontier = new PriorityQueue(heuristic, item => item.state.state);
    return generic_search(board, empty_frontier, view);
}

async function astar(board, heuristic, view=false) {
    let eval_func = node => heuristic(node) + node.cost;
    empty_frontier = new PriorityQueue(eval_func, item => item.state.state);
    return await generic_search(board, empty_frontier, view);
}

function greedy_wrong(board, view=false) {
    return greedy_bfs(board, num_wrong_heuristic, view);
}

function astar_wrong(board, view=false) {
    return astar(board, num_wrong_heuristic, view);
}

function greedy_manhattan(board, view=false) {
    return greedy_bfs(board, manhattan_dist_heuristic, view);
}

async function astar_manhattan(board, view=false) {
    return await astar(board, manhattan_dist_heuristic, view);
}
