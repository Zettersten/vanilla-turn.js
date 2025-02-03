/**
 * @fileoverview Browser vendor detection and feature support checking
 * @version 1.0.0
 */

/**
 * Cache for vendor prefix to avoid multiple checks
 * @type {string}
 */
let cachedVendorPrefix = '';

/**
 * Cache for 3D support to avoid multiple checks
 * @type {boolean|null}
 */
let cached3DSupport = null;

/**
 * List of vendor prefixes to check
 * @type {string[]}
 */
const VENDOR_PREFIXES = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

/**
 * Gets the CSS vendor prefix for the current browser
 * @returns {string} Vendor prefix with leading and trailing hyphens
 */
export const getVendorPrefix = () => {
    if (cachedVendorPrefix) {
        return cachedVendorPrefix;
    }

    // Check if the browser needs a prefix
    if ('transform' in document.body.style) {
        cachedVendorPrefix = '';
        return '';
    }

    // Find the appropriate prefix
    for (const prefix of VENDOR_PREFIXES) {
        if (`${prefix}Transform` in document.body.style) {
            cachedVendorPrefix = `-${prefix.toLowerCase()}-`;
            return cachedVendorPrefix;
        }
    }

    return '';
};

/**
 * Checks if the browser supports 3D transforms
 * @returns {boolean} Whether 3D transforms are supported
 */
export const has3DSupport = () => {
    if (cached3DSupport !== null) {
        return cached3DSupport;
    }

    const el = document.createElement('div');
    const transforms = {
        'WebkitTransform': '-webkit-transform',
        'OTransform': '-o-transform',
        'MSTransform': '-ms-transform',
        'MozTransform': '-moz-transform',
        'Transform': 'transform'
    };

    // Add element to the document to test
    document.body.insertBefore(el, null);

    for (const t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = 'translate3d(1px,1px,1px)';
            cached3DSupport = window.getComputedStyle(el).getPropertyValue(transforms[t]) !== undefined;
            break;
        }
    }

    // Clean up
    document.body.removeChild(el);

    return cached3DSupport;
};

/**
 * Checks if CSS animations are supported
 * @returns {boolean} Whether CSS animations are supported
 */
export const hasAnimationSupport = () => {
    const el = document.createElement('div');
    return (
        el.style.animationName !== undefined ||
        el.style.WebkitAnimationName !== undefined ||
        el.style.MozAnimationName !== undefined ||
        el.style.OAnimationName !== undefined ||
        el.style.MsAnimationName !== undefined
    );
};

/**
 * Gets a vendor prefixed style property name
 * @param {string} property - The style property to prefix
 * @returns {string} The prefixed property name
 */
export const getPrefixedProperty = (property) => {
    const prefix = getVendorPrefix().replace(/-/g, '');
    if (!prefix) {
        return property;
    }
    return prefix + property.charAt(0).toUpperCase() + property.slice(1);
};

/**
 * Applies vendor prefixes to a style object
 * @param {Object} styles - Style object to apply prefixes to
 * @returns {Object} New style object with prefixes applied
 */
export const applyVendorPrefixes = (styles) => {
    const prefixedStyles = {};
    const prefix = getVendorPrefix();

    for (const [property, value] of Object.entries(styles)) {
        prefixedStyles[property] = value;
        if (prefix) {
            prefixedStyles[`${prefix}${property}`] = value;
        }
    }

    return prefixedStyles;
};

/**
 * Gets the appropriate transitionEnd event name for the current browser
 * @returns {string} The transition event name
 */
export const getTransitionEndEvent = () => {
    const el = document.createElement('div');
    const transitions = {
        'transition': 'transitionend',
        'OTransition': 'otransitionend',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };

    for (const t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }

    return 'transitionend';
};