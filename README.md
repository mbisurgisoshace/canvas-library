# Canvas Library

This library will be responsible of wrapping a set of features that are useful for developing an app with features similar to Miro, Figma, DrawIO, etc.

The library will be split into sub modules, each responsible to solve a set of features. These modules and sub modules are:

- Canvas Library Core
- Dragging & Resizing
- UI Base Components

## Canvas Library CORE

This is the core of the library. It will be responsible for rendering a canvas, which could be implemented on different ways, and providing all basic features a canvas should provide, like zooming, panning and rendering elements within it. When using it also, it is required to define what internal implementation of the canvas it should be use (with divs, with Canvas API, etc).
