# LogicsGrid multi-page polish

## Goal
Turn the current seven-page shell into a complete, polished multi-page LogicsGrid site using the supplied visual system, while preserving the premium dark identity and homepage 3D centerpiece.

## What will change

1. **Shared design system and navigation**
   - Align typography, colors, spacing, contrast, buttons, cards, focus states, and reduced-motion behavior with the supplied design brief.
   - Build the desktop Services dropdown, full-screen mobile menu, four-column footer, floating mobile WhatsApp action, and route-change scroll restoration.
   - Keep the 3D cube only on the homepage, lazy-load it, and replace other abstract/heavy scenes with lightweight product/device frames.

2. **Reusable content architecture**
   - Store services, case studies, industries, and insights in central data files.
   - Add reusable section headings, CTA banners, content cards, device frames, FAQ accordions, form controls, and mobile sticky consultation actions.
   - Preserve the existing LogicsGrid messaging and use clearly bracketed placeholders only where factual content or media is missing.

3. **Complete page set**
   - Home, Services, six service detail pages, Work, case-study detail pages, Industries, For Agencies, About, Insights, insight article pages, Contact, Privacy, Terms, and styled 404.
   - Keep the existing “no team section” decision: About will include the story, values, company facts, and CTA without a team grid.
   - Give every content page one H1, a final CTA, and unique title, description, Open Graph, and Twitter metadata.

4. **Contact experience**
   - Add accessible client-side validation, clear inline errors, and a success state.
   - Include email, WhatsApp access, response-time note, and a clearly marked booking placeholder until a real booking URL is supplied.

5. **Quality verification**
   - Test core flows and all routes at 375, 768, 1024, and 1440px.
   - Check horizontal overflow, text overlap, 44px tap targets, keyboard navigation, focus visibility, heading order, image alt text, internal links, dropdown/menu behavior, filters, accordions, and form success.
   - Resolve build/runtime errors and recheck the latest preview diagnostics.

## Technical details
- Use TanStack Router’s file-based routes, including dynamic `$slug` templates; no second router will be introduced.
- Use semantic Tailwind tokens from the global stylesheet rather than hardcoded component colors.
- Use route params against typed data and render the existing styled 404 for unknown slugs.
- Keep all functionality frontend-only; the contact form will confirm locally and will not send email until a delivery service is connected.