# Ye Tao — Academic Homepage

Source code for [davytao.me](https://davytao.me), the academic homepage of Ye Tao. The site is a responsive, single-page research profile built with Jekyll and deployed through GitHub Pages.

## Features

- Responsive profile, news, publications, and honors sections
- Data-driven publication cards with teaser media, links, and expandable TL;DR summaries
- Light and dark themes with a persistent user preference
- Open Graph, Twitter Card, and Schema.org metadata
- Custom favicon set, sitemap, feed, and canonical URLs

## Project structure

| Path | Purpose |
| --- | --- |
| `_pages/about.md` | Homepage sections and news content |
| `_includes/home-profile.html` | Profile introduction and academic links |
| `_data/publications.yml` | Publication metadata, links, and TL;DR text |
| `_data/navigation.yml` | Header navigation |
| `_includes/publication-card.html` | Publication card markup |
| `_sass/_home.scss` | Homepage layout and typography |
| `_sass/_publications.scss` | Publication card styles |
| `_sass/_dark-mode.scss` | Dark-theme overrides and transitions |
| `_includes/seo.html` | Social sharing and structured metadata |
| `assets/js/main.js` | Responsive navigation and TL;DR interactions |
| `images/publications/` | Publication teaser images and videos |
| `files/` | Public CV files |

## Local development

Ruby and Bundler are required. Install the dependencies once:

```bash
bundle install
```

Start the development server:

```bash
bundle exec jekyll serve --config _config.yml,_config.dev.yml --livereload
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000). Jekyll rebuilds content and styles automatically. Restart the server after changing `_config.yml`.

## Common updates

- Update biography and profile links in `_includes/home-profile.html`.
- Update news and honors in `_pages/about.md`.
- Add or edit papers in `_data/publications.yml`; publication teasers should preferably use a 16:9 canvas.
- Replace `files/Ye_Tao_Academic_CV.pdf` when publishing a new CV.
- Update global metadata, social profiles, and site identity in `_config.yml`.

Before committing, run:

```bash
bundle exec jekyll build
git diff --check
```

The generated `_site/` directory is intentionally ignored.

## Deployment

The production site is published from the `master` branch by GitHub Pages. The custom domain is configured through `CNAME`; DNS and HTTPS settings are managed separately in Cloudflare.

## Attribution

This site began as a fork of [Academic Pages](https://github.com/academicpages/academicpages.github.io), which is based on the [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) Jekyll theme. It has since been substantially redesigned and simplified for this homepage. See [LICENSE](LICENSE) for licensing information.
