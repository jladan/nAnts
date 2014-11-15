/* nAnjs plotting assistance
 *
 * usage: nAnjs_plot_module.apply(namespace, defaultPlotArea)
 */
var nAnjs_plot_module = function(plotArea) {
    
    THIS = this;

    var this.figure = plotArea || "";

    /* Plot the solution of a [Stochastic] DE against time
     */
    var this.plot_trail = function (sol,index) {
        t = sol[0];
        N = sol[2];
        var k = index || 0;
        x = sol[1].subarray(k*N, (k+1)*N);
        d = []; 
        for (i = 0; i < N; i++) {
            d[i] = [t[i], x1[i]];
        }
        $.plot("#"+THIS.figure, [d]);
    }

    /* Plot the phase space of a [Stochastic] DE
     */
    var this.plot_phase = function (sol, dimensions) {
        t = sol[0];
        N = t.length;
        dim = dimensions || [0,1];
        x = sol[1].subarray(dim[0]*N,N);
        y = sol[1].subarray(dim[1]*N,2*N);
        d = [];
        for (i=0; i<N; i++) {
            d[i] = [ x[i],y[i] ];
        }
        $.plot("#"+THIS.figure, [d]);
    }
};
