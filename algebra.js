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
        r = new THIS.Matrix(size);
        for (i=0; i<size[0]*size[1]; i++)
            r.array[i] = 0;
        for (i=0; i<Math.min(size[0],size[1]); i++)
            r.array[i+size[0]*i] = 1;
        return r;
    }

    this.Matrix.prototype.add = function (m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        result = new THIS.Matrix(this.size)
        for (i=0; i<size[0]+size[1]; i++) {
            result.array[i] = this.array[i] + m.array[i]
        }
        return this;
    }
    
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
                result.array[i+result.size[0]*j] = 0;
                for (k=0; k<this.size[1]; k++) {
                    result.array[i+result.size[0]*j] +=
                        this.array[i+this.size[0]*k] * m.array[k + m.size[0]*j];
                }
            }
        }
        return result;
    }

    this.Matrix.prototype.transpose = function (m) {
        result = new THIS.Matrix([this.size[1], this.size[0]]);
        for (i=0; i<this.size[0]; i++) {
            for (j=0; j<this.size[1]; j++) {
                result.array[j+result.size[0]*i] = this.array[i+this.size[0]*j];
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

};

nAn_algebra_module.apply(module.exports);
