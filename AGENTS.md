# Figma Landing Implementation Rules

Use this workflow when bringing the landing page into alignment with Figma.

## Source Of Truth

- Use the Figma node-specific URL as the source of truth.
- For every section, call `get_design_context` first. Use `get_metadata` only as a supporting outline.
- Do not infer composition from screenshots or from the current HTML/CSS when Figma provides layout data.

## Section Workflow

For each visible top-level landing section:

1. Record the Figma section `width`, `height`, `x`, `y`, padding, gap, and layout mode.
2. Map the section to existing HTML or create the missing wrapper if the current DOM cannot express the Figma composition.
3. Transfer the composition model exactly:
   - grid column count and explicit item placement;
   - absolute-positioned decorative/image layers;
   - stacked text spans, inline gradient spans, and forced line breaks;
   - z-index/layer order;
   - visible and hidden elements.
4. Treat decorative absolute layers as required composition, not optional decoration:
   - include gradient squares, blurred ellipses, shadows, splashes, badges, and partial off-canvas layers;
   - do not discard a layer just because its `x/y` or bounds are outside the section frame;
   - resolve off-canvas layers from `get_design_context` wrapper styles (`right`, `top`, transforms), not only compact `x/y` metadata.
   - Before copying `top/left/right/bottom`, verify whether the local section has extra offset caused by a previous hero/overlap/scroll element. If local content is shifted from Figma padding, either fix the section padding/height first or shift the decorative layer by the same delta. Never leave a decorative layer anchored to the wrong visual band.
5. Transfer text bounds and wrapping:
   - match text node width/height and explicit line breaks from Figma;
   - do not let narrower local wrappers introduce new line breaks;
   - use `white-space: nowrap` or wider child bounds when Figma text is one line.
   - If a text line wraps in the browser but not in Figma, compare the Figma text node bounds against every local wrapper width. The usual cause is a local wrapper that is narrower than the Figma text bounds, not a font issue.
   - Do not guess wrapping from visible screenshots alone. Verify the Figma `TEXT` node `width`, `height`, `characters`, and line-height through MCP, then set local width/white-space to match.
6. Transfer visual properties:
   - border radius;
   - padding and gaps;
   - fill colors and gradients;
   - background blur and shadows;
   - image dimensions and object fit;
   - text family, weight, size, line-height, letter-spacing, case, and color.
7. Preserve the repo stack: static HTML/CSS/JS. Convert React/Tailwind-like MCP output into local CSS classes. Do not add Tailwind.
8. If existing markup cannot match Figma composition, change the markup. Do not force a wrong layout with CSS only.
9. Verify section metrics in browser: `top`, `height`, key child rectangles, and absence of console errors.

## Acceptance Bar

- Section composition must match Figma at desktop 1440px first.
- Responsive rules are secondary and must not corrupt desktop fidelity.
- A section is not done if cards, illustrations, title spans, text wrapping, or decorative layers occupy different structural positions from Figma.
- `git diff --check` must pass after changes.
