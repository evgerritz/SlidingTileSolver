/**
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Saturday Aug 21, 2021 14:15:35 EDT
 * @description : util
 */

/*
 * This file contains the data structures used by search.js
 */

class Queue {
    constructor(items = null) {
        this.queue = (items !== null) ? items : [];
    }

    push(item) {
        this.queue.push(item); 
    }

    pop() {
        if (!this.is_empty()) {
            return this.queue.shift();
        }
    }

    is_empty() {
        return this.queue.length === 0;
    }

    view() {
        console.log(this.queue);
    }
}

class Stack {
    constructor(items = null) {
        this.stack = (items !== null) ? items : [];
    }

    push(item) {
        this.stack.push(item); 
    }

    pop() {
        if (!this.is_empty()) {
            return this.stack.pop();
        }
    }

    is_empty() {
        return this.stack.length === 0;
    }

    view() {
        console.log(this.stack);
    }
}

//priority queue is implemented using a heap
class PriorityQueue {
    constructor(priority_func = x => x, get_val_for_index_func = x => x, items = []) {
        this.cache = new Map(); 
        this.heap = [];
        this.f = priority_func;
        this.get_key = get_val_for_index_func;
        for (const item in items) {
            this.push(item);
        }
    }

    push(item) {
        let item_key = this.get_key(item);
        let fval;
        if (!(this.cache.has(item_key))) {
            this.cache.set(item_key, this.f(item));
        }
        fval = this.cache.get(item_key);
        this.heap.push(item);
        let current_index = this.heap.length - 1;
        let parent_index;
        while ((parent_index = Math.floor((current_index-1)/2)) >= 0) {
            const parent = this.heap[parent_index];
            if (fval < this.cache.get(this.get_key(parent))) {
                this.heap[parent_index] = this.heap[current_index];
                this.heap[current_index] = parent;
            } else {
                break;
            }
            current_index = parent_index;
        }
    }

    pop() {
        if (!(this.is_empty())) {
            const root_pos = 0; 
            const popped = this.heap[root_pos];
            this.heap[root_pos] = this.heap.slice(-1)[0]; 
            this.heap.pop();

            const final_index = this.heap.length-1;

            let parent_pos = root_pos;
            let left_child_pos = 1, right_child_pos = 2;
            while (left_child_pos <= final_index) {
                let smaller_child_pos;
                if (right_child_pos <= final_index) {
                    smaller_child_pos = (this.cache.get(this.get_key(this.heap[left_child_pos])) < this.cache.get(this.get_key(this.heap[right_child_pos]))) ? left_child_pos : right_child_pos;
                } else  {
                    smaller_child_pos = left_child_pos;
                }

                if (this.cache.get(this.get_key(this.heap[parent_pos])) < this.cache.get(this.get_key(this.heap[smaller_child_pos]))) {
                    break;
                } else {
                    let tmp = this.heap[parent_pos];
                    this.heap[parent_pos] = this.heap[smaller_child_pos];
                    this.heap[smaller_child_pos] = tmp;
                }

                parent_pos = smaller_child_pos;
                left_child_pos = 2*parent_pos+1;
                right_child_pos = 2*parent_pos+2;
            }

            return popped

        } else {
            return null;
        }
    }

    is_empty() {
        return this.heap.length === 0;
    }

    view() {
        console.log(this.heap);
    }
}

/* TESTS
let test_queue = function() {
    let q1 = new Queue([1,2,3,4,5]);
    q1.push(6);
    q1.view();
    q1.pop();
    q1.pop();
    q1.view();
    console.log(q1.is_empty());

    let q2 = new Queue();
    q2.pop();
    q2.view();
    q2.push(1);
    q2.push(2);
    q2.push(3);
    q2.push(4);
    q2.view();
}

let test_stack = function() {
    let s1 = new Stack([1,2,3,4,5]);
    s1.push(6);
    s1.view();
    s1.pop();
    s1.pop();
    s1.view();
    console.log(s1.is_empty());

    let s2 = new Stack();
    s2.pop();
    s2.view();
    s2.push(1);
    s2.push(2);
    s2.push(3);
    s2.push(4);
    s2.view();
    s2.pop();
    s2.view();
    s2.pop();
    s2.view();
}

let test_pq = function() {
    let pq1 = new PriorityQueue();    
    for (let i of [5,4,3,2,1]) {
        pq1.push(i);
        pq1.view();
    }
    for (let i of [1,2,3,4,5]) {
        pq1.pop();
        pq1.view();
    }
}

    
if (require.main === module) {
    test_queue();
    test_stack();
    test_pq();
}
*/
