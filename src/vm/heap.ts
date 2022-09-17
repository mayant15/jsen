export class Heap<T> {
    private _data: (T | null)[]

    constructor() {
        this._data = []
    }

    get(addr: number): T {
        const value = this._data[addr]
        if (value === null) {
            throw Error(`[vm] accessing unallocated heap memory`)
        }
        return value
    }

    set(addr: number, value: T) {
        this._data[addr] = value
    }

    create(init?: T): number {
        // Use the first available slot, or the last element if no elements are null
        const index = this._data.indexOf(null)
        const address = index === -1 ? this._data.length : index
        if (init) {
            this._data[address] = init
        }
        return address
    }

    destroy(addr: number) {
        this._data[addr] = null
    }
}

