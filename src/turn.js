import { point2D, bezier, has, translate, rotate } from './utils.js';
import { has3DSupport, getVendorPrefix } from './vendors.js';
import { createColorStop, applyLinearGradient } from './gradients.js';
import { 
    PI, A90, isTouch, events, corners, displays, 
    turnOptions, flipOptions, pagesInDOM, pagePosition, divAtt 
} from './constants.js';

/**
 * Turn.js - Page turning functionality
 */
export class Turn {
    constructor(element, options = {}) {
        this.element = element;
        this.data = {
            pageObjs: {},
            pages: {},
            pageWrap: {},
            pagePlace: {},
            pageMv: [],
            totalPages: 0,
            done: false
        };
        
        // Initialize with merged options
        this.init(options);
    }

    init(opts) {
        // Merge default options with provided options
        this.options = { ...turnOptions, ...opts };
        
        // Set dimensions
        this.options.width = this.options.width || this.element.width();
        this.options.height = this.options.height || this.element.height();

        // Setup event handlers if provided
        if (this.options.when) {
            Object.entries(this.options.when).forEach(([event, handler]) => {
                if (has(event, this.options.when)) {
                    this.element.bind(event, handler);
                }
            });
        }

        // Setup element styling
        this.element.css({
            position: 'relative',
            width: this.options.width,
            height: this.options.height
        });

        // Set display mode
        this.setDisplay(this.options.display);

        // Apply hardware acceleration if enabled
        if (has3DSupport() && !isTouch && this.options.acceleration) {
            this.element.transform(translate(0, 0, true));
        }

        // Add pages from children
        const children = this.element.children();
        for (let i = 0; i < children.length; i++) {
            this.addPage(children[i], i + 1);
        }

        // Set initial page
        this.page(this.options.page);

        // Setup event listeners
        this._setupEventListeners();
        
        this.data.done = true;
    }

    _setupEventListeners() {
        // Start event
        this.element.bind(events.start, (e) => {
            for (const page in this.data.pages) {
                if (has(page, this.data.pages) && 
                    this.data.pages[page]._eventStart(e) === false) {
                    return false;
                }
            }
        });

        // Move and end events (document level)
        document.addEventListener(events.move, (e) => {
            for (const page in this.data.pages) {
                if (has(page, this.data.pages)) {
                    this.data.pages[page]._eventMove(e);
                }
            }
        });

        document.addEventListener(events.end, (e) => {
            for (const page in this.data.pages) {
                if (has(page, this.data.pages)) {
                    this.data.pages[page]._eventEnd(e);
                }
            }
        });
    }

    // Core page manipulation methods
    addPage(element, pageNumber) {
        const lastPage = this.data.totalPages + 1;
        let incPages = false;

        if (pageNumber) {
            if (pageNumber === lastPage) {
                pageNumber = lastPage;
                incPages = true;
            } else if (pageNumber > lastPage) {
                throw new Error(`Cannot add page ${pageNumber}, max is ${lastPage}`);
            }
        } else {
            pageNumber = lastPage;
            incPages = true;
        }

        if (pageNumber >= 1 && pageNumber <= lastPage) {
            // Stop animations if needed
            if (this.data.done) {
                this.stop();
            }

            // Move pages if necessary
            if (pageNumber in this.data.pageObjs) {
                this._movePages(pageNumber, 1);
            }

            // Update total pages if needed
            if (incPages) {
                this.data.totalPages = lastPage;
            }

            // Add the new page
            this.data.pageObjs[pageNumber] = element.addClass(`turn-page p${pageNumber}`);
            this._addPage(pageNumber);

            // Update view if needed
            if (this.data.done) {
                this.update();
            }

            this._removeFromDOM();
        }

        return this;
    }

    // ... Additional methods would follow ...
}

/**
 * Flip effect functionality
 */
export class Flip {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...flipOptions, ...options };
        this.data = { f: {} };
        
        this.init();
    }

    init() {
        if (this.options.gradients) {
            this.options.frontGradient = true;
            this.options.backGradient = true;
        }

        this._addPageWrapper();
        return this;
    }

    // ... Flip methods would follow ...
}
