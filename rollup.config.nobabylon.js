const ignoreImport = require('rollup-plugin-ignore-import');

module.exports = {
    input: 'src/babylonscene.js',
    inlineDynamicImports: true,
    output: {
        file: 'babylonscene.nobabylon.js',
        format: 'iife',
        name: 'babylonscene',
        sourcemap: true
    },
    plugins: [
        ignoreImport({
            include: ['./web_modules/babylonjs.js']
        })
    ]
};
