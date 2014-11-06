
/* Usage: NumericODE_modeule.apply(namespace) */
var nAn_ode_module = function() {

    /* forward euler solver to test design
     * 
     * The dimension `d` is determined from the `initial` argument
     * derivative is a function(Array x, float t, Array parameters) that
     *              calculates the derivative for the ODE model
     * initial is a d-dimensional array defining the initial condition
     * dt is the time-step
     * t_final is the total time
     * parameters is an array of the parameters for the ODE being solved
     */
    this.forward_euler = function (derivative, initial, dt, t_final, parameters) {
        var d = initial.length;
        var N = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);

        // initial conditions
        var x_cur = initial;
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        // the grunt-work!
        for (i = 0; i < N-1; i++) {
            var x_prime = derivative(x_cur, t[i], parameters)
            t[i+1] = (i+1) * dt;
            for (j = 0; j < d; j++) 
                result[i + 1 + j * N] = x_cur[j] = x_cur[j] + dt * x_prime[j];
        }
        return [t, result, N];
    }

    this.leap_frog = function (derivative, initial, dt, t_final, parameters) {
        var d = initial.length;
        var N = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);

        // initial conditions
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        // Forward Euler for the first time-step
        var x_old = initial.slice();
        var x_cur = x_old.slice();
        var x_prime = derivative(x_old, 0, parameters);
        t[1] = dt;
        for (j = 0; j < d; j++) 
            result[1 + j * N] = x_cur[j] = x_old[j] + dt * x_prime[j];

        // the grunt-work!
        var x_new = x_cur.slice();
        for (i = 1; i < N-1; i++) {
            x_prime = derivative(x_cur, t[i], parameters)
            t[i+1] = (i+1) * dt;
            for (j = 0; j < d; j++)  {
                result[i + 1 + j * N] = x_new[j] = x_old[j] + 2 * dt * x_prime[j];
                x_old[j] = x_cur[j];
                x_cur[j] = x_new[j];
            }
        }
        return [t, result, N];
    }
    
    this.ab2 = function (derivative, initial, dt, t_final, parameters) {
        var d = initial.length;
        var N = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);

        // initial conditions
        for (j = 0; j < d; j++) result[j * N] = initial[j];
        // Forward Euler for the first time-step
        var x_old = initial.slice();
        var x_cur = x_old.slice();
        var x_prime_old = derivative(x_old, 0, parameters);
        t[1] = dt;
        for (j = 0; j < d; j++) 
            result[1 + j * N] = x_cur[j] = x_old[j] + dt * x_prime_old[j];

        // the grunt-work!
        var x_new = x_cur.slice();
        var x_prime_cur = x_prime_old.slice();
        for (i = 1; i < N-1; i++) {
            x_prime_cur = derivative(x_cur, t[i], parameters)
            t[i+1] = (i+1) * dt;
            for (j = 0; j < d; j++) {
                result[i + 1 + j * N] = x_new[j] =
                    x_cur[j] + dt*(3* x_prime_cur[j] - x_prime_old[j])/2;
                x_old[j] = x_cur[j];
                x_cur[j] = x_new[j];
                x_prime_old[j] = x_prime_cur[j];
            }
        }
        return [t, result, N];
    }

    this.heun = function (derivative, initial, dt, t_final, parameters) {
        var d = initial.length;
        var N = Math.floor(t_final / dt);
        var result = new Float32Array(N * d);
        var t = new Float32Array(N);

        // initial conditions
        var x_cur = initial.slice();
        for (j = 0; j < d; j++) result[j * N] = x_cur[j];
        var x_new=x_cur.slice(), x_next=x_cur.slice();
        // the grunt-work!
        for (i = 0; i < N-1; i++) {
            t[i+1] = (i+1) * dt;
            var x_prime_cur = derivative(x_cur, t[i], parameters);

            for (j=0; j<d; j++) 
                x_next[j] = x_cur[j] + dt*x_prime_cur[j];
            var x_prime_next = derivative(x_next, t[i+1], parameters);

            for (j = 0; j < d; j++) {
                result[i + 1 + j * N] = x_new[j] =
                    x_cur[j] + dt * ( x_prime_cur[j] + x_prime_next[j])/2;
                x_cur[j] = x_new[j];
            }
        }
        return [t, result, N];
    }


};
