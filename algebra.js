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

    /* Matrix object 
     * For now, only 2D matrices are supported 
     * (vectors ar basically supported when one size dimension is zero)
    */
    this.Matrix = function(size) {
        this.size = size;
        this.array = new Array(size[0]*size[1]);
    }

    this.Matrix.prototype.add(m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        result = new this.Matrix(this.size)
        for (i=0; i<(size[0]+size[1]; i++) {
            result.array[i] = this.array[i] + m.array[i]
        }
        return this;
    }
    
    this.Matrix.prototype.subtract(m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        result = new this.Matrix(this.size)
        for (i=0; i<(size[0]+size[1]; i++) {
            result.array[i] = this.array[i] - m.array[i]
        }
        return this;
    }

    /* Multiply the matrix on the *right* by m */
    // TODO: profile this code
    this.Matrix.prototype.multiply(m) {
        if (this.size[1] != m.size[0]) 
            throw Error("The matrix dimensions don't agree for multiplication");
        result = new this.Matrix([this.size[0], m.size[1]);
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

    this.Matrix.prototype.transpose(m) {
        result = new this.Matrix([this.size[1], this.size[0]]);
        for (i=0; i<this.size[0]; i++) {
            for (j=0; j<this.size[1]; j++) {
                result.array[j+result.size[0]*i] = this.array[i+this.size[0]*j];
            }
        }
        return result;

    }

    this.Matrix.prototype.iAdd(m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        for (i=0; i<(size[0]+size[1]; i++) {
            this.array[i] += m.array[i]
        }
        return this;
    }

    this.Matrix.prototype.iSubtract(m) {
        if (this.size[0] != m.size[0] || this.size[1] != m.size[1])
            throw Error('Matrix dimensions ('+this.size+', '+m.size+
                        ') must agree');
        for (i=0; i<(size[0]+size[1]; i++) {
            this.array[i] -= m.array[i]
        }
        return this;
    }

    this.Matrix.prototype.multiply()

};
