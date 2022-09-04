import { it, describe, expect } from "@jest/globals";
import { stat } from "fs";
import { Stack } from "./stack";

describe('Stack', () => {
    describe('constructor', () => {
        it('should create Stack with empty data', () => {
            const stack = new Stack();

            // Accessing a private field
            // @ts-ignore
            const size = stack._data.length

            expect(size).toBe(0)
        })
    })

    describe('push', () => {
        it('should put value into the stack', () => {
            const stack = new Stack<number>()
            stack.push(1)

            // Accessing a private field
            // @ts-ignore
            const data = stack._data

            expect(data).toEqual([1])
        })

        it('should put value on the top of the stack', () => {
            const stack = new Stack<number>()
            stack.push(1)
            stack.push(2)

            // Accessing a private field
            // @ts-ignore
            const data = stack._data

            expect(data).toEqual([1, 2])
        })
    })

    describe('pop', () => {
        it('should remove the top value of the stack', () => {
            const stack = new Stack<number>()
            stack.push(1)
            stack.push(2)
            stack.pop()

            // Accessing a private field
            // @ts-ignore
            const data = stack._data

            expect(data).toEqual([1])
        })

        it('should return the top value of the stack', () => {
            const stack = new Stack<number>()
            stack.push(1)
            stack.push(2)
            const value = stack.pop()

            expect(value).toBe(2)
        })


        it('should throw and exception if stack is empty', () => {
            const stack = new Stack<number>()
            const pop = () => stack.pop()
            expect(pop).toThrow()
        })
    })
})

