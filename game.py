import numpy as np
import random
import search

class Board():
    def __init__(self, n, start=None): 
        self.board_size = n
        board_values = np.append(np.arange(1,self.board_size**2), None)
        self.solved = board_values.reshape((self.board_size, self.board_size))
        if start is None or not self.isValidState(start):
            self.state = self.solved.copy()
            self.shuffleBoard()
        else:
            self.state = np.array(start)

    def shuffleBoard(self):
        """ Monte Carlo board shuffling """
        probTerm = 0.3 ** self.board_size
        while random.random() > probTerm:
            move = random.choice(self.getValidMoves())
            self.makeMove(move)


    def isValidState(self, state):
        """
        A state (multidimensional list or numpy array) is valid if it satisfies the following:
            The number of dimensions matches that in board_size
            The state contains each number from 1 to board_size^2-1 exactly once
            The state contains an empty space (represented by None)
        """
        state = np.array(state)
        isOfCorrectDimensions = (np.shape(state) == (self.board_size, self.board_size))
        if not isOfCorrectDimensions: return False

        state = state.flatten()
        hasEmptySpace = None in state
        state = state[state != None]
        uniqueVals = np.unique(state)
        sortedVals = np.sort(state)
        allUnique = (len(uniqueVals) == len(sortedVals) and uniqueVals == sortedVals)
        valuesCorrect = (sum(state) == sum(range(1,self.board_size**2)))
        return hasEmptySpace and valuesCorrect

    def isValidLocation(self, coord):
        return 0 <= coord[0] < self.board_size and 0 <= coord[1] < self.board_size

    def getTileLocation(self, tile):
        location = np.where(self.state == tile)
        return (location[0][0], location[1][0])

    def getTileFromLocation(self, location):
        return self.state[location[0]][location[1]]

    def getNeighborsOfTile(self, tile):
        tile_location = self.getTileLocation(tile)
        neighborIndices = np.array([np.add(tile_location, offset) for offset in ((0,1), (0,-1), (1,0), (-1,0))])
        neighborIndices = neighborIndices[np.array([self.isValidLocation(loc) for loc in neighborIndices])]
        neighbors = [self.getTileFromLocation(location) for location in neighborIndices]
        return neighbors

    def isValidMove(self, tile):
        """
        A move is valid if it moves a tile that is horizontally or vertically adjacent to the empty space
        """
        return tile in self.getNeighborsOfTile(None)

    def getValidMoves(self):
        return self.getNeighborsOfTile(None)

    def swapTiles(self, tile1, tile2):
        (tile1_row, tile1_col) = self.getTileLocation(tile1)
        (tile2_row, tile2_col) = self.getTileLocation(tile2)
        self.state[tile1_row][tile1_col] = tile2
        self.state[tile2_row][tile2_col] = tile1

    
    def makeMove(self, tile):
        if self.isValidMove(tile):
            self.swapTiles(tile, None)
        else:
            return None

    def isSolved(self):
        return (self.state == self.solved).all()

    def copy(self):
        return Board(self.board_size, self.state.copy())

    def display(self, padding=1):
        #get the width of the largest digit
        flattened = self.state.flatten()
        flattened = flattened[flattened != None]
        max_digit = np.max(flattened)
        max_digit_width = 0
        while max_digit != 0:
            max_digit_width += 1
            max_digit//=10 

        for _ in range(0,padding):
            print()
        for row in self.state:
            strings = [str(num).rjust(max_digit_width) if num != None else ''.rjust(max_digit_width) for num in row]
            print(' '*padding*2,end='')
            print(*strings,end='')
            print(' '*padding*2)
        for _ in range(0,padding):
            print()



if __name__ == '__main__':
    size = int(input('Enter size of board: '))
    board = Board(size)
    board.display()

    solution = search.astar_manhattan(board)
    print(solution)

    while not board.isSolved():
        move = int(input())
        board.makeMove(move)
        board.display()
  
