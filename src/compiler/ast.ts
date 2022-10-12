import { ParseResult } from "@babel/parser";
import type * as Babel from "@babel/types"

export namespace Ast {
    export type MainNode = {
        body: StatementNode[]
    }

    export type BinaryExpression = {
        type: 'BinaryExpression'
        left: Expression
        right: Expression
        operator: '+' | '-' | '*' | '/'
    }

    export type NumericLiteralExpression = {
        type: 'NumericLiteral'
        value: number
    }

    export type StringLiteralExpression = {
        type: 'StringLiteral'
        value: string
    }

    export type IdentifierExpression = {
        type: 'Identifier'
        id: string
    }

    export type ObjectProperty = {
        id: string | number
        value: Expression
    }

    export type ObjectExpression = {
        type: 'ObjectExpression'
        properties: ObjectProperty[]
    }

    export type MemberExpression = {
        type: 'MemberExpression'
        object: Expression
        property: Expression
    }

    export type Expression = BinaryExpression | NumericLiteralExpression | StringLiteralExpression | IdentifierExpression | ObjectExpression | MemberExpression

    export type ExpressionNode = {
        type: 'ExpressionStatement'
        expression: Expression
    }

    export type VariableDeclarationNode = {
        type: 'VariableDeclaration'
        id: string
        isConst: boolean
        init: Expression | null
    }

    export type StatementNode = ExpressionNode | VariableDeclarationNode
}

function visitMain(node: Babel.Program): Ast.MainNode {
    return {
        body: node.body.flatMap(visitStatement)
    }
}

function visitStatement(node: Babel.Statement): Ast.StatementNode[] {
    switch (node.type) {
        case 'ExpressionStatement':
            return [visitExpressionStatement(node)]
        case 'VariableDeclaration':
            return visitVariableDeclaration(node)
        default:
            throw Error(`[compiler] ParserError: Unsupported statement type ${node.type}`)
    }
}

function visitExpressionStatement(node: Babel.ExpressionStatement): Ast.ExpressionNode {
    return {
        type: 'ExpressionStatement',
        expression: visitExpression(node.expression)
    }
}

function visitPrivateName(node: Babel.PrivateName): Ast.IdentifierExpression {
    return {
        type: 'Identifier',
        id: node.id.name,
    }
}

function visitExpression(node: Babel.Expression): Ast.Expression {
    switch (node.type) {
        case 'NumericLiteral':
            return {
                type: 'NumericLiteral',
                value: node.value
            }
        case 'StringLiteral':
            return {
                type: 'StringLiteral',
                value: node.value
            }
        case 'BinaryExpression':
            return {
                type: 'BinaryExpression',
                left: node.left.type === 'PrivateName'
                    ? visitPrivateName(node.left)
                    : visitExpression(node.left),
                right: visitExpression(node.right),
                operator: node.operator as any // TODO: I don't want to support all operators right now
            }
        case 'Identifier':
            return {
                type: 'Identifier',
                id: node.name
            }
        case 'ObjectExpression':
            return visitObjectExpression(node)
        case 'MemberExpression':
            return visitMemberExpression(node)
        default:
            throw Error(`[compiler] ParserError: Unsupported expression type ${node.type}`)
    }
}

function visitVariableDeclaration(node: Babel.VariableDeclaration): Ast.VariableDeclarationNode[] {
    const isConst = node.kind === 'const'
    return node.declarations.map((decl): Ast.VariableDeclarationNode => {
        if (decl.id.type !== 'Identifier') {
            throw Error(`[compiler] ParserError: Unsupported assignment, only Identifiers allowed on LHS. Found ${decl.id.type}`)
        }
        return {
            type: 'VariableDeclaration',
            init: decl.init ? visitExpression(decl.init) : null,
            id: decl.id.name,
            isConst,
        }
    })
}

function visitObjectExpression(node: Babel.ObjectExpression): Ast.ObjectExpression {
    function makeProperty(property: Babel.ObjectExpression['properties'][number]): Ast.ObjectProperty {
        // TODO: Support member functions
        if (property.type === 'ObjectMethod') {
            throw Error(`[compiler] ParserError: Object methods are not supported`)
        }

        if (property.type === 'SpreadElement') {
            throw Error(`[compiler] ParserError: Spread elements are not supported for object properties.`)
        }

        const key = property.key.type === 'Identifier'
            ? property.key.name
            : property.key.type === 'StringLiteral'
                ? property.key.value
                : null

        if (key === null) {
            throw Error(`[compiler] ParserError: Unsupported key for object ${property.key.type}`)
        }

        return {
            id: key,
            value: visitExpression(property.value as Babel.Expression) // TODO: Ignore Babel.PatternLike
        }
    }

    return {
        type: 'ObjectExpression',
        properties: node.properties.map(makeProperty)
    }
}

function visitMemberExpression(node: Babel.MemberExpression): Ast.MemberExpression {
    // TODO: Only string literals are supported for member access
    const key = node.property.type === 'Identifier'
        ? node.property.name
        : node.property.type === 'StringLiteral'
            ? node.property.value
            : null

    if (key === null || node.property.type === 'PrivateName') {
        throw Error(`[compiler] ParserError: Unsupported key for object ${node.property.type}`)
    }

    return {
        type: 'MemberExpression',
        object: visitExpression(node.object),
        property: {
            type: 'StringLiteral',
            value: key
        }
    }
}

export const toAst = (parsed: ParseResult<Babel.File>): Ast.MainNode => {
    const ast = visitMain(parsed.program)
    return ast
}

