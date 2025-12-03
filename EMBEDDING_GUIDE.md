# Memory Journal - Embedding Guide

This guide explains how to embed individual components from the Memory Journal app into your main Webflow site.

## Available Embed URLs

All URLs are relative to your site: `https://patricia-lanning.webflow.io`

### Full Pages (with Navigation & Footer)
- **Main Page**: `/memory-journal`
- **Guestbook**: `/memory-journal/guestbook`

### Embeddable Components (without Navigation & Footer)
- **Stories Section Only**: `/memory-journal/stories-embed`
- **Memory Wall Only**: `/memory-journal/memory-wall-embed`
- **Minimal Full Page**: `/memory-journal/embed`

## How to Embed in Webflow

### Option 1: Simple iframe Embed

Add an **HTML Embed** element in Webflow Designer and paste:

#### For Stories Section:
```html
<iframe 
  src="https://patricia-lanning.webflow.io/memory-journal/stories-embed" 
  width="100%" 
  height="1000px" 
  frameborder="0"
  scrolling="no"
  style="border: none; display: block; width: 100%;"
  title="Stories Section"
></iframe>
```

#### For Memory Wall:
```html
<iframe 
  src="https://patricia-lanning.webflow.io/memory-journal/memory-wall-embed" 
  width="100%" 
  height="1200px" 
  frameborder="0"
  scrolling="no"
  style="border: none; display: block; width: 100%;"
  title="Memory Wall"
></iframe>
```

### Option 2: Responsive Container

For better responsive behavior, use this approach:

```html
<style>
  .component-embed {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .component-embed iframe {
    width: 100%;
    border: none;
    display: block;
    min-height: 1000px;
  }
</style>

<div class="component-embed">
  <iframe 
    src="https://patricia-lanning.webflow.io/memory-journal/stories-embed"
    title="Stories Section"
  ></iframe>
</div>
```

### Option 3: Auto-Height iframe

For iframes that adjust to content height:

```html
<iframe 
  src="https://patricia-lanning.webflow.io/memory-journal/stories-embed" 
  width="100%" 
  style="border: none; display: block; min-height: 800px;"
  onload="this.style.height=(this.contentWindow.document.body.scrollHeight)+'px';"
  title="Stories"
></iframe>
```

## Embedding in Webflow Designer - Step by Step

1. **Open your page** in Webflow Designer
2. **Add a Section** where you want the component
3. **Add an HTML Embed** element inside the section
4. **Paste** one of the iframe code snippets above
5. **Adjust height** as needed (change the `height` value in pixels)
6. **Publish** your site

## Customizing the Embed

### Adjust Height
Change the `height` attribute or `min-height` style:
```html
height="1500px"
<!-- or -->
style="min-height: 1500px;"
```

### Remove Scrollbars
Add `scrolling="no"` to the iframe:
```html
<iframe scrolling="no" ...>
```

### Make Background Transparent
The embed pages already have transparent backgrounds by default, but you can ensure it with:
```html
<iframe style="background: transparent;" ...>
```

## Component-Specific Notes

### Stories Section
- Displays up to 8 memories in a grid layout
- Includes featured stories with images
- Auto-updates when new memories are added
- Recommended height: 1000-1500px

### Memory Wall
- Displays all memories in a masonry/grid layout
- Includes "Add Memory" button with form
- Shows like counts and allows liking
- Supports photo/video uploads
- Recommended height: 1200-2000px

### Guestbook
- Available at `/memory-journal/guestbook`
- Full page experience (includes nav/footer)
- For embed version, create: `/memory-journal/guestbook-embed`

## Technical Details

### Base Path
All app routes are prefixed with `/memory-journal` because this is a Webflow Cloud app.

### Styling
The embed pages include:
- Webflow design system CSS variables
- Component-specific styles
- Responsive design
- Font imports

### Data Source
- Memories are stored in Cloudflare D1 database
- Media files stored in Cloudflare R2 bucket
- Guestbook entries stored in Cloudflare KV
- All data persists across deployments

## Troubleshooting

### iframe Not Showing
- Check that the URL is correct and includes `/memory-journal` prefix
- Verify the page is published in Webflow
- Check browser console for errors

### Content Cut Off
- Increase the iframe height value
- Use the auto-height script option
- Check for CSS overflow issues

### Styling Issues
- The embed pages use the same design system as your main site
- Check that fonts are loading properly
- Verify color variables are being applied

## Need More Customization?

If you need a custom embed configuration:
1. Create a new page in `src/pages/` (e.g., `custom-embed.astro`)
2. Import the components you need
3. Add custom styling
4. Deploy and use the new URL

Example:
```astro
---
import { StoriesSection } from '../components/StoriesSection';
import { MemoryWall } from '../components/MemoryWall';
---
<html>
<head>
  <link rel="stylesheet" href="/src/styles/global.css" />
</head>
<body>
  <StoriesSection client:load />
  <MemoryWall client:only="react" />
</body>
</html>
```

## Support

For issues or questions:
- Check the main README.md
- Review DEPLOYMENT_NOTES.md
- Check browser console for errors
- Verify all environment variables are set in Cloudflare
