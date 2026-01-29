# Assisted Authoring Exploration

## Goals

- Surface two experiences for AI polish:  
  1. **Selection-first** (default today): user highlights text and invokes AI.  
  2. **Full-send**: user taps an explicit action to polish the entire draft.
- Capture UI ideas before coding so we can gather feedback.

## Idea 1: Selection-first focus (current baseline)

- **Interaction**: Keep the BubbleMenu/ActionButton available when text is highlighted.  
- **Indicator**: A tooltip-like label "Polish selection" shows the current mode.  
- **Pros**: Minimal friction, precise control, reuse existing modal flow.  
- **Cons**: Harder for users who want an all-at-once rewrite, and selection is tricky on mobile.

## Idea 2: Full-text polish mode

- **Trigger**: Add a prominent toggle near the toolbar that switches between “Selection” and “Full-text” modes.  
- **Action**: In full-text mode, a dedicated “Polish entire draft” CTA appears (e.g., on the toolbar or below the textarea).  
- **Review**: Still surface the diff modal so users can approve the rewrite.  
- **Pros**: Clear workflow for coarse edits; complements selection mode.  
- **Cons**: Slightly more UI complexity; need to guard against accidentally polished text.

## Idea 3: Dual-mode prototype

- **UI**: Toggle (pill buttons or segmented control) that switches between selection and full-text behavior.  
- **Behaviour**:  
  - Selection mode keeps the bubble menu active and lets the user highlight text to polish.  
  - Full-text mode hides/disabled the bubble menu and enables the “Polish draft” button.  
- **Feedback focus**: This prototype lets testers compare the precision-first vs rewrite-first flows in the same build.

## Next steps

1. Implement the toggle + dual-action UI in `src/components/EmailRect/EmailRect.tsx`.
2. Make sure the documentation file is referenced from `README.md`.
