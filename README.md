nAnjs - the _n_umerical _An_alysis Javascript library

# Introduction

nAnjs is a library providing the tools for numerical analysis in the browser 100% clientside. The primary goal is to perform accurate and efficient mathematical simulations in the browser, without requiring any additional libraries. This is not a large-scale numerical analysis library, so don't expect to use it for large, high-dimensional problems.

# Features

Performance is attained by using striped arrays for all multidimensional matrix manipulation. The default is column-major indexing, but striping allows for very fast transposition. For accurate and stable behaviour, the best algorithms are chosen for each function.

The various tools are split into modules based on problem type

## nAn\_ODE\_module
Numerical solvers for ODE's of the form *x*(t)=*F*(*x*,t). Methods available include

* Improved Forward Euler (aka. Heun's Method or 2-step Runge-Kutta).
* Adams-Bashford (2-step).
* Leap-frog (central difference time-stepping).

# History

In fall of 2014, I was asked to make an interactive website to demonstrate dynamical systems. The idea was to provide a playground for people with no past experience with mathematical models or programming, allowing them to change parameters, and immediately see how different models behave.

We decided to do all calculations client-side, because the book-keeking and data management would be much simpler, and if there were many users at the same, the load on the server might be too much.

After a search for existing libraries, no suitable choice was found. None had even rudimentary ODE solvers, and all of the matrix calculations were very basic, and used arrays of arrays, rather than the more performant TypedArrays. Hence, the creation of nAnjs.
