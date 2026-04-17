# The Design System: Editorial Empathy

## 1. Overview & Creative North Star
The North Star for this design system is **"The Digital Concierge."** 

In the bustling context of Addis Ababa, losing an item is a moment of high friction and anxiety. Our system must act as a calm, authoritative, yet deeply human guide. We break the "generic utility app" mold by moving away from rigid boxes and heavy borders. Instead, we embrace **Asymmetric Sophistication**—using generous white space, oversized editorial typography, and layered tonal surfaces. 

The layout isn't just a grid; it’s a series of "soft landings." By utilizing a high-contrast typography scale (where headlines are unapologetically large against minimal body text), we create an experience that feels less like a database and more like a helpful community conversation.

---

## 2. Colors: Tonal Depth over Borders
This system uses a palette that balances reliability with human warmth. We move beyond flat design by utilizing tonal shifts to define space.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   **Surface Hierarchy:** To create a "nested" depth, place `surface_container_lowest` cards atop a `surface_container_low` background. This creates a natural, soft-edged separation that feels premium and intentional.

### Signature Palette Application
*   **Primary (`#004cc3`):** Use for high-intent actions and navigation. To add "soul," use a subtle linear gradient from `primary` to `primary_container` on large CTAs.
*   **The "Found" State (Tertiary - `#0d631b`):** Represents relief and resolution. Use `tertiary_container` for broad background fills in "Found" item details.
*   **The "Lost" State (Secondary - `#a83900`):** Represents urgency without panic. A soft, warm orange-red that commands attention through contrast, not vibration.
*   **Glassmorphism:** For floating action buttons (FABs) or navigation bars, use `surface` with 80% opacity and a `20px` backdrop-blur. This makes the UI feel light and integrated into the user's environment.

---

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance character with extreme readability.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Editorial" voices. `display-lg` and `headline-md` should be used with tight letter-spacing (-0.02em) to create a modern, high-end feel. These are the anchors of the screen.
*   **Body & Labels (Inter):** The "Utility" voice. Inter provides world-class legibility for descriptions of lost items and navigation labels. 

**Hierarchy Strategy:** 
Use `display-sm` for screen headers but keep the surrounding area completely clear of decorative elements. Let the Amharic and Latin characters breathe. The contrast between a `headline-lg` title and `body-md` description creates an authoritative hierarchy that guides the eye effortlessly.

---

## 4. Elevation & Depth: Tonal Layering
We do not "elevate" items with shadows; we "lift" them through light.

*   **The Layering Principle:** Treat the UI as stacked sheets of fine paper. 
    *   *Base:* `surface`
    *   *Section:* `surface_container_low`
    *   *Interactive Card:* `surface_container_lowest` (White)
*   **Ambient Shadows:** If a floating element requires a shadow (e.g., a "Report Item" button), use a shadow color tinted with `on_surface` (10% opacity) with a blur radius of `24px` and a `Y-offset` of `8px`. Avoid harsh black shadows.
*   **The "Ghost Border" Fallback:** If a container requires more definition on a complex background, use `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Human-Centric Elements

### Cards & Lists
*   **No Dividers:** Forbid the use of horizontal lines between list items. Use 16px or 24px of vertical white space to separate "Lost" item cards.
*   **Content Layering:** Use `surface_container_high` for small metadata tags (e.g., "Bole District") tucked into the corner of an item card.

### Buttons (The "Soft-Touch" Action)
*   **Primary:** A pill-shaped (`full` roundedness) button using the `primary` color. High-end touch: A 1px "Ghost Border" of `primary_fixed` to catch the light.
*   **Secondary:** Use `surface_container_highest` with `on_surface_variant` text. No border.

### Input Fields
*   **The "Unboxed" Input:** Use a `surface_container_low` background with a `md` (0.75rem) corner radius. Instead of a bold border on focus, use a `2px` bottom stroke of `primary` or a subtle glow using `surface_tint`.

### Signature Component: The Status "Halo"
For item status (Lost/Found), do not just use a label. Use a large, soft-glow "Halo"—a low-opacity circle of the `secondary` or `tertiary` color behind the item image to instantly communicate the state via peripheral vision.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. For example, a header might have a 32px left margin and a 16px right margin to create a dynamic, editorial flow.
*   **Do** prioritize Amharic readability. Ensure line-height for Amharic text is 1.4x–1.6x the font size to accommodate character complexity.
*   **Do** use `surface_bright` for areas meant to capture the user's focus during the onboarding flow.

### Don’t
*   **Don’t** use pure black (`#000000`). Always use `on_surface` or `on_background` for text to maintain the "human" warmth of the system.
*   **Don’t** stack more than three levels of depth. Layering should simplify, not complicate.
*   **Don’t** use icons as the primary way to communicate "Lost" vs "Found." Rely on the signature color tones and clear typography first.