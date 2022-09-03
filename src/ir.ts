export namespace IR {
    export enum EType {
        STRING,
        NUMBER,
        BOOLEAN,
        POINTER,
    }

    export enum ENode {
        LITERAL = 'LiteralNode',
        CALL_EXPRESSION = 'CallExpressionNode'
    }

    type BooleanLiteralNode = {
        kind: ENode.LITERAL
        type: EType.BOOLEAN
        data: boolean
    }

    type StringLiteralNode = {
        kind: ENode.LITERAL
        type: EType.STRING
        data: string
    }

    type NumberLiteralNode = {
        kind: ENode.LITERAL
        type: EType.NUMBER
        data: number
    }

    export type LiteralNode = BooleanLiteralNode | StringLiteralNode | NumberLiteralNode
}

