/**
 * @class       : search
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Sunday Aug 22, 2021 13:57:47 EDT
 * @description : search
 */

// depends upon util.js for queue, stack, priority queue implementations

//Node class used by search to keep track of cost and the current sequence of actions
class Node {
    constructor (state, action, parent_node) {
        this.state = state;
        // all moves are of equal cost (1)
        this.cost = (parent_node) ? parent_node.cost + 1 : 0;
        this.action = action;
        this.parent_node = parent_node
    }
}

// traverse backwards through the node tree to assemble the sequence of moves that led to the goal state
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


// - all search techniques use the same main algorithm, 
// with the only difference being the order in which states are checked,
// which in fact is entirely determined by type of the frontier used
// - returns a "solution object" with success, was_cancelled, solution, and num_expanded fields
async function generic_search(state, empty_frontier, view=false) {
    let frontier = empty_frontier;
    let visited = new Set();
    let new_state = state.copy();

    let max_nodes = 300000;
    let num_expanded = 0; //for statistics
    let nodes_expanded_display = document.getElementById('nodes_expanded');

    //boolean flag to later distinguish different causes of search failure
    let cancelled_by_user = false;
    
    let initial_node = new Node(new_state, null, null);
    frontier.push(initial_node);

    // are there still nodes to check?
    while (!(frontier.is_empty()) && num_expanded < max_nodes) {
        // every 1000 nodes:
        // refresh UI, check if cancelled
        if (num_expanded % 1000 == 0) { 
            if (num_expanded != 0) {
                nodes_expanded_display.innerText = num_expanded/1000 + 'k';
            }
            // "wait" 0 ms
            await new Promise(r => setTimeout(r, 0));

            if (cancelled()) {
                cancelled_by_user = true;
                document.getElementById('cancel').checked = false;     
                break;
            }
        }

        //get the next node
        let node = frontier.pop();
        num_expanded += 1;
        
        new_state = node.state;

        // successfuly reached the goal state!
        if (new_state.is_solved()) {
            return {
                success: true,
                was_cancelled: false,
                solution: get_actions_to(node),
                num_expanded: num_expanded
            };
        }

        // need to make string key for storing states in a set
        // this is the main bottleneck! AGH!, but afaik there is no work around,
        // without completely rewriting a set data structure from scratch.
        let string_key = String(new_state.state);
        if (!(visited.has(string_key))) {
            visited.add(string_key);
            //add each possible next state from the state being checked
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

// the remaining search functions are extensions of generic_search
// they create the frontier of the corresponding type and then call generic_search

// bfs is search with a queue: FIFO
async function bfs(board, view=false) {
    let empty_frontier = new Queue();
    return await generic_search(board, empty_frontier, view);
}

// bfs is search with a stack: LIFO
async function dfs(board, view=false) {
    let empty_frontier = new Stack();
    return await generic_search(board, empty_frontier, view);
}

// greedy_bfs is search with a priority queue (PQ) using the supplied heuristic
async function greedy_bfs(board, heuristic, view=false) {
    let empty_frontier = new PriorityQueue(heuristic, item => item.state.state);
    return await generic_search(board, empty_frontier, view);
}

// greedy_bfs is search with a priority queue (PQ) using the supplied heuristic
async function astar(board, heuristic, view=false) {
    let eval_func = node => heuristic(node) + node.cost;
    empty_frontier = new PriorityQueue(eval_func, item => item.state.state);
    return await generic_search(board, empty_frontier, view);
}

//these next four functions just populate greedy and astar with the available heuristics

async function greedy_wrong(board, view=false) {
    return await greedy_bfs(board, num_wrong_heuristic, view);
}

async function astar_wrong(board, view=false) {
    return await astar(board, num_wrong_heuristic, view);
}

async function greedy_manhattan(board, view=false) {
    return await greedy_bfs(board, manhattan_dist_heuristic, view);
}

async function astar_manhattan(board, view=false) {
    return await astar(board, manhattan_dist_heuristic, view);
}
