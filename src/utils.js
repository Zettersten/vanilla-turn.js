/**
 * @fileoverview Core utility functions for page flip calculations and transformations
 * @version 1.0.0
 */

import { PI } from './constants.js';

/**
 * Creates a 2D point object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} Point object with x and y coordinates
 */
export const point2D = (x, y) => ({ x, y });

/**
 * Calculates a point on a bezier curve
 * @param {Object} p1 - First control point
 * @param {Object} p2 - Second control point
 * @param {Object} p3 - Third control point
 * @param {Object} p4 - Fourth control point
 * @param {number} t - Time value between 0 and 1
 * @returns {Object} Point on the bezier curve
 */
export const bezier = (p1, p2, p3, p4, t) => {
    const mum1 = 1 - t;
    const mum13 = mum1 * mum1 * mum1;
    const mu3 = t * t * t;

    return point2D(
        Math.round(mum13 * p1.x + 3 * t * mum1 * mum1 * p2.x + 3 * t * t * mum1 * p3.x + mu3 * p4.x),
        Math.round(mum13 * p1.y + 3 * t * mum1 * mum1 * p2.y + 3 * t * t * mum1 * p3.y + mu3 * p4.y)
    );
};

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const rad = (degrees) => degrees / 180 * PI;

/**
 * Converts radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export const deg = (radians) => radians / PI * 180;

/**
 * Generates a CSS transform translate value
 * @param {number} x - X translation
 * @param {number} y - Y translation
 * @param {boolean} use3d - Whether to use 3D transforms
 * @returns {string} CSS transform value
 */
export const translate = (x, y, use3d) => {
    return (use3d)
        ? ` translate3d(${x}px, ${y}px, 0px) `
        : ` translate(${x}px, ${y}px) `;
};

/**
 * Generates a CSS transform rotate value
 * @param {number} degrees - Rotation angle in degrees
 * @returns {string} CSS transform value
 */
export const rotate = (degrees) => ` rotate(${degrees}deg) `;

/**
 * Checks if a property exists on an object
 * @param {string} property - Property name to check
 * @param {Object} object - Object to check against
 * @returns {boolean} Whether the property exists
 */
export const has = (property, object) => {
    return Object.prototype.hasOwnProperty.call(object, property);
};

/**
 * Clamps a number between a minimum and maximum value
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export const lerp = (start, end, t) => {
    return start * (1 - t) + end * t;
};

/**
 * Calculates the distance between two points
 * @param {Object} p1 - First point
 * @param {Object} p2 - Second point
 * @returns {number} Distance between points
 */
export const distance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Formats a CSS transform string with multiple transformations
 * @param {Object} transforms - Object containing transform values
 * @returns {string} Combined CSS transform string
 */
export const formatTransform = (transforms) => {
    return Object.entries(transforms)
        .map(([key, value]) => `${key}(${value})`)
        .join(' ');
};

/**
 * Method dispatcher for handling different types of method calls
 * @param {Object} context - The context to bind methods to
 * @param {Object} methods - Object containing available methods
 * @param {Array} args - Arguments array
 * @returns {*} Result of the method call
 * @throws {Error} If invalid method name provided
 */
export const methodDispatcher = (context, methods, args) => {
    const [command, ...rest] = args;

    // Case 1: No command or object config - call init
    if (!command || typeof command === 'object') {
        if (typeof methods.init !== 'function') {
            throw new Error('No init method defined');
        }
        return methods.init.apply(context, args);
    }

    // Case 2: Valid method call
    const method = methods[command];
    if (method && typeof method === 'function' && !command.startsWith('_')) {
        return method.apply(context, rest);
    }

    // Case 3: Invalid method
    throw new Error(`${command} is an invalid method name`);
};

/**
 * Creates a dispatchable interface for a set of methods
 * @param {Object} methods - Object containing methods to make dispatchable
 * @returns {Function} Dispatcher function
 */
export const createDispatcher = (methods) => {
    return function (...args) {
        return methodDispatcher(this, methods, args);
    };
};