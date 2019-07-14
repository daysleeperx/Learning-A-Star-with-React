class PriorityQueue {
    constructor(values, comparator = (a, b) => a < b) {
        this._top = 0;
        this._heap = [];
        this._comparator = comparator;
        values.forEach(v => this.push(v));
    }

    get heap() {
        return this._heap;
    }

    set heap(value) {
        this._heap = value;
    }

    get comparator() {
        return this._comparator;
    }

    set comparator(value) {
        this._comparator = value;
    }

    _parent = (i) => ((i + 1) >>> 1) - 1;
    _left = (i) => (i << 1) + 1;
    _right = (i) => (i + 1) << 1;

    size() {
        return this._heap.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    peek() {
        return this._heap[this._top];
    }

    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
    }

    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this._top) {
            this._swap(this._top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    _greater(node, parent) {
        return this._comparator(this._heap[node], this._heap[parent]);
    }

    _swap(node, parent) {
        [this._heap[node], this._heap[parent]] = [this._heap[parent], this._heap[node]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > this._top && this._greater(node, this._parent(node))) {
            this._swap(node, this._parent(node));
            node = this._parent(node);
        }
    }

    _siftDown() {
        let node = this._top;
        while ((this._left(node) < this.size() && this._greater(this._left(node), node))
        || (this._right(node) < this.size() && this._greater(this._right(node), node))) {
            let maxChild = (this._right(node) < this.size() && this._greater(this._right(node), this._left(node))) ? this._right(node) : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }

    static copy(queue) {
        return new PriorityQueue(queue.heap, queue.comparator);
    }
}

export { PriorityQueue };