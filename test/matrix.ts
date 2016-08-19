///<reference path="../typings/mocha/mocha.d.ts" />
///<reference path="../typings/should/should.d.ts" />

import {Matrix, Size} from '../src/algebra'


describe('Matrix', function () {

    var A = new Matrix([3,3],[1,2,3,4,5,6,7,8,9]);
    var B = new Matrix([3,1],[2,1,3]);
    var AB = new Matrix([3,1],[13,31,49]);
    var At = new Matrix([3,3],[1,4,7,2,5,8,3,6,9]);
    var Bt = new Matrix([1,3],[2,1,3]);
    var b = new Matrix([3,1],[3,2,1]);
    var b2 = new Matrix([3,1], [6,11,9]);
    var b3 = new Matrix([3,1],[1,5,16]);

    describe('#Creation', function () {

        it('should use the provided array as a buffer', function () {
            var a = [1,2,3,4];
            var m = new Matrix([2,2], a);
            m.array.should.equal(a);
        });

        it.skip('should accept a nested-array as input', function () {
            var size : [number, number] = [2,3];
            var a = [1,2,3,4,5,6];
            // XXX commenting out this line to satisfy type checking
            //var m = new Matrix([[1,2,3],[4,5,6]]);
            var n = new Matrix(size, a);
            //n.should.eql(m);
        });

        it('should copy the size property', function () {
            var size = new Size(2,4);
            var m = new Matrix(size);
            m.size.should.not.equal(size);
        });

        it('should have the correct size', function () {
            var size = new Size(2,4);
            var m = new Matrix(size);
            m.size.should.eql(size);
        });
    });

    describe('#identity', function () {

        it('should default to square matrix', function (){
            var size = 3;
            var m = Matrix.identity(size);
            m.size.should.eql(new Size(size,size));
            m.array.length.should.eql(size*size);
        });

        it('should make the correct size', function (){
            var size = new Size(3,3);
            var m = Matrix.identity(size);
            m.size.should.eql(size);
            m.array.length.should.eql(size.n*size.m);
        });

        it('should return an identity matrix', function () {
            var a = [1,0,0,0,1,0,0,0,1]; //3x3 identity array
            var size = new Size(3,3);
            var m = Matrix.identity(size);
            m.array.should.eql(a);
        });

        it('should make a rectangular matrix if asked for', function (){
            var size = new Size(2,4);
            var m = Matrix.identity(size);
            m.size.should.eql(size);
        });

        it('should have ones on the diagonal in rectangular case', function () {
            var size = new Size(3,4);
            var a = [1,0,0,0, 0,1,0,0, 0,0,1,0]; //in row-major format
            var m = Matrix.identity(size);
            m.array.should.eql(a);
        });
    });

    describe('#multiply', function () {

        it('should work with right-identity (square)', function () {
            var I = Matrix.identity(A.size);
            A.multiply(I).should.eql(A);
        });

        it('should work with left-identity (square)', function () {
            var I = Matrix.identity(A.size);
            I.multiply(A).should.eql(A);
        });

        it('should work with right-identity (rectangle)', function () {
            var I = Matrix.identity(B.size.n);
            B.multiply(I).should.eql(B);
        });

        it('should work with left-identity (square)', function () {
            var I = Matrix.identity(B.size.m);
            I.multiply(B).should.eql(B);
        });

        it('should give the right answer', function () {
            A.multiply(B).should.eql(AB);
        });

        it('should have the correct size', function () {
            var M = new Matrix([4,10]);
            var N = new Matrix([10,2]);
            M.multiply(N).size.should.eql(new Size(4,2));
        });
    });

    describe('#transpose', function () {

        it('should swap the dimensions', function () {
            var M = new Matrix([3,20]);
            M.transpose().size.should.eql(new Size(20,3));
        });

        it('should move the elements properly (square)', function () {
            A.transpose().should.eql(At);
        });

        it('should move the elements properly (rectangular)', function () {
            B.transpose().should.eql(Bt);
        });
    });


    describe('#utSolve', function () {

        it('should work when used with the identity matrix', function () {
            var x = Matrix.identity(b.size.m).utSolve(b);
            x.should.eql(b);
        });

        it('should solve the upper part of a general matrix', function () {
            var x = new Matrix([3,1],[1,1,1]);
            A.utSolve(b2).should.eql(x);
        });

        it("should throw an error if matrix isn't square", function () {
            B.utSolve.bind(B,b).should.throw();
        });

        it("should throw an error if dimensions don't match", function () {
            var x = new Matrix([4,1])
            A.utSolve.bind(A,x).should.throw();
        });

        it("should throw an error if b is not a vector", function () {
            A.utSolve.bind(A,A).should.throw();
        });
    });

    describe('#ltSolve', function () {

        it('should work when used with the identity matrix', function () {
            var x = Matrix.identity(b.size.m).ltSolve(b);
            x.should.eql(b);
        });

        it('should solve the lower part of a general matrix', function () {
            var x = new Matrix([3,1],[1,1,1]);
            A.ltSolve(b3).should.eql(x);
        });

        it("should throw an error if matrix isn't square", function () {
            B.ltSolve.bind(B,b).should.throw();
        });

        it("should throw an error if dimensions don't match", function () {
            var x = new Matrix([4,1])
            A.ltSolve.bind(A,x).should.throw();
        });

        it("should throw an error if b is not a vector", function () {
            A.ltSolve.bind(A,A).should.throw();
        });
    });

    describe('#solve', function () {

        it('should work when used with the identity matrix', function () {
            var x = Matrix.identity(b.size.m).solve(b);
            x.should.eql(b);
        });

        it('should solve a general matrix', function () {
            var A = Matrix.random(new Size(4,4));
            var x = new Matrix([4,1], [1,1,1,1]);
            var b = A.multiply(x);
            var y = A.solve(b);
            y.size.should.be.eql(x.size);
            for (let i = 0; i < y.size.m*y.size.n; i++)
                y.array[i].should.be.approximately(x.array[i], 1e-6);
        });

        it("should throw an error if matrix isn't square", function () {
            B.solve.bind(B,b).should.throw();
        });

        it("should throw an error if dimensions don't match", function () {
            var x = new Matrix([4,1])
            A.solve.bind(A,x).should.throw();
        });

        it("should throw an error if b is not a vector", function () {
            A.solve.bind(A,A).should.throw();
        });
    });
});
