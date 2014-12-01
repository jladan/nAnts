'use strict';

var algebra = require('../lib/algebra.js');

describe('Matrix', function () {

    var A = new algebra.Matrix([3,3],[1,2,3,4,5,6,7,8,9]);
    var B = new algebra.Matrix([3,1],[2,1,3]);
    var AB = new algebra.Matrix([3,1],[13,31,49]);        
    var At = new algebra.Matrix([3,3],[1,4,7,2,5,8,3,6,9]);
    var Bt = new algebra.Matrix([1,3],[2,1,3]);


    describe('#Creation', function () {

        it('should use the provided array as a buffer', function () {
            var a = [1,2,3,4];
            var m = new algebra.Matrix([2,2], a);
            m.array.should.equal(a);
        });

        it('should accept a nested-array as input', function () {
            var size = [2,3];
            var a = [1,2,3,4,5,6];
            var m = new algebra.Matrix([[1,2,3],[4,5,6]]);
            var n = new algebra.Matrix(size, a);
            n.should.eql(m);
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

        it('should work with right-identity (square)', function () {
            var I = algebra.identity(A.size);
            A.multiply(I).should.eql(A);
        });
        
        it('should work with left-identity (square)', function () {
            var I = algebra.identity(A.size);
            I.multiply(A).should.eql(A);
        });
        
        it('should work with right-identity (rectangle)', function () {
            var I = algebra.identity(B.size[1]);
            B.multiply(I).should.eql(B);
        });
        
        it('should work with left-identity (square)', function () {
            var I = algebra.identity(B.size[0]);
            I.multiply(B).should.eql(B);
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

    describe('#transpose', function () {

        it('should swap the dimensions', function () {
            var M = new algebra.Matrix([3,20]);
            M.transpose().size.should.eql([20,3]);
        });

        it('should move the elements properly (square)', function () {
            A.transpose().should.eql(At);
        });

        it('should move the elements properly (rectangular)', function () {
            B.transpose().should.eql(Bt);
        });
    });

    var b = new algebra.Matrix([3,1],[3,2,1]);
    var b2 = new algebra.Matrix([3,1], [6,11,9]);

    describe('#utSolve', function () {

        it('should work when used with the identity matrix', function () {
            var x = new algebra.identity(b.size[0]).utSolve(b);
            x.should.eql(b);
        });

        it('should solve the upper part of a general matrix', function () {
            var x = new algebra.Matrix([3,1],[1,1,1]);
            A.utSolve(b2).should.eql(x);
        });
        
        it("should throw an error if matrix isn't square", function () {
            B.utSolve.bind(B,b).should.throw();
        });

        it("should throw an error if dimensions don't match", function () {
            var x = new algebra.Matrix([4,1])
            A.utSolve.bind(A,x).should.throw();
        });

        it("should throw an error if b is not a vector", function () {
            A.utSolve.bind(A,A).should.throw();
        });
    });
    
    var b3 = new algebra.Matrix([3,1],[1,5,16]);

    describe('#ltSolve', function () {

        it('should work when used with the identity matrix', function () {
            var x = new algebra.identity(b.size[0]).ltSolve(b);
            x.should.eql(b);
        });

        it('should solve the lower part of a general matrix', function () {
            var x = new algebra.Matrix([3,1],[1,1,1]);
            A.ltSolve(b3).should.eql(x);
        });
        
        it("should throw an error if matrix isn't square", function () {
            B.ltSolve.bind(B,b).should.throw();
        });

        it("should throw an error if dimensions don't match", function () {
            var x = new algebra.Matrix([4,1])
            A.ltSolve.bind(A,x).should.throw();
        });

        it("should throw an error if b is not a vector", function () {
            A.ltSolve.bind(A,A).should.throw();
        });
    });

});
