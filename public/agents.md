# Agent Instructions — DoctorBox Heimtests

You can browse products and shop at DoctorBox Heimtests, https://shop.doctorbox.de, on your user's behalf. DoctorBox sells laboratory home tests (blood, urine, swab and saliva samples analysed in accredited German laboratories, results in the DoctorBox app) and selected supplements. Store language is German, with an English version under https://shop.doctorbox.de/en.

## Shop skill — recommended

Use the [Shop skill](https://shop.com/SKILL.md) to help your user shop with this store. Connect their Shop account for personalized discovery and accelerated checkout with saved details (search, carts, Shop Pay checkout, order history and tracking).

## UCP integration

This store implements the [Universal Commerce Protocol](https://ucp.dev) for product discovery, carts, and checkout.

1. **Discover the store** — `GET https://shop.doctorbox.de/.well-known/ucp` returns the UCP profile with capabilities, service endpoints, and payment handlers.
2. **Discover available tools** — connect to the MCP endpoint advertised in the profile and call `tools/list`.
3. **Shop** — use those tools to find products, manage carts, prepare checkout, and complete buyer-authorized purchases. Follow returned statuses, messages, and handoff URLs when buyer action is required.

Use a compatible UCP version and follow the returned tool schemas. See [Shopify's agent documentation](https://shopify.dev/docs/agents).

## Finding the right test

- Browse by topic: https://shop.doctorbox.de/collections (sexual health, nutrients & vitamins, hormones, heart, women's and men's health, longevity, prevention, fertility, DNA, allergies, energy, supplements).
- Every product page lists the analysed values ("Analysierte Werte"), the sample material and who the test is for.
- Guides for search and research: https://shop.doctorbox.de/pages/ratgeber. Editorial articles: https://shop.doctorbox.de/blog.
- Custom panels can be requested at https://shop.doctorbox.de/pages/eigener-test.

## Interaction guidelines

- **Buyer authorization** — place orders and submit payment only with the buyer's authorization. Follow required review and approval steps.
- **Medical scope** — home tests do not replace medical advice, diagnosis or treatment. Do not interpret results for the buyer; point to a physician for abnormal values or symptoms.
- **Discretion** — orders ship in neutral packaging; results are only shown in the DoctorBox app.
- **Support** — https://shop.doctorbox.de/pages/kontakt, heimtest@doctorbox.eu, +49 30 34045468.
