/* Usage: demo_systems_module.apply(namespace) */
var demo_systems_module = function () {
    /* The Van Der Pol oscillator derivative function
     * 
     * even though there is one parameter, the ODE solvers call this function
     * with an array of parameters
     * explicitly accessing the first element `mu[0]` is significantly faster
     * that implicit casting of `mu`
     * in my tests, there was a time ratio of around 3:5
     */
    this.vdp_ode = function (x, t, mu) {
        return [x[1], mu[0] * (1 - x[0] * x[0]) * x[1] - x[0]];
    };
    
    /* The Harmonic oscillator derivative function with damping 
     * 
     * parameter order is [spring constant, damping]
     * */
    this.harmonic_ode = function (x, t, c) {
        return [x[1], - c[1] * x[1] - c[0]* x[0]];
    };
}
