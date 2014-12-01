/* nAnjs Matrix and vector algebra library
 *
 * This module contains all of the matrix functions and algorithms,
 * notably:
 *  - Addition, multiplication
 *  - Inversion
 *  - Decomposition (LU, QR, etc.).
 *  - Determinants
 * 
 * Also included are matrix and vector creation algorithms
*/


/* Usage: nAn_algebra_module.apply(namespace) */
var nAn_algebra_module = function() {

    var THIS = this;

    /* Matrix object
     *
     * Creates a matrix of size `size`.
     * If `buffer` is an array, the matrix points to it, instead of creating a new array
     *
     * There are no guarantees of the values being initialized.
     * The matrix is in row-major format (because of row-pivoting)
     */
    this.Matrix = function(size, buffer) {
        this.size = size.slice();
        this.array = buffer || new Array(size[0]*size[1]);
    }

    /* return a copy of the matrix
     */
    this.Matrix.prototype.copy = function () {
        c = new THIS.Matrix(this.size, this.array.slice());
        return c;
    }

    /*  A matrix of size `size` with ones on the diagonal
     */
    this.identity = function (size) {
        var s,r;
        (size.constructor === Array) ? s=size : s=[size,size];
        r = new THIS.Matrix(s);
        for (i=0; i<s[0]*s[1]; i++)
            r.array[i] = 0;
        for (i=0; i<Math.min(s[0],s[1]); i++)
            r.array[s[1]*i+i] = 1;
        return r;
    }

    /* A matrix of size `size` filled with random entries
     */
    this.random = function (size) {
        var r = new THIS.Matrix(size);
        for (i=0; i<size[0]*size[1]; i++)
            r.array[i] = Math.random();
        return r;
    }

    /* Return the sum of two matrices
     */
    this.Matrix.prototype.add = function (m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        result = new THIS.Matrix(this.size)
        for (i=0; i<size[0]+size[1]; i++) {
            result.array[i] = this.array[i] + m.array[i]
        }
        return result;
    }
    
    /* Return the difference of two matrices
     */
    this.Matrix.prototype.subtract = function (m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        result = new THIS.Matrix(this.size)
        for (i=0; i<size[0]+size[1]; i++) {
            result.array[i] = this.array[i] - m.array[i]
        }
        return this;
    }

    /* Multiply the matrix on the *right* by m */
    // TODO: profile this code
    this.Matrix.prototype.multiply = function (m) {
        if (this.size[1] != m.size[0]) 
            throw Error("The matrix dimensions don't agree for multiplication");
        result = new THIS.Matrix([this.size[0], m.size[1]]);
        for (i=0; i<result.size[0]; i++) {
            for (j=0; j<result.size[1]; j++) {
                result.array[result.size[1]*i+j] = 0;
                for (k=0; k<this.size[1]; k++) {
                    result.array[result.size[1]*i+j] +=
                        this.array[this.size[1]*i+k] * m.array[m.size[1]*k+j];
                }
            }
        }
        return result;
    }

    /* transpose a matrix
     */
    this.Matrix.prototype.transpose = function (m) {
        result = new THIS.Matrix([this.size[1], this.size[0]]);
        for (i=0; i<this.size[0]; i++) {
            for (j=0; j<this.size[1]; j++) {
                result.array[result.size[1]*j+i] = this.array[this.size[1]*i+j];
            }
        }
        return result;

    }

    this.Matrix.prototype.iAdd = function (m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        for (i=0; i<size[0]+size[1]; i++) {
            this.array[i] += m.array[i]
        }
        return this;
    }

    this.Matrix.prototype.iSubtract = function (m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        for (i=0; i<size[0]+size[1]; i++) {
            this.array[i] -= m.array[i]
        }
        return this;
    }

    /* A solver for upper triangular matrices, also known as a back-solve.
     *
     * The Matrix is not checked to be upper triangular, so no error will be
     * thrown if a non-zero element is below the diagonal. This makes it
     * possible to use on an LU decomposition that's stored in a single matrix.
     */
    this.Matrix.prototype.utSolve = function (b) {
        if (this.size[0] != this.size[1])
            throw new Error('Matrix must be square');
        if (this.size[1] != b.size[0]) 
            throw new Error('Number of rows in the matrices must agree');
        if (b.size[1] != 1)
            throw new Error('Upper triangular solve is only implemented for vectors in this version');

        var x = new THIS.Matrix(b.size);
        var xnew;
        var N = this.size[0];
        var i,j;
        for (i = N-1; i>=0; i--) {
            xnew = b.array[i]
            for (j = N-1; j>i; j--) {
                xnew -= this.array[N*i + j] * x.array[j];
            }
            x.array[i] = xnew/this.array[N*i + i];
        }
        return x;
    }

    /* A solver for lower triangular matrices, also known as a forward-solve.
     *
     * The Matrix is not checked to be lower triangular, so no error will be
     * thrown if a non-zero element is below the diagonal. This makes it
     * possible to use on an LU decomposition that's stored in a single matrix.
     *
     * Because it's designed to be used for LU decomposion, it is assumed that
     * the diagonal elements are all one.
     */
    this.Matrix.prototype.ltSolve = function (b) {
        if (this.size[0] != this.size[1])
            throw new Error('Matrix must be square');
        if (this.size[1] != b.size[0]) 
            throw new Error('Number of rows in the matrices must agree');
        if (b.size[1] != 1)
            throw new Error('Upper triangular solve is only implemented for vectors in this version');

        var x = new THIS.Matrix(b.size);
        var xnew;
        var N = this.size[0];
        var i,j;
        for (i = 0; i<N; i++) {
            xnew = b.array[i]
            for (j = 0; j<i; j++) {
                xnew -= this.array[N*i + j] * x.array[j];
            }
            x.array[i] = xnew;
        }
        return x;
    }

};

nAn_algebra_module.apply(module.exports);
