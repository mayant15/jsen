const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: './dist/index.js',
    format: 'cjs',
    platform: 'node',
})

