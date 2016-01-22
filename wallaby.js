module.exports = function (wallaby) {

  // only one pattern (app files) needs to be instrumented
  wallaby.defaults.files.instrument = false;

  return {
    files: [
      // NOTE that with npm >=3 the file structure may be different
      'node_modules/angular2/node_modules/zone.js/dist/zone-microtask.js',
      'node_modules/angular2/node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/angular2/node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
      'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/reflect-metadata/Reflect.js',

      '!app/**/*_spec.ts',
      '!app/**/*.d.ts',
      {pattern: 'app/**/*.ts', instrument: true, load: false},

      'app/**/*.html'
    ],

    tests: [
      {pattern: 'app/**/*_spec.ts', load: false}
    ],

    env: {
      runner: "node_modules/karma-phantomjs2-launcher/node_modules/phantomjs2-ext/lib/phantom/bin/phantomjs"
    },

    // inlining templates
    preprocessors: {
      'app/**/*.ts': require('wallaby-gulp-adapter')(require('gulp-inline-ng2-template')({base: 'app', target: 'es5'}))
    },

    // CompilerOptions from https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({
        // CommonJs
        module: 1,
        emitDecoratorMetadata: true,
        experimentalDecorators: true
      })
    },

    // serving node modules contents as is if/when requested
    middleware: function (app, express) {
      app.use('/node_modules',
        express.static(
          require('path').join(__dirname, 'node_modules')));
    },

    bootstrap: function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

      wallaby.delayStart();

      System.config({
        baseURL: '/',
        defaultJSExtensions: true,
        paths: {
          'angular2/*': 'node_modules/angular2/*.js',
          'rx': 'node_modules/angular2/node_modules/rx/dist/rx.js'
        }
      });

      var promises = wallaby.tests.map(function (test) {
        return System.import(test.replace(/\.js$/, ''));
      });

      System.import('angular2/src/dom/browser_adapter')
        .then(function (browser_adapter) {
          browser_adapter.BrowserDomAdapter.makeCurrent();
        })
        .then(function () {
          return Promise.all(promises).then(function (loadedTests) {
            // Angular 2 exports main function from tests, so let's call it
            loadedTests.forEach(function (test) {
              test.main && test.main();
            });

            // starting wallaby test run when everything required is loaded
            wallaby.start();
          });
        });
    },

    debug: true
  };
};
