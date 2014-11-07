'use strict';

var algebra = require('../lib/algebra.js');

describe('Matrix', function () {
    describe('#Creation', function () {

        it('should use the provided array as a buffer', function () {
            var a = [1,2,3,4];
            var m = new algebra.Matrix([2,2], a);
            m.array.should.equal(a);
        });
            
        it('should copy the size property', function () {
            var size = [2,4];
            var m = new algebra.Matrix(size);
            m.size.should.not.equal(size);
        });

        it('should have the correct size', function () {
            var size = [2,4];
            var m = new algebra.Matrix(size);
            m.size.should.eql(size);
        });
    });
});
