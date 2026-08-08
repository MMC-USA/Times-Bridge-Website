# Times Bridge US

Static multi-page site for Times Bridge US, the investment and partnership arm of The Times of India Group in the United States.

Content positions the business as the corridor between products proven in the American market and India's enterprise demand: curated US supply, problem-mapped Indian demand, and an end-to-end bridge covering deal structuring, market entry, delivery and India go-to-market. The commercial model (investment position, milestone-linked upside, channel origination) is described qualitatively, without terms or percentages.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home, thesis, why now, the connection gap, how the bridge works, why Times Bridge, track record |
| `/about/` | Mandate, the four structural advantages, the India anchor, build horizons, Times of India Group heritage |
| `/the-india-opportunity/` | Market data, buyer-readiness ladder, compounding advantages, counter-evidence, how to play |
| `/portfolio/` | Partner track record, stories of scale, illustrative sector plays for the next corridor |
| `/team/` | Team |
| `/news-insights/` | News listing |
| `/blog/*`, `/news/*`, `/press-releases/*` | Article pages (historical, unchanged) |
| `/contact/` | Contact, offices and US entity details |
| `/careers/` | Careers, the two mandates, and job detail |

## Run locally

From this folder:

```bash
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765).

## Structure

- `assets/css/main.css`, site styles, including the bridge content components (panels, pillar grids, flow steps, readiness ladder, horizons, case cards, data tables, source notes)
- `assets/js/main.js`, menu, forms, team bios, reveal
- `assets/images/logo.png`, Times Bridge US logo (navbar & footer)
- `times-bridge-us-main.png`, main logo source file
- `Times Bridge US Logo.png`, earlier logo source file

## Notes on figures

Market figures on the home and India Opportunity pages carry inline source notes. Forecast ranges are stated as ranges where sources disagree, and the illustrative sector plays on the portfolio page are labelled as target motions rather than prior engagements.
