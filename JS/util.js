/**
 * @class       : util
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Saturday Aug 21, 2021 14:15:35 EDT
 * @description : util
 */

class Queue {
    constructor(items = null) {
        this.queue = (items !== null) ? items : [];
    }

    push(item) {
        this.queue.push(item); 
    }

    pop() {
        if (!this.isEmpty()) {
            return this.queue.shift();
        }
    }

    isEmpty() {
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
        if (!this.isEmpty()) {
            return this.stack.pop();
        }
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    view() {
        console.log(this.stack);
    }
}

class PriorityQueue {
    constructor(priority_func = x => x, get_val_for_index_func = x => x, items = []) {
        this.cache = {};
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
        if (!(item_key in this.cache)) {
            this.cache[item_key] = this.f(item);
        }
        fval = this.cache[item_key];
        this.heap.push(item);
        let currentIndex = this.heap.length - 1;
        let parentIndex;
        while ((parentIndex = Math.floor((currentIndex-1)/2)) >= 0) {
            const parent = this.heap[parentIndex];
            if (fval < this.cache[this.get_key(parent)]) {
                this.heap[parentIndex] = this.heap[currentIndex];
                this.heap[currentIndex] = parent;
            } else {
                break;
            }
            currentIndex = parentIndex;
        }
    }

    pop() {
        if (!(this.isEmpty())) {
            const rootpos = 0; 
            const popped = this.heap[rootpos];
            this.heap[rootpos] = this.heap.slice(-1)[0]; 
            this.heap.pop();

            const finalIndex = this.heap.length-1;

            let parentpos = rootpos;
            let leftchildpos = 1, rightchildpos = 2;
            while (leftchildpos <= finalIndex) {
                let smallerChildPos;
                if (rightchildpos <= finalIndex) {
                    smallerChildPos = (this.cache[this.get_key(this.heap[leftchildpos])] < this.cache[this.get_key(this.heap[rightchildpos])]) ? leftchildpos : rightchildpos;
                } else  {
                    smallerChildPos = leftchildpos;
                }

                if (this.cache[this.get_key(this.heap[parentpos])] < this.cache[this.get_key(this.heap[smallerChildPos])]) {
                    break;
                } else {
                    let tmp = this.heap[parentpos];
                    this.heap[parentpos] = this.heap[smallerChildPos];
                    this.heap[smallerChildPos] = tmp;
                }

                parentpos = smallerChildPos;
                leftchildpos = 2*parentpos+1;
                rightchildpos = 2*parentpos+2;
            }

            return popped

        } else {
            return null;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    view() {
        console.log(this.heap);
    }
}


let test_queue = function() {
    let q1 = new Queue([1,2,3,4,5]);
    q1.push(6);
    q1.view();
    q1.pop();
    q1.pop();
    q1.view();
    console.log(q1.isEmpty());

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
    console.log(s1.isEmpty());

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

