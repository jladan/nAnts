/* nAnjs stochastic simulation module
 *
 * usage: nAn_stochastics_module.apply(namespace);
 */
var nAn_stochastics_module = function() {

    var THIS=this;

    /* Euler-Maruyama method
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
    this.euler = function (A, D, initial, dt, t_final, parameters) {
        var d = initial.length;
        var N = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);
        var n = 4; // the most random number

        // initial conditions
        var y_cur = initial.slice();
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        // the grunt-work!
        for (i = 0; i < N-1; i++) {
            var A_cur = A(y_cur, t[i], parameters)
            var D_cur = D(y_cur, t[i], parameters)
            t[i+1] = (i+1) * dt;
            n = THIS.gaussian();
            for (j = 0; j < d; j++) 
                result[i + 1 + j * N] = y_cur[j] = 
                    y_cur[j] + dt * A_cur[j] + n*Math.sqrt(D_cur[j]*dt);
        }
        return [t, result, N];
    };

    this.box_muller = function() {
        var v1, v2, s, x;
        do {
            var u1 = Math.random();
            var u2 = Math.random();
            v1 = 2*u1-1;
            v2 = 2*u2-1;
            s = v1*v1 +v2*v2;
        } while (s>1);

        x = Math.sqrt( -2*Math.log(s)/s)*v1;
        return x;
    };

    this.gaussian = this.box_muller;

};
