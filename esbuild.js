const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    format: 'cjs',
    platform: 'node',
})

