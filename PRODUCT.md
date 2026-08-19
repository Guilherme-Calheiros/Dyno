# Product

## Register

product

## Users

Crochet artisans (mostly women, Brazilian market) who make amigurumi and handmade pieces. They work from a phone in the middle of a craft session, often with yarn in hand: one-handed, glanceable interactions. They already price by hand or not at all, and lose track of time while working.

## Product Purpose

"Ponto a Ponto" is a mobile app to store crochet recipes, run a per-piece production timer, log steps and materials as they happen, and derive a suggested price from time + materials. Success means the artisan finishes a piece, knows exactly how long it took and what it cost, and has a reusable recipe for the next one.

## Brand Personality

Warm, capable, unhurried. The calm of a practiced hand. Three words: focused, warm, artisanal but not cute. The interface should feel like a well-worn workbench: precise, sturdy, and quietly warm. Warmth comes from the accent and the craft, never from a fake "handmade" background.

## Anti-references

- Generic AI craft app: cream/sand/parchment body background, pastel circles, faux-handmade doodles, floating glassy pills.
- "Shabby chic" handcraft styling: ribbons, dashed borders, kraft paper textures.
- SaaS-cream minimalism with no personality.
- Over-decorated buttons and invented affordances for standard tasks.

## Design Principles

- Shadcn as the baseline: neutral stone palette, hairline borders, one accent (terracotta) reserved for actions and state, Inter throughout, standard affordances.
- The tool disappears into the task. The artisan is mid-piece with yarn in hand; nothing decorative should ask for attention.
- Data over decoration. Time, price, and progress are the product; make them legible, not ornamented.
- Consistency beats surprise. One component vocabulary across every screen.
- Warmth in the accent, not the background. Terracotta carries the brand; the base stays neutral.

## Accessibility & Inclusion

- WCAG AA contrast for body text and placeholders (muted-foreground keeps >=4.5:1 on card/bg).
- White-on-terracotta primary buttons tuned to >=4.5:1.
- Large touch targets for one-handed use while holding yarn.
- Respect reduced motion; no decorative animation.
