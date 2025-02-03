import path from 'path';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

const dev = process.env.ROLLUP_WATCH;
const production = !dev;
const demo = process.env.BUILD_DEMO === 'true';

// Custom plugin to write the current filename to a manifest
function manifestPlugin() {
    let files = {};
    return {
        name: 'manifest',
        generateBundle(options, bundle) {
            if (!demo) return; // Only generate manifest for demo build
            
            const fileName = Object.keys(bundle)
                .find(name => name.endsWith(`${options.format}.js`) && !name.endsWith('.map'));
            
            if (fileName) {
                files[options.format] = fileName;
            }

            if (Object.keys(files).length === 2) {
                const manifest = {
                    es: files.es,
                    umd: files.umd
                };
                this.emitFile({
                    type: 'asset',
                    fileName: 'manifest.json',
                    source: JSON.stringify(manifest, null, 2)
                });
            }
        }
    };
}

// Base config for both modes
const baseConfig = {
    input: './src/turn.js',
    plugins: [
        resolve({ browser: true }),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: [
                ['@babel/preset-env', {
                    targets: '> 0.25%, not dead',
                    modules: false
                }]
            ]
        }),
        production && terser({
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }),
        filesize()
    ].filter(Boolean)
};

// Demo config with hashed filenames
const demoConfig = {
    ...baseConfig,
    output: [
        {
            dir: 'dist',
            format: 'es',
            sourcemap: true,
            entryFileNames: 'turn-[hash].es.js',
            exports: 'named'
        },
        {
            dir: 'dist',
            format: 'umd',
            name: 'Turn',
            sourcemap: true,
            entryFileNames: 'turn-[hash].umd.js',
            exports: 'named'
        }
    ],
    plugins: [
        ...baseConfig.plugins,
        manifestPlugin(),
        dev && serve({
            open: true,
            contentBase: ['dist', '.'],
            port: 3000
        }),
        dev && livereload({
            watch: ['dist', '.']
        })
    ].filter(Boolean)
};

// NPM package config with fixed filenames
const npmConfig = {
    ...baseConfig,
    output: [
        {
            file: 'dist/turn.es.js',
            format: 'es',
            sourcemap: true,
            exports: 'named'
        },
        {
            file: 'dist/turn.umd.js',
            format: 'umd',
            name: 'Turn',
            sourcemap: true,
            exports: 'named'
        }
    ]
};

export default demo ? demoConfig : npmConfig; 