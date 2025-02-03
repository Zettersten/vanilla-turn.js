import path from 'path';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const dev = process.env.ROLLUP_WATCH;

export default {
    input: './src/turn.js',
    output: [
        {
            file: 'dist/turn.es.js',
            format: 'es',
            sourcemap: true
        },
        {
            file: 'dist/turn.umd.js',
            format: 'umd',
            name: 'Turn',
            sourcemap: true
        }
    ],
    plugins: [
        // Only apply serve and livereload when in dev mode
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