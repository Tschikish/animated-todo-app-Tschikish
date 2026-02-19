# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

---

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Known bugs](#known-bugs)

---

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

---


### Links

- Live Site URL: [Todo App on Netlify](https://animated-todos-jvmdo.netlify.app)
- Solution URL: [Solution on Frontend Mentor](https://www.frontendmentor.io/solutions/draggable-and-animated-todos-NGAtcm1pW2)

---

## My process

- Setup project  
  - Configure Vite and ESLint  
  - Organize project structure  
- Follow a mobile-first workflow  
- Build basic markup
- Implement the core TODO logic using React state  
- Create layout and styling system  
- Integrate drag and drop  
- Add animations
- Refactor, debug, and polish  

The goal was not only to complete the UI, but to integrate drag-and-drop in a way that respects React’s state-driven architecture.

---

### Built with

- React + TypeScript
- Custom CSS (design tokens via CSS variables)
- FormKit's Drag and Drop
- Framer Motion

I chose FormKit's Drag and Drop because of its data-first approach. Most drag-and-drop solutions manipulate the DOM directly. In my opinion, deriving the DOM from state is a better fit for the React mental model. The imperative `dragAndDrop` function allowed me to synchronize the DnD engine with an existing state array instead of introducing a second source of truth.

---

### What I learned

- Deriving semantic names from design tokens is harder than it seems. Naming variables in a scalable way (primary, secondary, accent, muted, surface, etc.) requires thinking beyond the current UI.

- Do not mix class-based dark mode and system-based color logic carelessly. If variables are defined inside `.dark`, they will not exist when certain CSS functions are resolved. Theme switching must be consistent and centralized.

- `light-dark()` is designed to react to system color scheme, not manual toggles. For manual theme switching, CSS variables on `<html data-theme="...">` are more reliable.

- Font imports must precede certain CSS layers for correct application and performance.

- Drag-and-drop must operate on the same derived list used to render the UI. I initially passed `todos` into the DnD engine instead of `visibleTodos`. This caused bugs when filtering. The correct source of truth for DnD is the array that actually builds the list.

- Using `todos` as the dependency for reattaching drag logic was incorrect. The correct trigger is the derived visible list because that represents the current DOM structure.

- Motion’s `AnimatePresence` manipulates the DOM. That can conflict with drag libraries. I added a `draggable` guard to ensure DnD only targets nodes that actually exist.

- Motion layout animations introduced strange behavior during list reordering (especially at the edges). I removed layout animations and relied on FormKit’s `animations()` plugin instead.

- The `animations()` plugin internally creates a clone of the element for transition purposes. Understanding this helped explain the visual behavior of the ghost element.

- Properly mapping drag classes is essential:
  - `ghost` hides the original dragged node.
  - The placeholder class styles the drop position.
  Swapping them changes the entire visual behavior.

- Reordering filtered todos introduces additional semantic complexity. I disabled reordering while filtered to avoid unexpected ordering logic.

- UI elements visible only on hover will not appear on touch devices. Using `pointer-coarse` helps account for that.

- Accessibility focus styling should not be removed without replacement. Using `:focus-visible` preserves keyboard navigation clarity.

- Asset paths must not include `/public` in Vite when referenced from source files.

---

### Continued development

- Persist data in IndexedDB (Dexie) or a remote database (Supabase)
- Add smooth background image transitions
- Animate theme toggle button
- Improve drag handle positioning (consider placing it in-flow instead of absolutely positioned)
- Improve mobile drag feedback
- Previously removed exit animation feedback could be reimplemented

---

### Known bugs

- Very fast drag interactions can sometimes produce odd intermediate visuals. The `animations` plugin is still evolving and not entirely predictable under rapid interaction.
- Dragging is disabled while filtered to avoid ambiguous ordering behavior.
- No data persistence yet (todos reset on refresh).