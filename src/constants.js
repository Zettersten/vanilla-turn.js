/**
 * @fileoverview Core constants for the page flip effect library
 * @version 1.0.0
 */

/**
 * Mathematical constants
 */
export const PI = Math.PI;
export const A90 = PI / 2;

/**
 * Browser capability detection
 */
export const isTouch = 'ontouchstart' in window;

/**
 * Event mappings based on device capability
 */
export const events = {
    start: isTouch ? 'touchstart' : 'mousedown',
    move: isTouch ? 'touchmove' : 'mousemove',
    end: isTouch ? 'touchend' : 'mouseup'
};

/**
 * Corner definitions for page flipping
 * tl * tr
 * *     *
 * bl * br
 */
export const corners = {
    backward: ['bl', 'tl'],
    forward: ['br', 'tr'],
    all: ['tl', 'bl', 'tr', 'br']
};

/**
 * Available display modes
 */
export const displays = ['single', 'double'];

/**
 * Default options for turning pages
 */
export const turnOptions = {
    // First page to display
    page: 1,

    // Enable gradient effects
    gradients: true,

    // Duration of transition in milliseconds
    duration: 600,

    // Enable hardware acceleration
    acceleration: true,

    // Display mode (single/double)
    display: 'double',

    // Event callbacks
    when: null
};

/**
 * Default options for flip effect
 */
export const flipOptions = {
    // Back page folding effect
    folding: null,

    // Active corners for interaction
    corners: 'forward',

    // Size of the active zone for each corner
    cornerSize: 100,

    // Enable gradient effects
    gradients: true,

    // Duration of transition in milliseconds
    duration: 600,

    // Enable hardware acceleration
    acceleration: true
};

/**
 * DOM configuration constants
 */
export const pagesInDOM = 6;

/**
 * Page position configurations
 */
export const pagePosition = {
    0: {
        top: 0,
        left: 0,
        right: 'auto',
        bottom: 'auto'
    },
    1: {
        top: 0,
        right: 0,
        left: 'auto',
        bottom: 'auto'
    }
};

/**
 * Default CSS attributes for layer positioning
 * @param {number} top - Top position
 * @param {number} left - Left position
 * @param {number|string} zIndex - Z-index value
 * @param {string} overf - Overflow property
 * @returns {Object} CSS attributes object
 */
export const divAtt = (top, left, zIndex, overf) => ({
    css: {
        position: 'absolute',
        top,
        left,
        overflow: overf || 'hidden',
        'z-index': zIndex || 'auto'
    }
});

// Freeze all exported objects to prevent modifications
Object.freeze(events);
Object.freeze(corners);
Object.freeze(displays);
Object.freeze(turnOptions);
Object.freeze(flipOptions);
Object.freeze(pagePosition);