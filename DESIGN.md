# DoctorBox Shop – Design Notes

Brief: Headless Shopify shop for at-home medical tests (DoctorBox GmbH, Berlin). Audience is mostly
mobile, often searching for a specific value (Vitamin D, Chlamydien, Testosteron…). Primary job of
the site: get a person from a vague health question to the right test in under a minute, with the
discretion and clinical trust the category demands.

## Tokens

Color (all from the DoctorBox styleguide; names kept):

| token        | hex       | role                                                 |
|--------------|-----------|------------------------------------------------------|
| soft         | `#F7F1E9` | text on moss, hero chips (page background is white)  |
| lind         | `#CBDFC6` | calm panels, biomarker chips, category field          |
| green        | `#0E834B` | primary action, links, "analysed values" accents      |
| moss         | `#0E4D2F` | dark stage (hero, trust band), headline ink on lind   |
| turquoise    | `#7EC3A1` | secondary accent on moss (icons, focus ring)          |
| blue         | `#122137` | body ink (instead of pure black)                      |
| okker        | `#ECD3A8` | badges (Abo −20 %, Neu), rating stars                 |
| white        | `#FFFFFF` | product image stage, cards, inputs                    |

Type: **Host Grotesk** only (variable 300–800). Headlines 600 with −0.02em tracking, body 400 at
16–17px / 1.55, max ~70ch. Styleguide scale: 64 / 48 / 36 / 28 / 24 / 21 / 18 / 16.
Buttons follow the styleguide: pill, uppercase, 0.06em tracking (the one place caps are used).

Radii encode hierarchy: `999px` for actions and chips, `24px` for cards, `32px` for section panels.

## Layout concept

Mobile first, left aligned, one column that grows to a 12-col grid at `lg`.

```
┌────────────────────────────────────────┐
│ logo        nav…          DE  ⌕  ♡ 🛍 │
├────────────────────────────────────────┤
│ MOSS STAGE                             │
│  Finde den Test, der zu                │
│  deiner Frage passt.                   │
│  ┌──────────────────────────────────┐  │
│  │ ⌕  Vitamin D, Chlamydien, …      │  │  ← the memorable element
│  └──────────────────────────────────┘  │
│   Vitamin D   STI   Testosteron  …     │  (popular queries)
│  ◐ star / tunnel shapes bleed in       │
├────────────────────────────────────────┤
│ LIND FIELD: category pills             │
├────────────────────────────────────────┤
│ Top-Picks grid (white cards on soft)   │
├────────────────────────────────────────┤
│ So funktioniert es  1 → 2 → 3 → 4      │  (a real sequence, numbered)
├────────────────────────────────────────┤
│ MOSS BAND: Abholung Berlin, Labor,     │
│ Diskretion                             │
├────────────────────────────────────────┤
│ Ratgeber teasers                       │
└────────────────────────────────────────┘
```

Product page: gallery on a white stage; right column opens with the *analysed values* as lind
chips directly under the title (the thing people actually compare), then price, variant pills,
purchase option (Abo vs Einzelkauf), CTA, pickup availability, accordions.

## Brand highlight

Key words in headlines sit in a rounded pale-green (lind) box, written as `[[word]]` in the
dictionary and rendered by `components/ui/Highlight.tsx` (`tone="dark"` on moss). Use it once per
headline, on the word that carries the meaning.

## Principles

1. Spend boldness on the hero search. Everything else quiet and typographic.
2. Colour arrives as large flat fields (moss stage, lind field), never gradients.
3. One typeface, hierarchy from size and weight only.
4. Motion: a single hero reveal; everything else only answers a user action.
5. Chips are information: a biomarker chip = one analysed value; a sample chip = what you give.

## Review against generic defaults

- Cream background is mandated by the brand, but we pair it with a geometric sans and deep greens,
  not a serif + terracotta. The dark stage is moss green, not near-black with acid accent.
- No all-caps eyebrows; the only caps are the styleguide buttons.
- No identical card kit: cards only for products; content sections are typographic or coloured fields.
- Numbered steps only in "So funktioniert es", which is a real sequence.
