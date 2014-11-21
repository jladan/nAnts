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

    describe('#identity', function () {

        it('should default to square matrix', function (){
            var size = 3;
            var m = new algebra.identity(size);
            m.size.should.eql([size,size]);
        });

        it('should make the correct size', function (){
            var size = [3,3];
            var m = new algebra.identity(size);
            m.size.should.eql(size);
        });

        it('should return an identity matrix', function () {
            var a = [1,0,0,0,1,0,0,0,1]; //3x3 identity array
            var m = new algebra.identity([3,3]);
            m.array.should.eql(a);
        });

        it('should make a rectangular matrix if asked for', function (){
            var size = [2,4];
            var m = new algebra.identity(size);
            m.size.should.eql(size);
        });

        it('should have ones on the diagonal in rectangular case', function () {
            var size = [3,4];
            var a = [1,0,0,0, 0,1,0,0, 0,0,1,0]; //in row-major format
            var m = new algebra.identity(size);
            m.array.should.eql(a);
        });
    });

    describe('#multiply', function () {

        var A = new algebra.Matrix([3,3],[1,2,3,4,5,6,7,8,9]);
        var B = new algebra.Matrix([3,1],[2,1,3]);
        var AB = new algebra.Matrix([3,1],[13,31,49]);        

        it('should work with right-identity', function () {
            var I = algebra.identity(A.size);
            A.multiply(I).should.eql(A);
        });
        
        it('should work with left-identity', function () {
            var I = algebra.identity(A.size);
            I.multiply(A).should.eql(A);
        });

        it('should give the right answer', function () {
            A.multiply(B).should.eql(AB);
        });

        it('should have the correct size', function () {
            var M = new algebra.Matrix([4,10]);
            var N = new algebra.Matrix([10,2]);
            M.multiply(N).size.should.eql([4,2]);
        });
    });

});
