# CLAUDE.md

This file provides guidance for AI assistants working with this codebase.

## Project Overview

This is the personal website for Garrett MacDonald, hosted on GitHub Pages at `garrett-macdonald.com`. The site focuses on financial analysis and quantitative finance tools, featuring a Black-Scholes options pricing calculator.

## Tech Stack

- **Static Site**: Pure HTML, CSS, and JavaScript (no build system or framework)
- **Hosting**: GitHub Pages (repository: `garrettmacdonald.github.io`)
- **Fonts**: Google Fonts (Inter)
- **External Libraries**: math.js (loaded via CDN for mathematical calculations)

## Directory Structure

```
/
├── index.html              # Homepage with About, Projects, and Contact sections
├── CNAME                   # Custom domain configuration (garrett-macdonald.com)
├── README.md               # Repository readme
├── blog/
│   └── index.html          # Blog listing page
├── calculator/
│   └── index.html          # Black-Scholes option pricing calculator (self-contained)
├── components/
│   └── header.js           # Shared navigation header component
└── styles/
    └── modern.css          # Global stylesheet with CSS custom properties
```

## Key Components

### Header (`components/header.js`)
A JavaScript component that dynamically creates the site header and navigation. It:
- Defines navigation items in a `navItems` array
- Sets the active class based on current URL path
- Is loaded via `<script>` tag at the end of page body

### Stylesheet (`styles/modern.css`)
Global CSS using custom properties (CSS variables) for theming:
- Primary colors, accent colors, and shadows defined in `:root`
- Automatic dark mode support via `prefers-color-scheme: dark`
- Responsive breakpoints at 768px and 480px
- Styles for cards, blog posts, calculator inputs, and navigation

### Calculator (`calculator/index.html`)
A self-contained Black-Scholes options calculator that includes:
- Its own inline styles (does not use `modern.css`)
- Black-Scholes pricing formula implementation
- Implied volatility calculation using Newton-Raphson method
- Bi-directional updates (change volatility → update prices, or change price → update IV)

## Development Conventions

### HTML Pages
- All pages include the standard HTML5 doctype and viewport meta tag
- Pages using the shared style link to `/styles/modern.css`
- Pages include the header component via `<script src="/components/header.js"></script>` at body end
- Use absolute paths (starting with `/`) for internal links

### CSS
- Use CSS custom properties for colors and reusable values
- Follow mobile-first responsive design
- Leverage the existing card, section, and navigation patterns

### JavaScript
- No build system - write vanilla JavaScript
- For calculator-specific code, keep it inline in the page
- Shared components go in `/components/`

## Adding New Pages

1. Create a new directory (e.g., `/new-page/`)
2. Add an `index.html` file
3. Include the standard head elements:
   ```html
   <link rel="stylesheet" href="/styles/modern.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```
4. Include the header at body end: `<script src="/components/header.js"></script>`
5. Update `navItems` in `header.js` if the page should appear in navigation

## Deployment

- **Automatic**: Push to `main` branch triggers GitHub Pages deployment
- **Custom Domain**: Configured via `CNAME` file (garrett-macdonald.com)
- No build step required - files are served directly

## Testing Locally

Since this is a static site with absolute paths:
```bash
# Python 3
python -m http.server 8000

# Or use any static file server
npx serve
```

Then visit `http://localhost:8000`

## Important Notes

- The calculator page has its own inline styles that differ from the global stylesheet
- Blog post links currently point to non-existent pages (placeholder content)
- Social links in the footer contain placeholder URLs that should be updated
- The site supports automatic dark mode via CSS media query
