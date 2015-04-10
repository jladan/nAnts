/** nAnts stochastic simulation module
 */

module stochastics {

    export class Solution {
        t: Float32Array | Float64Array;
        result: Float32Array | Float64Array;
        N: number;

        constructor(t, result, n) {
            this.t = t;
            this.N = n;
            this.result = result;
        }

        // Helper functions
        getDimension(d: number): Float32Array | Float64Array {
            return this.result.subarray(d * this.N,(d + 1) * this.N);
        }

        getTrail(d: number) {
            var x = this.getDimension(d);
            var i: number;
            var result: Array<[number,number]> = new Array();
            for (i = 0; i < this.N; i++)
                result.push([this.t[i], x[i]]);
            return result;
        }

        getPhase(d1: number, d2: number) {
            var x = this.getDimension(d1);
            var y = this.getDimension(d2);
            var i: number;
            var result: Array<[number,number]> = new Array();
            for (i = 0; i < this.N; i++)
                result.push([x[i], y[i]]);
            return result;
        }

    }

    /** Euler-Maruyama method
     *
     * Numerically simulates the Langevin equation,
     *
     *      dy/dt = A(y,t) + D(y,t) * noise(t)
     *
     * For Gaussian white noise. The equation is actually interpreted in
     * the Ito sense.
     *
     * Arguments:
     * A - function of (y,t,[c]) provides the non-stochastic rates
     * D - function of (y,t,[c]) provides the stochastic rates
     * parameters - array of parameters to be sent to the functions A,D
     * the rest should be self-explanatory
     */
    export function euler(A: (x: number[], t: number, p: number[]) => number[],
                          D: (x: number[], t: number, p: number[]) => number[],
                          initial: number[], dt: number, t_final: number,
                          pA: number[], pD: number[]): Solution {
        var d: number = initial.length;
        var N: number = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);
        var n: number; // the most random number
        var sdt: number = Math.sqrt(dt);

        // initial conditions
        var i: number, j: number;
        var y_cur: number[] = initial.slice();
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        // the grunt-work!
        for (i = 0; i < N - 1; i++) {
            var A_cur = A(y_cur, t[i], pA)
            var D_cur = D(y_cur, t[i], pD)
            t[i + 1] = (i + 1) * dt;
            n = gaussian();
            for (j = 0; j < d; j++)
                result[i + 1 + j * N] = y_cur[j] =
                    y_cur[j] + dt * A_cur[j] +
                    n * D_cur[j] * sdt;
        }
        return new Solution(t, result, N);
    }

    /** Milstein method
     *
     * Numerically simulates the Langevin equation,
     *
     *      dy/dt = A(y,t) + D(y,t) * noise(t)
     *
     * For Gaussian white noise. The equation is actually interpreted in
     * the Ito sense.
     *
     * Arguments:
     * A - function of (y,t,[c]) provides the non-stochastic rates
     * D - function of (y,t,[c]) provides the stochastic rates
     * Dy - derivative of D in y
     * parameters - array of parameters to be sent to the functions A,D
     * the rest should be self-explanatory
     */
    export function milstein(A: (x: number[], t: number, p: number[]) => number[],
                             D: (x: number[], t: number, p: number[]) => number[],
                             Dy: (x: number[], t: number, p: number[]) => number[],
                             initial: number[], dt: number, t_final: number,
                             pA: number[], pD: number[]): Solution {
        var d: number = initial.length;
        var N: number = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);
        var sdt: number = Math.sqrt(dt);

        // initial conditions
        var i: number, j: number, n: number[];
        var y_cur: number[] = initial.slice();
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        // the grunt-work!
        for (i = 0; i < N - 1; i++) {
            var A_cur = A(y_cur, t[i], pA)
            var D_cur = D(y_cur, t[i], pD)
            var Dy_cur = Dy(y_cur, t[i], pD)
            t[i + 1] = (i + 1) * dt;
            n = boxMuller2();
            for (j = 0; j < d; j++)
                result[i + 1 + j * N] = y_cur[j] =
                    y_cur[j] + dt * A_cur[j] + n[0] * D_cur[j] * sdt
                    - dt / 2 * D_cur[j] * Dy_cur[j] * (1 - n[1] * n[1]);
        }
        return new Solution(t, result, N);
    }

    /** Coloured Noise method
     *
     * Numerically simulates the Langevin equation,
     *
     *      dy/dt = A(y,t) + D(y,t) * noise(t)
     *
     * where the noise term is an Ornstein-Uhlenbeck process,
     * with autocorrelation:
     *
     *      <F(t)F(t-tau)> = sigma^2 exp(-|tau|/tau_c) .
     *
     * tau_c being the correlation time.
     *
     * Because the SDE is differentiable with coloured noise, the
     * Heun method is used to advance each time-step.
     *
     * Arguments:
     * A - function of (y,t,[c]) provides the non-stochastic rates
     * D - function of (y,t,[c]) provides the stochastic rates
     * sigma - standard deviation of gaussian noise
     * tau - correlation time of the noise
     * parameters - array of parameters to be sent to the functions A,D
     * the rest should be self-explanatory
     */
    export function colour(A: (x: number[], t: number, p: number[]) => number[],
                           D: (x: number[], t: number, p: number[]) => number[],
                           sigma: number, tau: number,
                           initial: number[], dt: number, t_final: number,
                           pA: number[], pD: number[]): Solution {
        var d: number = initial.length;
        var N: number = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var noise = new Float32Array(N);
        var t = new Float32Array(N);
        var n: number = 4; // the most random number

        // coefficients to advance noise
        var rho: number = Math.exp(-dt / tau);
        var rhoc: number = sigma * Math.sqrt(1 - rho * rho);

        // initial conditions
        var i: number, j: number;
        var y_cur: number[] = initial.slice();
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        var k1 = new Array(d), k2 = new Array(d);
        var y_next = y_cur.slice();
        for (i = 0; i < N - 1; i++) {
            // advance the noise and time
            n = boxMuller();
            t[i + 1] = (i + 1) * dt;
            noise[i + 1] = noise[i] * rho + n * rhoc;
            // use heun's method to advance the system
            var A_cur = A(y_cur, t[i], pA)
            var D_cur = D(y_cur, t[i], pD)
            for (j = 0; j < d; j++) {
                k1[j] = A_cur[j] + D_cur[j] * noise[i];
                y_next[j] = y_cur[j] + dt * k1[j];
            }
            var A_next = A(y_next, t[i], pA)
            var D_next = D(y_next, t[i], pD)
            for (j = 0; j < d; j++) {
                k2[j] = A_next[j] + D_next[j] * noise[i + 1];
                result[i + 1 + j * N] = y_cur[j] =
                y_cur[j] + dt / 2 * (k1[j] + k2[j]);
            }
        }
        return new Solution(t, result, N);
    }
    

    /** The Box Muller transform 
     */
    export function boxMuller() : number {
        var v1: number, v2: number, s: number, x: number;
        do {
            var u1 = Math.random();
            var u2 = Math.random();
            v1 = 2*u1-1;
            v2 = 2*u2-1;
            s = v1*v1 +v2*v2;
        } while (s>1);

        x = Math.sqrt( -2*Math.log(s)/s)*v1;
        return x;
    }
    
    /** Box Muller function that returns both Gaussians
     */
    export function boxMuller2() : number[] {
        var v1, v2, s, x, y;
        do {
            var u1 = Math.random();
            var u2 = Math.random();
            v1 = 2*u1-1;
            v2 = 2*u2-1;
            s = v1*v1 +v2*v2;
        } while (s>1);

        x = Math.sqrt( -2*Math.log(s)/s)*v1;
        y = Math.sqrt( -2*Math.log(s)/s)*v2;
        return [x,y];
    }
    
    export var gaussian = boxMuller;

};
