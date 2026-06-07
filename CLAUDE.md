# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pch88.com (蓬城交友中心 / 鹏城.com) — a nostalgic memorial website for a campus dating/social platform founded in 1999-2000 at 五邑大学 in Jiangmen, Guangdong. The site served 7 schools with 4000+ members, went offline around 2004-2005, and the domain was reclaimed by the founder's son in 2026.

## Architecture

Single-file static website: `index.html` with embedded CSS and JS. No build system, no framework, no dependencies. All assets live in `assets/`.

## Assets

- `assets/2001.3.8.png` — Wayback Machine full-page screenshot (2001-03-08)
- `assets/2002.4.2.png` — Wayback Machine full-page screenshot (2002-04-02)
- `assets/logo.jpg` — Original site logo (208×80px)
- `assets/logo1.jpg` — Alternate logo variant
- `assets/holiday.gif` — Valentine's Day banner from original site
- `assets/flower.gif`, `assets/friends.gif`, `assets/arrow1.gif` — Original site decorative elements

## Design Constraints

- **PJAX navigation**: Multiple "pages" are actually sections; History API `pushState` for seamless transitions so background audio plays uninterrupted
- **Fixed audio player**: 朴树《那些花儿》at page bottom, survives navigation
- **Emotional core**: Founder 伍柳昌's WeChat Moments post must be prominently featured
- **Screenshots as artifacts**: Wayback Machine screenshots framed with browser chrome, clickable for lightbox full-size view
- **Narrative**: Generational continuation — father's generation built it → domain reclaimed by son in 2026
- **Aesthetic**: Warm nostalgic (aged paper, sepia tones, deep brown text, muted rust accents), modern Chinese typography, not kitschy
- **Mobile responsive**, Intersection Observer scroll animations

## Deployment

Static file hosting. The domain pch88.com points to this content. No server-side processing needed.
