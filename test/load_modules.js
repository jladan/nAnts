'use strict';
var requirejs = require("requirejs");
requirejs.config({
    baseUrl: './src',
    nodeRequire: require
});

describe('Load Modules', function () {
    it('should load the matrix module', function () {
        var mod;
        var done = function() {
            mod.should.not.equal(undefined);
        };
        requirejs(['algebra'], function(m) {
            mod = m;
            done();
        });
    });

    it('should load the ode module', function () {
        var mod;
        var done = function() {
            mod.should.not.equal(undefined);
        };
        requirejs(['ode'], function(m) {
            mod = m;
            done();
        });
    });

    it('should load the stochastics module', function () {
        var mod;
        var done = function() {
            mod.should.not.equal(undefined);
        };
        requirejs(['stochastics'], function(m) {
            mod = m;
            done();
        });
    });

});
