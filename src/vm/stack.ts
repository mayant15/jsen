export class Stack<T> {
    private _data: T[];

    constructor() {
        this._data = []
    }

    push(x: T) {
        this._data.push(x);
    }

    pop(): T {
        const val = this._data.pop()
        if (val === undefined) {
            throw Error('[vm] attempted to pop an empty stack')
        }
        return val
    }
}

