# Introduction

`nAnts` is a 100% client-side numerical/computational math library. Written for doing teaching demos in-browser, the initial focus is on dynamics (my particular specialty).

Our full goal is to perform accurate and efficient mathematical simulations in the browser, without requiring any additional libraries. This is not a large-scale numerical analysis library, so don't expect to use it for large, high-dimensional problems.

*This is a rewrite of nAnjs using typescript. Hooray for static checking!*

# Building/testing

The modules can be built using the `tsc` command (no arguments needed). The `.js` files are left in `build/`. Testing is done with `mocha`, but the test suites must be built first. This is automated with `npm test`.

# Features

Performance is attained by using flat arrays for all multidimensional matrix manipulation. Algorithms are designed for accuracy/stability first, then speed. Often, multiple algorithms will be offered for the same task, as they have different advantages and uses for teaching.

The various tools are split into modules based on problem type...

## ODE module
Numerical solvers for ODE's of the form *x*'(t)=*F*(*x*,t). Methods available include

* Improved Forward Euler (aka. Heun's Method or 2-step Runge-Kutta).
* Adams-Bashford (2-step).
* Leap-frog (central difference time-stepping).

## Stochastics module
Numerical solvers for Stochastic differential equations of the form d*x*(t)=*A*(*X*,t)dt + B(*X*,t) n(t)dt. Where n(t) is some kind of noise. Methods available include

* Euler-Maruyama (Gaussian white noise)
* Milstein (Gaussian white noise)
* Heun's method with coloured (red) noise (generated via an Ornstein-Uhlenbeck process)

This module also includes a Gaussian random number generator.

## Matrix Algebra module
A module for real-valued matrix algebra. It will eventually contain functions to solve linear systems and find eigenvalues.
