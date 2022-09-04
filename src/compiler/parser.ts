import { parse as babelParse } from '@babel/parser'

export const parse = (code: string) => {
    return babelParse(code, {
        sourceType: 'script',
        strictMode: true
    })
}

