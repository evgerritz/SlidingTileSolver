# SlidingTileSolver

#### Introduction

The 8-puzzle, 15-puzzle, and other variations of sliding tile puzzles are classic examples of problems that can be solved using search techniques, even being mentioned in AIMA's section on standardized problems for search techniques.

This demo is intended to be a tool to illustrate the differences in performance of various search algorithms. The board itself can be controlled either by clicking the tile you want to move the empty square, or by pushing the arrow/WASD key corresponding to the direction of how you want to move the (unique) piece available to be moved in that direction, if one exists.

#### Search Methods

This demonstration includes two non-heuristic methods (breadth-first and depth-first search), along with two heuristic search methods (greedy breadth-first and A\* search), with two heuristics for each. It also keeps track of how many search nodes the algorithm needed to expand before finding its solution. Thus, by applying different search methods to the same starting state, one can get an informal sense of how effective these search variations are.

#### Heuristics

The two heuristics included are the number-of-misplaced-tiles and and the Manhattan-distance heuristics. In this application of heuristic search, these heuristics guess how many more moves might be required in the solution. The number-of-misplaced-tiles heuristic, as implied by the name, assigns to each state in consideration the number of tiles out of place. The Manhattan-distance heuristic assigns to each state the sum of the Manhattan distances of each tile from its correct location. I claim (but you can use the demo above to convince yourself!) that the Manhattan distance heuristic tends to find a solution faster than number-of-misplaced-tiles, since, for admissible heuristics (more on that in the next paragraph), a heuristic that on average assigns larger values to states than another heuristic tends to find an optimal solution after expanding fewer nodes. It is clear that the value assigned to a state by the Manhattan distance is always at least that assigned by the number-of-misplaced-tiles heuristics.

#### Comparison of Outputs

Note that these search algorithms will not all find the same solutions. In particular, depth-first search and greedy BFS, are both non-optimal in that they are not guaranteed to return the best solution (i.e, the one requiring the fewest moves). One can observe through experimentation that DFS, in particular, can often result in solutions that are orders of magnitude larger in length than that of the optimal solution. A\* is optimal so long as the heuristic is admissible, which means that the true number of moves away from the optimal solution from that state is never more than the guess made by our heuristic. Our two heuristics are admissible because they both solved relaxed versions of the sliding tile problem. To be precise, the number of misplaced tiles is equivalent to the path cost of a version of the problem in which any tile can be put in its correct place in one move; the Manhattan distance heuristic is equivalent to the path cost of a version of the problem in which tiles can overlap (i.e, multiple tiles can be placed in one location).

#### Technical Limitations

Because sets in JS compare objects by reference and not element-wise equality, for the search algorithm to remember which states have been visited, each state that is explored has to be converted to a string. This significantly slows down execution. Due to this slowness, a search will automatically stop if 300,000 nodes have been expanded without finding a solution (as this is roughly after how much time I lose patience waiting for a solution). Given this cap, how likely is it that a solution is found? We can get a sense of it by considering the ratio of the maximum number of search nodes we allow ourselves to visit to the total number of unique states in the search space, as in the following chart:


| Board size   | Size of search space | Ratio of max nodes to the size of the search space    |  
|   :----:     |    :----:   |      :----:    |
| $n$ <br>($n\\geq 4, \\sqrt{n} \\in \\mathbb{N}$) | $\\frac{n!}{2}$ | $\\frac{300{,}000}{\\frac{n!}{2}}$ |
| $4$ | $12$ | $>1$ |
| $9$ | $181{,}440$ | $>1$ |
| $16$ | $10{,}461{,}394{,}944{,}000$ | $0.000000028676863994324312$ |
| $25$ | $7{,}755{,}605{,}021{,}665{,}493{,}000{,}000{,}000$ | $0.00000000000000000003868170170630684$ |

From this chart, we can see that the boards of sizes 4 and 9 will always be solved, but a solution should almost never be found for the boards of sizes 16 and 25. However, as one can gleam from playing around with boards of size 16, A\* with the Manhattan heuristic can solve boards of size 16 with surprising frequency, a testament to its intelligence in deciding in which order to check states!

#### Acknowledgments

*   Brian Scassellati's CPSC 475 (Spring 2021)
*   Russell, Stuart J., and Peter Norvig. Artificial Intelligence: A Modern Approach. Pearson, 2020.
