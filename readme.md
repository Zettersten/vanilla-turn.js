# Vanilla Turn.js 📚

A modern, vanilla JavaScript library for creating stunning page-turn effects in web applications. This library is a complete rewrite of the popular Turn.js, eliminating jQuery dependencies and modernizing the codebase for today's web development practices.

## Features ✨

- **Zero Dependencies**: Pure vanilla JavaScript implementation
- **Modern Architecture**: Built with ES Modules for tree-shaking and optimal bundling
- **Multiple Build Formats**: ES Modules and UMD builds available
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Touch Enabled**: Smooth touch interactions for mobile devices
- **Customizable**: Extensive options for animations and behaviors

## Installation 📦

```bash
npm install vanilla-turn
```

## Usage 🚀

### ES Modules
```javascript
import { Turn } from 'vanilla-turn';

// Initialize with element ID
const magazine = Turn('#magazine', {
    display: 'double',
    acceleration: true,
    gradients: true
});

// Or with DOM element
const element = document.getElementById('magazine');
const magazineWithElement = Turn(element, {
    display: 'double',
    acceleration: true,
    gradients: true
});
```

### CommonJS
```javascript
const { Turn } = require('vanilla-turn');

const magazine = Turn('#magazine', {
    display: 'double',
    acceleration: true,
    gradients: true
});
```

### Browser
```html
<script src="dist/turn.umd.js"></script>
<script>
    const magazine = Turn('#magazine', {
        display: 'double',
        acceleration: true,
        gradients: true
    });
</script>
```

## Configuration Options 🛠️

### Basic Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `display` | `string` | `'single'` | Display mode ('single' or 'double') |
| `acceleration` | `boolean` | `true` | Enable hardware acceleration |
| `gradients` | `boolean` | `true` | Show page turn gradients |
| `elevation` | `number` | `50` | Page elevation angle during turn |
| `duration` | `number` | `600` | Turn animation duration in ms |
| `direction` | `string` | `'ltr'` | Reading direction ('ltr' or 'rtl') |
| `autoCenter` | `boolean` | `false` | Auto-center pages in view |
| `width` | `number` | `null` | Fixed width for pages |
| `height` | `number` | `null` | Fixed height for pages |

### Advanced Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `responsive` | `boolean` | `true` | Enable responsive resizing |
| `animatedAutoCenter` | `boolean` | `false` | Animate auto-centering |
| `touchEnabled` | `boolean` | `true` | Enable touch interactions |
| `mouseEnabled` | `boolean` | `true` | Enable mouse interactions |
| `keyboardEnabled` | `boolean` | `true` | Enable keyboard navigation |

## Events 📡

```javascript
Turn('#magazine', {
    when: {
        // Before page turn starts
        turning: function(event, page, view) {
            console.log(`Turning to page ${page}`);
            event.preventDefault(); // Prevent turn if needed
        },

        // After page turn completes
        turned: function(event, page, view) {
            console.log(`Now on page ${page}`);
        },

        // Turn animation starts
        start: function(event, pageObject) {
            console.log('Turn animation started');
        },

        // Turn animation ends
        end: function(event, pageObject) {
            console.log('Turn animation completed');
        },

        // Missing pages
        missing: function(event, pages) {
            console.log('Missing pages:', pages);
        }
    }
});
```

## Methods 🔧

```javascript
const magazine = Turn('#magazine', options);

// Navigation
magazine.next();           // Turn to next page
magazine.previous();       // Turn to previous page
magazine.turn(pageNumber); // Turn to specific page
magazine.page();          // Get current page number

// State
magazine.size();          // Get total pages
magazine.view();          // Get current view pages
magazine.currentView();   // Get current view details

// Display
magazine.display(mode);   // Change display mode
magazine.zoom(factor);    // Set zoom level
magazine.resize();        // Recalculate dimensions

// Control
magazine.disable(mode);   // Disable interactions
magazine.enable(mode);    // Enable interactions
magazine.destroy();       // Clean up and remove
```

## Examples 📖

### Basic Magazine
```html
<div id="magazine">
    <div class="page">
        <h1>Page 1</h1>
        <p>Your content here</p>
    </div>
    <div class="page">
        <h1>Page 2</h1>
        <p>More content</p>
    </div>
    <div class="page">
        <h1>Page 3</h1>
        <p>Final content</p>
    </div>
</div>

<script type="module">
    import { Turn } from 'vanilla-turn';
    
    const magazine = Turn('#magazine', {
        display: 'double',
        acceleration: true,
        gradients: true,
        elevation: 50,
        when: {
            turned: (e, page) => console.log(`Page ${page}`)
        }
    });
</script>
```

### With Navigation Controls
```html
<div id="magazine">
    <!-- Magazine pages here -->
</div>

<div class="controls">
    <button onclick="magazine.previous()">Previous</button>
    <button onclick="magazine.next()">Next</button>
    <select onchange="magazine.turn(this.value)">
        <option value="1">Page 1</option>
        <option value="2">Page 2</option>
        <option value="3">Page 3</option>
    </select>
</div>

<script type="module">
    import { Turn } from 'vanilla-turn';
    
    const magazine = Turn('#magazine', {
        display: 'double',
        acceleration: true,
        gradients: true
    });

    // Make magazine accessible globally for controls
    window.magazine = magazine;
</script>
```

### Responsive Layout
```javascript
Turn('#magazine', {
    responsive: true,
    autoCenter: true,
    when: {
        turned: function(e, page) {
            console.log('Current page:', page);
        },
        resize: function(e, size) {
            console.log('New size:', size);
        }
    }
});
```

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (13+)
- Chrome for Android
- Samsung Internet

## Development 🛠️

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build demo version
npm run build:demo

# Run tests (if available)
npm test
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add/update tests for new features
- Update documentation for changes
- Ensure all tests pass before submitting PR
- Keep PR scope focused and specific

## Performance Tips 💨

- Use `acceleration: true` for smoother animations
- Preload images for better performance
- Optimize page content size
- Use appropriate image formats and sizes
- Consider lazy loading for large magazines

## License 📄

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Original Turn.js by Emmanuel Garcia
- All contributors and maintainers
- The open source community

Made with ❤️ by Erik Zettersten