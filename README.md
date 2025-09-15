# Test Task: Shopify Product Gallery (Swiper), Color Filter, and Metafield Accordion

## What’s included

- `sections/product-gallery-swiper.liquid`: Swiper gallery with responsive settings (slides per view, spacing, pagination, arrows)
- `assets/product-gallery-swiper.js` + `assets/product-gallery-swiper.css`: Initialization and styles
- Color-based image filtering that updates on color selection without page reload
- `sections/product-accordion.liquid` + `assets/product-accordion.js`: Accordion powered by product metafields
- `templates/product.json`: Uses the gallery and accordion on product pages
- `layout/theme.liquid`: Includes Swiper CDN and theme assets

## Requirements covered

- Runs on dev store via Shopify CLI
- Code is ready for GitHub
- Send storefront password with the preview URL

## Setup

1. Prerequisites:
   - Node.js LTS
   - Shopify CLI installed and authenticated
2. Clone this repo and change directory:
   ```bash
   git clone <your_github_repo_url>
   cd test_task
   ```
3. Link and run locally:
   ```bash
   shopify theme dev --store <your-dev-store> --live-reload | cat
   ```
   The command prints a preview URL. If the storefront is password-protected, also share the password.

## Configure the gallery color filter

- Add 3–4 images per color variant to the product.
- Set each image Alt text to include the color name (e.g., "Red", "Blue"). The script matches by lowercase substring of the slide’s `data-color`, derived from the image’s alt.
- Color filtering reacts to:
  - Changing the Color option select/radios
  - `variant:change` events fired by many themes

Tip: Ensure the option name contains "Color" (case-insensitive), e.g., `Color`.

## Configure the accordion metafields

Create product metafields in Settings → Custom data → Products:

- `custom.accordion_titles`: Type = List of Single line text
- `custom.accordion_contents`: Type = List of Multi-line text (or Rich text)
- Optional `custom.accordion_allow_multiple`: Type = Boolean

Usage notes:

- Items are paired by index: Title[0] ↔ Content[0]
- Empty titles or contents are auto-hidden
- If the optional boolean is set, it overrides the section setting for allowing multiple panels open

## Section settings (Swiper)

In the Theme Editor on a product page:

- Adjust slides per view for desktop/tablet/mobile
- Adjust spacing for desktop/tablet/mobile
- Toggle pagination and navigation arrows

## Known assumptions

- Images are tagged to a color using Alt text. You can adapt logic to read a media metafield and map it to `data-color` if preferred.
- The code listens for common theme events/selectors for color changes; adapt selectors if your theme differs significantly.

## Deploy

To preview on your dev store:

```bash
shopify theme dev --store <your-dev-store> --live-reload | cat
```

To upload as a theme draft:

```bash
shopify theme push --store <your-dev-store> --unpublished --json | cat
```

Share the preview URL and storefront password.
