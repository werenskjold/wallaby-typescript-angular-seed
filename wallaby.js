module.exports = function (wallaby) {

    return {
        files: [
            'node_modules/angular2/node_modules/zone.js/dist/zone-microtask.js',
            'node_modules/angular2/node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/angular2/node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
            'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/reflect-metadata/Reflect.js',

            '!app/**/*_spec.ts',
            '!app/**/*.d.ts',
            'app/**/*.ts'
        ],

        tests: [
            'app/**/*_spec.ts'
        ],
        env: {
            runner: "node_modules/karma-phantomjs2-launcher/node_modules/phantomjs2-ext/lib/phantom/bin/phantomjs"
        },
        // TypeScript compiler is on by default with default options,
        // you can configure built-in compiler by passing options to it
        // See interface CompilerOptions in
        // https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts
        //compilers: {
        //  '**/*.ts': wallaby.compilers.typeScript({module: 1})
        //},

    };
};
