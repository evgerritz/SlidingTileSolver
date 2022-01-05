/**
 * @class       : promises_test
 * @author      : Evan Gerritz (evan.gerritz@yale.edu)
 * @created     : Tuesday Jan 04, 2022 18:07:31 EST
 * @description : promises_test
 */

function slow_func () {
    let start = Date.now();
    while (Date.now() < start + 3000) ;
    return;
}

function solve_value () {
    if (!cancelled) {
        slow_func();
        return 15;
    } else {
        return 13;
    }
}

let cancelled = false;
console.log('hi');
let solve = Promise.resolve(solve_value);
cancelled = true;
solve.then(value => console.log(`Got ${value()}`));
console.log('hi2');


