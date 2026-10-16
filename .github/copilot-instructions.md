# Portfolio Project Guidelines

## Project stack

- This is a client-side portfolio built with React, Vite, and JavaScript (ES modules). Use `.jsx` for React components and `.js` for other JavaScript modules.
- Keep the app frontend-only. Do not add a backend or new dependency unless the requested feature genuinely requires it.
- Use the existing npm scripts: `npm run dev` for local development and `npm run build` for production verification.

## Code and component organisation

- Inspect the existing files and conventions before editing. Preserve working behavior and make focused changes related to the request.
- Keep `src/main.jsx` as the app entry point and `src/App.jsx` as the page composition. Keep shared global styles and design tokens in `src/styles.css`.
- As the page grows, organize reusable UI in `src/components/` and page sections in `src/sections/`. Extract a component when it has a clear reusable purpose; avoid both duplicated markup and unnecessary abstraction.
- Use functional React components and hooks where appropriate. Prefer clear, descriptive names, small focused components, readable JSX, and consistent formatting with nearby code.
- Keep content data separate from presentation when it improves reuse or makes portfolio updates clearer. Do not introduce TypeScript.
- Use minimal dependencies. Prefer platform APIs, CSS, and existing project patterns over adding a package for a small feature.

## Portfolio content

- Never invent the portfolio owner's employers, project history, qualifications, dates, responsibilities, achievements, metrics, testimonials, or contact details.
- Use clearly identified placeholders where information is missing, and keep portfolio copy easy for the owner to edit.

## Accessibility

- Use semantic HTML landmarks and elements, with a logical heading hierarchy and descriptive link text.
- Make every interactive control keyboard operable, visibly focused with `:focus-visible`, and appropriately named for assistive technology. Use native buttons for actions and links for navigation.
- Provide meaningful alternative text for informative images; hide decorative imagery from assistive technology.
- Maintain readable contrast in both themes, do not rely on colour alone to communicate meaning, and respect `prefers-reduced-motion`.
- Verify that responsive layouts remain usable with keyboard navigation and at narrow viewport widths.

## Responsive design

- Design mobile-first or ensure every new layout adapts cleanly from small screens through desktop.
- Use flexible layouts, fluid sizing, and content-appropriate breakpoints; prevent horizontal overflow and preserve readable line lengths and comfortable touch targets.
- Check navigation, hero content, calls to action, and any new sections at narrow and wide viewport sizes.

## Themes and styling

- Use the existing CSS custom properties in `src/styles.css` for colours and shared visual tokens; do not hard-code theme-dependent colours in components.
- Keep light and dark theme styling consistent through the existing `:root` and `:root[data-theme="dark"]` token sets.
- Preserve the theme initialization in `index.html`: use a saved `portfolio-theme` preference when present and otherwise respect `prefers-color-scheme`. Keep the theme toggle synchronized with `document.documentElement.dataset.theme` and persist explicit user choices in `localStorage`.
- Keep transitions restrained and ensure motion-sensitive users can reduce or disable animation.

## Testing and verification

- Run the smallest relevant checks after changes. At minimum, run `npm run build` for changes that affect application code, styles, or build configuration.
- No test script is currently configured. For interactive or accessibility behavior, also verify the affected behavior manually where practical; add tests only when appropriate to the change and existing tooling.
- Report which checks were actually run and their results. Do not claim unrun tests or checks passed.

## Code review

- Review the final diff for correctness, accessibility, responsive behavior, consistency across themes, and unintended changes.
- Preserve existing working functionality, avoid unrelated edits, and surface errors rather than hiding them with silent fallbacks.
- Confirm dependencies are necessary before adding them, and ensure the resulting implementation remains readable and maintainable.
