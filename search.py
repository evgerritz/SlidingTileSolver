import util 
import numpy as np
import game

class Node:
    def __init__(self, board, tileMoved, parent):
        self.board = board
        self.cost = parent.cost + 1 if parent else 1
        self.tile = tileMoved
        self.parent = parent

def getActionsTo(node):
    actions = []
    while node.parent != None:
        actions.insert(0, node.tile)
        node = node.parent
    return actions

def search(board, empty_frontier):
    frontier = empty_frontier
    visited = set()
    new_board = board.copy()

    num_expanded=0

    initial = Node(new_board, None, None)
    frontier.push(initial)
    while not frontier.isEmpty():
        node = frontier.pop()
        num_expanded += 1
        new_board = node.board

        if new_board.isSolved():
            print(num_expanded)
            return getActionsTo(node)

        state_tuple = tuple(map(tuple, new_board.state))
        if not state_tuple in visited:
            visited.add(state_tuple)
            for possible_move in new_board.getValidMoves():
                resulting_board = new_board.copy()
                resulting_board.makeMove(possible_move)
                child = Node(resulting_board, possible_move, node)
                frontier.push(child)
    return []

def bfs(board):
    empty_frontier = util.Queue()
    return search(board, empty_frontier)

def greedy_bfs(board, heuristic):
    empty_frontier = util.PriorityQueue(heuristic)
    return search(board, empty_frontier)

def astar(board, heuristic):
    def eval_func(node):
        return heuristic(node) + node.cost
    empty_frontier = util.PriorityQueue(eval_func)
    return search(board, empty_frontier)


def wrong_heuristic(node):
    state = node.board.state
    num_wrong = 0
    num_rows = len(state)
    num_cols = len(state[0])
    for i in range(num_rows):  
        for j in range(num_cols):
            if state[i][j] != None and state[i][j] != i*num_cols + j + 1:
                num_wrong += 1
    return num_wrong

def manhattan_heuristic(node):
    state = node.board.state
    distances = []
    num_rows = len(state)
    num_cols = len(state[0])
    for i in range(num_rows):  
        for j in range(num_cols):
            entry = state[i][j]
            if entry != None: 
                correct_j = (entry-1) % num_cols 
                correct_i = (entry-1) // num_cols
                distances.append(abs(i-correct_i) + abs(j-correct_j))
    return sum(distances)

def greedy_wrong(board): 
    return greedy_bfs(board, wrong_heuristic)

def astar_wrong(board): 
    return astar(board, wrong_heuristic)

def greedy_manhattan(board): 
    return greedy_bfs(board, manhattan_heuristic)

def astar_manhattan(board): 
    return astar(board, manhattan_heuristic)
