nAnjs - the *n*umerical *An*alysis Javascript library

# Introduction

nAnjs is a library providing the tools for numerical analysis in the browser 100% clientside. The primary goal is to perform accurate and efficient mathematical simulations in the browser, without requiring any additional libraries. This is not a large-scale numerical analysis library, so don't expect to use it for large, high-dimensional problems.

# Features

Performance is attained by using flat arrays for all multidimensional matrix manipulation. Algorithms are chosen by accuracy/stability first, then speed. Often, multiple algorithms will be offered for the same task.

The various tools are split into modules based on problem type

## nAn\_ODE\_module
Numerical solvers for ODE's of the form *x*'(t)=*F*(*x*,t). Methods available include

* Improved Forward Euler (aka. Heun's Method or 2-step Runge-Kutta).
* Adams-Bashford (2-step).
* Leap-frog (central difference time-stepping).

## nAn\_stochastics\_module
Numerical solvers for Stochastic differential equations of the form d*x*(t)=*A*(*X*,t)dt + B(*X*,t) n(t)dt. Where n(t) is some kind of noise. Methods available include

* Euler-Maruyama (Gaussian white noise)
* Milstein (Gaussian white noise)
* Heun's method with coloured noise (generated via an Ornstein-Uhlenbeck process)

This module also includes a Gaussian random number generator.

## nAn\_algebra\_module
A module for real-valued matrix algebra.

# History

In fall of 2014, I was asked to make an interactive website to demonstrate dynamical systems. The idea was to provide a playground for people with no past experience with mathematical models or programming, allowing them to change parameters, and immediately see how different models behave.

We decided to do all calculations client-side, because the book-keeking and data management would be much simpler, and to reduce load on the server.

After a search for existing libraries, no suitable choice was found. None had the desired ODE solvers, and all of the matrix calculations were very basic, using arrays of arrays, rather than the more performant flat arrays. Hence, the creation of nAnjs.
