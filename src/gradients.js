/**
 * @fileoverview Gradient generation and manipulation utilities
 * @version 1.0.0
 */

import { point2D } from './utils.js';
import { getVendorPrefix } from './vendors.js';

/**
 * Creates a gradient color stop
 * @param {number} position - Position of the color stop (0-1)
 * @param {string} color - CSS color value
 * @returns {Object} Color stop object
 */
export const createColorStop = (position, color) => ({
    position,
    color
});

/**
 * Formats gradient color stops for webkit browsers
 * @param {Array} colors - Array of color stop objects
 * @returns {string} Formatted color stops
 */
const formatWebkitColorStops = (colors) => {
    return colors
        .map(({ position, color }) => `color-stop(${position}, ${color})`)
        .join(', ');
};

/**
 * Formats gradient color stops for standard browsers
 * @param {Array} colors - Array of color stop objects
 * @returns {string} Formatted color stops
 */
const formatStandardColorStops = (colors) => {
    return colors
        .map(({ position, color }) => `${color} ${position * 100}%`)
        .join(', ');
};

/**
 * Calculates gradient dimensions and positioning
 * @param {Object} obj - DOM element
 * @param {Object} p0 - Start point {x, y}
 * @param {Object} p1 - End point {x, y}
 * @returns {Object} Calculated gradient parameters
 */
const calculateGradientDimensions = (obj, p0, p1) => {
    // Convert percentage positions to pixels
    const startPoint = {
        x: (p0.x / 100) * obj.width(),
        y: (p0.y / 100) * obj.height()
    };

    const endPoint = {
        x: (p1.x / 100) * obj.width(),
        y: (p1.y / 100) * obj.height()
    };

    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.atan2(dy, dx);
    const angle2 = angle - Math.PI / 2;

    const diagonal = Math.abs(obj.width() * Math.sin(angle2)) +
        Math.abs(obj.height() * Math.cos(angle2));
    const gradientDiagonal = Math.sqrt(dx * dx + dy * dy);

    const corner = point2D(
        endPoint.x < startPoint.x ? obj.width() : 0,
        endPoint.y < startPoint.y ? obj.height() : 0
    );

    const slope = Math.tan(angle);
    const inverse = -1 / slope;

    const x = (inverse * corner.x - corner.y - slope * startPoint.x + startPoint.y) /
        (inverse - slope);

    const c = {
        x: x,
        y: inverse * x - inverse * corner.x + corner.y
    };

    return {
        diagonal,
        gradientDiagonal,
        angle,
        segmentA: Math.sqrt(
            Math.pow(c.x - startPoint.x, 2) + Math.pow(c.y - startPoint.y, 2)
        )
    };
};

/**
 * Applies a linear gradient to an element
 * @param {Object} obj - DOM element
 * @param {Object} p0 - Start point {x, y} in percentages
 * @param {Object} p1 - End point {x, y} in percentages
 * @param {Array} colors - Array of color stop objects
 * @returns {void}
 */
export const applyLinearGradient = (obj, p0, p1, colors) => {
    const vendor = getVendorPrefix();

    if (vendor === '-webkit-') {
        // Webkit gradient syntax
        const colorStops = formatWebkitColorStops(colors);
        obj.css({
            'background-image':
                `-webkit-gradient(linear, ${p0.x}% ${p0.y}%, ${p1.x}% ${p1.y}%, ${colorStops})`
        });
    } else {
        // Standard gradient syntax
        const dims = calculateGradientDimensions(obj, p0, p1);
        const colorStops = formatStandardColorStops(colors.map(color => ({
            position: (dims.segmentA + dims.gradientDiagonal * color.position) / dims.diagonal,
            color: color.color
        })));

        obj.css({
            'background-image':
                `${vendor}linear-gradient(${-dims.angle}rad, ${colorStops})`
        });
    }
};

/**
 * Creates a page fold gradient configuration
 * @param {string} direction - Fold direction ('forward' or 'backward')
 * @param {Object} intensity - Gradient intensity configuration
 * @returns {Object} Gradient configuration
 */
export const createFoldGradient = (direction, intensity = { start: 0.4, end: 0.2 }) => {
    const isForward = direction === 'forward';
    const gradientStops = [
        createColorStop(0, `rgba(0, 0, 0, ${intensity.start})`),
        createColorStop(0.5, `rgba(0, 0, 0, ${(intensity.start + intensity.end) / 2})`),
        createColorStop(1, `rgba(0, 0, 0, ${intensity.end})`)
    ];

    return {
        start: point2D(isForward ? 100 : 0, 0),
        end: point2D(isForward ? 0 : 100, 100),
        colors: gradientStops
    };
};

/**
 * Creates a page shadow gradient configuration
 * @param {string} direction - Shadow direction ('forward' or 'backward')
 * @param {number} opacity - Maximum shadow opacity
 * @returns {Object} Gradient configuration
 */
export const createShadowGradient = (direction, opacity = 0.3) => {
    const isForward = direction === 'forward';
    const gradientStops = [
        createColorStop(0, 'rgba(0, 0, 0, 0)'),
        createColorStop(0.5, `rgba(0, 0, 0, ${opacity / 2})`),
        createColorStop(1, `rgba(0, 0, 0, ${opacity})`)
    ];

    return {
        start: point2D(isForward ? 100 : 0, 0),
        end: point2D(isForward ? 0 : 100, 0),
        colors: gradientStops
    };
};