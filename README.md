# Starter Page

A personal start page designed to replace the default browser new tab. It combines a fast, tag-aware search with a glassmorphism inspired layout so you can jump to work links instantly.

## Features
- Instant filtering across names, descriptions, and `#tags` with highlight feedback
- Keyboard support: press <kbd>Enter</kbd> to open the first visible result
- Category and subcategory grouping to mirror the way you think about links
- JSON-less setup for local use (thanks to the inline `favorites.js` data)
- Glassy monochrome UI with neon accents tailored for a “wow” start-page experience

## Getting Started
1. Clone or download this repository.
2. Open `index.html` directly in your browser (no build step required).
3. Copy `favorites.template.js` to `favorites.js` (this file is ignored by git) and customise it with your bookmarks:

```bash
cp favorites.template.js favorites.js
```

### Running a local server (optional)
While the page works from `file://`, running a lightweight server allows future enhancements that might rely on fetch requests. From the project root:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

> `favorites.js` is listed in `.gitignore`, so your personal links stay local by default. Commit only the template or generated files you intend to share.

## Data Structure
`favorites.js` exports `window.STARTER_FAVORITES`, an array of categories. Each category may contain:

- `items`: optional array of direct links under the category
- `groups`: optional subcategories, each with its own `items`

Every link object follows:

```js
{
  name: 'Link Name',
  url: 'https://example.com',
  description: 'Short summary',
  tags: ['tag1', 'tag2']
}
```

Refer to `favorites.template.js` for a clean template when generating new data from your Chrome/Edge exports.

## Customising the Look & Feel
- Update CSS variables in `style.css` to tweak the theme (colors, blur, transitions).
- Adjust the hero copy in `index.html` to match your daily workflow.
- Extend `app.js` if you need extra keyboard shortcuts or integrations.

## Collaboration
Pull requests and suggestions are welcome. To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-idea`.
3. Commit clear, scoped changes.
4. Open a PR describing the motivation and testing performed.

If you plan to make large structural changes (e.g., different data formats or build tooling), open an issue first so we can align on direction.

## License
MIT License
