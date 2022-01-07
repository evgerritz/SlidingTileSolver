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

function cancelled() {
    return document.getElementById('cancel').checked;     
}


async function generic_search(state, empty_frontier, view=false) {
    let frontier = empty_frontier;
    let visited = new Set();
    let new_state = state.copy();

    let max_nodes = 300000;
    let num_expanded = 0; //for statistics
    let nodes_expanded_display = document.getElementById('nodes_expanded');

    let cancelled_by_user = false;
    
    let initial_node = new Node(new_state, null, null);
    frontier.push(initial_node);
    while (!(frontier.is_empty()) && num_expanded < max_nodes) {
        //refresh UI, check if cancelled every 1000 nodes expanded
        if (num_expanded % 1000 == 0) { 
            if (num_expanded != 0) {
                nodes_expanded_display.innerText = num_expanded/1000 + 'k';
            }
            await new Promise(r => setTimeout(r, 0));

            if (cancelled()) {
                cancelled_by_user = true;
                document.getElementById('cancel').checked = false;     
                break;
            }
        }

        let node = frontier.pop();
        num_expanded += 1;
        
        new_state = node.state;

        if (new_state.is_solved()) {
            return {
                success: true,
                solution: get_actions_to(node),
                num_expanded: num_expanded
            };
        }

        let string_key = String(new_state.state);
        if (!(visited.has(string_key))) {
            visited.add(string_key);
            for (let possible_action of new_state.get_valid_actions()) {
                let resulting_state = new_state.copy();
                resulting_state.make_action(possible_action);
                if (view) {
                    await new Promise(r => setTimeout(r, 0));
                    resulting_state.display()
                }
                const child = new Node(resulting_state, possible_action, node);
                frontier.push(child);
            }
        }
    }

    //search failed:
    // either bc max nodes expaneded, or cancelled, or no solution (never true for tile puzzle), 
    return {
        success: false,
        was_cancelled: cancelled_by_user,
        solution: [],
        num_expanded: num_expanded
    };
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
