'use strict';

module.exports = (config) => {
    config.set({
        autoWatch: true,
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/lodash/lodash.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'src/scripts/app.js',
            'src/scripts/app.config.js',
            'src/scripts/app.constant.js',
            'src/scripts/**/*.js'
        ],
        exclude: [
            'node_modules/',
            'unit_coverage/',
            'dist/',
            'DOCS/',
            '.vscode'
        ],
        port: 8080,
        reporters: [
            'dots',
            'coverage'
        ],
        preprocessors: {
            'src/scripts/**/*.js': ['coverage'],
            'src/includes/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/',
            moduleName: 'app'
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'unit_coverage',
            check: {
                global: {
                    statements: 85,
                    lines: 85,
                    functions: 85,
                    branches: 85
                },
                each: {
                    statements: 33,
                    lines: 33,
                    functions: 33,
                    branches: 33,
                    excludes: [
                        '**/*.config.js',
                        '**/*.constant.js'
                    ]
                }
            }
        },
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],
        browsers: [
            'ChromeHeadless'
        ],
        browserNoActivityTimeout: 60000,
        singleRun: false,
        colors: true,
        logLevel: config.LOG_INFO
    });
};
