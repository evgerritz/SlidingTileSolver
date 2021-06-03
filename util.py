class Queue():
    def __init__(self, items=None):
        self.queue = items if items else []

    def push(self, item):
        self.queue.append(item)

    def pop(self):
        if not self.isEmpty():
            return self.queue.pop(0)

    def isEmpty(self):
        return len(self.queue) == 0

class Stack():
    def __init__(self, items=None):
        self.stack = items if items else []

    def push(self, item):
        self.stack.append(item)

    def pop(self):
        if not self.isEmpty():
            return self.stack.pop()

    def isEmpty(self):
        return len(self.stack) == 0

class PriorityQueue():
    def __init__(self, function, items = []):
        self.cache = {}
        self.heap = []
        self.f = function
        for item in items:
            self.push(item)

    def _get_state(self, item):
        return tuple(map(tuple, item.board.state))

    def push(self, item):
        state = self._get_state(item)
        fval = self.cache.setdefault(state, self.f(item))
        self.heap.append(item)
        currentIndex = len(self.heap)-1
        while (parentIndex := (currentIndex-1)//2) >= 0:
            parent = self.heap[parentIndex] 
            if fval < self.cache[self._get_state(parent)]:
                self.heap[parentIndex] = self.heap[currentIndex]
                self.heap[currentIndex] = parent 
            else:
                break
            currentIndex = parentIndex


    def pop(self):
        if not self.isEmpty():
            rootpos = 0
            popped = self.heap[rootpos]
            self.heap[rootpos] = self.heap[-1]
            self.heap.pop() 

            finalIndex = len(self.heap)-1

            parentpos = rootpos
            leftchildpos, rightchildpos = 1, 2
            while leftchildpos <= finalIndex:
                if rightchildpos <= finalIndex:
                    smallerChildPos = leftchildpos if self.cache[self._get_state(self.heap[leftchildpos])] < self.cache[self._get_state(self.heap[rightchildpos])] else rightchildpos
                else:
                    smallerChildPos = leftchildpos

                if self.cache[self._get_state(self.heap[parentpos])] < self.cache[self._get_state(self.heap[smallerChildPos])]:
                    break
                else:
                    self.heap[parentpos], self.heap[smallerChildPos] = self.heap[smallerChildPos], self.heap[parentpos]

                parentpos = smallerChildPos
                leftchildpos = 2*parentpos+1
                rightchildpos = 2*parentpos+2
                    
            return popped
        else:
            return None

    def isEmpty(self):
        return len(self.heap) == 0
