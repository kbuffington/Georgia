// ==PREPROCESSOR==
// @name 'Linked List'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

/**
 * @template T
 */
class Node {
    /**
     * @param {T} value
     * @param {?Node} prev
     * @param {?Node} next
     * @constructor
     * @struct
     */
    constructor(value, prev, next) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

/**
 * @constructor
 * @template T
 */
function LinkedList() {
    this.clear = function () {
        back = null;
        front = null;
        size = 0;
    };

    /**
     * @param {T} value
     */
    this.push_back = function (value) {
        add_node(new Node(value, back, null));
    };

    /**
     * @param {T} value
     */
    this.push_front = function (value) {
        add_node(new Node(value, null, front));
    };

    this.pop_front = function () {
        remove_node(front);
    };

    this.pop_back = function () {
        remove_node(back);
    };

    /**
     * @param {LinkedList.Iterator<T>} iterator
     */
    this.remove = function (iterator) {
        if (!(iterator instanceof LinkedList.Iterator)) {
            throw new InvalidTypeError(iterator, typeof iterator, 'Iterator');
        }

        if (iterator.parent !== this) {
            throw new LogicError('Using iterator from a different list');
        }

        if (iterator.compare(this.end())) {
            throw new LogicError('Removing invalid iterator');
        }

        remove_node(iterator.cur_node);

        iterator.cur_node = this.end_node;
    };

    /**
     * @return {T}
     */
    this.front = function () {
        return front.value;
    };

    /**
     * @return {T}
     */
    this.back = function () {
        return back.value;
    };

    /**
     * @return {number}
     */
    this.length = function () {
        return size;
    };

    /**
     * This method creates Iterator object
     * @return {LinkedList.Iterator<T>}
     */
    this.begin = function () {
        return new LinkedList.Iterator(this, front ? front : this.end_node);
    };

    /**
     * This method creates Iterator object
     * @return {LinkedList.Iterator<T>}
     */
    this.end = function () {
        return new LinkedList.Iterator(this, this.end_node);
    };

    /**
     * @param {Node} node
     */
    function add_node(node) {
        if (node.prev) {
            node.prev.next = node;
        }
        else {
            front = node;
        }

        if (node.next) {
            node.next.prev = node;
        }
        else {
            back = node;
        }

        ++size;
    }

    /**
     * @param {?Node} node
     */
    function remove_node(node) {
        if (!node) {
            return;
        }

        if (node.prev) {
            node.prev.next = node.next;
        }
        else {
            front = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        }
        else {
            back = node.prev;
        }

        --size;
    }

    /** @type {?Node} */
    var back = null;
    /** @type {?Node} */
    var front = null;
    /** @type {number} */
    var size = 0;

    /**
     * @const {Node}
     */
    this.end_node = new Node(null, null, null);
}

/**
 * @param {LinkedList} parent
 * @param {Node} node
 * @constructor
 * @template T
 */
LinkedList.Iterator = function (parent, node) {
    this.increment = function () {
        if (this.cur_node === parent.end_node) {
            throw new LogicError('Iterator is out of bounds');
        }

        // @ts-ignore
        this.cur_node = this.cur_node.next;
        if (!this.cur_node) {
            this.cur_node = parent.end_node;
        }
    };

    this.decrement = function () {
        // @ts-ignore
        if (this.cur_node === front) {
            throw new LogicError('Iterator is out of bounds');
        }

        if (this.cur_node === parent.end_node) {
            // @ts-ignore
            this.cur_node = back;
        } else {
            // @ts-ignore
            this.cur_node = this.cur_node.prev;
        }
    };

    /**
     * @return {T}
     */
    this.value = function () {
        if (this.cur_node === parent.end_node) {
            throw new LogicError('Accessing end node');
        }

        return this.cur_node.value;
    };

    /**
     * @param {LinkedList.Iterator} iterator
     * @return {boolean}
     */
    this.compare = function (iterator) {
        if (iterator.parent !== this.parent) {
            throw new LogicError('Comparing iterators from different lists');
        }
        return iterator.cur_node === this.cur_node;
    };

    /** @const {LinkedList} */
    this.parent = parent;
    /** @type {Node} */
    this.cur_node = node;
};
