# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screencast](#screencast)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Known bugs](#known-bugs)

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

### Screencast

![Real footage of a living app](./screencast.gif)

### Links

- Live Site URL: [Todo App on Netlify](https://animated-todos-jvmdo.netlify.app)
- Solution URL: [Solution on Frontend Mentor]( https://www.frontendmentor.io/solutions/draggable-and-animated-todos-NGAtcm1pW2)

## My process

- Setup project
  - Configure Vite, Eslint, those tools
  - Organize project files
- Mobile-first workflow
- Basic markup
- Implement the TODOs logic, the React thing
- Layout and styles
- Drag and drop
- Animations
- Fixes, improvements, refactors, etc

### Built with

- React.ts
- TailwindCSS
- FormKit's Drag and Drop
- Motion
- BaseUI

I chose Formkit's Drag and Drop library because of its data-first approach. As the developers themselves state: DnD solutions generally manipulate DOM directly. IMO, derive DOM from state is a better fit to the React mental model.

### What I learned

- Derive semantic names from design tokens is annoying. What are the rules for that???

- Don't mix Tailwind's class-based dark mode and CSS's system-based dark mode. They won't work together because variables in `.dark` class won't exist the time when `light-dark()` is resolved. It will then fail.

- `light-dark()` is not meant to work with manual theme toggling by design. It responds only to browser's current color scheme.

- Font import MUST PRECEDE Tailwind import

- `group` and `peer` are means for a child to be aware of its siblings states (checked, hover, etc.)

- `@utility` is used here to define custom gradients

- Tailwind v4 requires explicitly definition of shadows if you want to override the defaults

```css
  @theme inline {
    --shadow-lg: 0 10px 15px -3px var(--color), 0 4px 6px -4px var(--color);
  }
```

- Remember: you must fake the gradient border using a dedicated element that has a full gradient

- In Tailwind, to apply style either in one state or another, write multiple classes. Do not try things like `group-hover-focus:...` to create `OR` logic. Correct: `group-hover group-focus-within`.

- Remember: both `tw-merge` and `clsx` are PROD dependencies since they are a tools used in runtime

- How to use Formkit's drag and drop solution. I first tried using the hook `useDragAndDrop` with `todos` state as initial value. I realized was committing a conceptual mistake: keeping two pieces of states for the same UI, creating that only source of truth problem. So, I went to `dragAndDrop` imperative function, which is designed to synchronize an existing state and DND. Exactly what I needed.

- In this app, reordering filtered todos is disabled because it leads to additional semantics I am not worried for this project.

- I mistakenly used `todos` instead of `visibleTodos` as the dependency to trigger executions of `attachTodosDnd`. I figured out later that the derived array is the correct trigger since it is the one used to build the DND UI.

- I mistakenly used `todos` instead of `visibleTodos` as state for `dragAndDrop` function. It led to a bug when items are deleted while in filter view. Bug stopped after the change. It makes sense for `visibleTodos` be the correct source of state for DND since it is the one used to build the DND UI.

- Motion's `AnimationPresence` manipulates DOM, which causes conflicts with DnD. I setup a node selection logic in `draggable` that solved this one.

- Motion's layout animation introduced some weirdness in list reordering, like difficulty to place items at start/end of the list. I removed it in favor of `animations` plugin.

- `animations` plugin creates a clone of the actual HTML element for animations purposes. It turns out that this behavior nicely pairs with `dragClass` if you want to hide the default ghost image.

- I used `dragPlaceholderClass` to apply a change the background color of items while they are being dragged.

- Be careful with UI there is visible on `hover` only. They won't show up on touch devices. `pointer-coarse` helps here.

- For fonts, `link` is preferable over `@import` due to performance.

- Remember to not include `/public` in assets locators otherwise they won't be found when live.

### Continued development

- Persist data in IndexedDB (Dexie) or remote database (Supabase)
- Background image transition
- Theme button transition
- The drag handle could be in flow, as a flex item, with TodoItem altogether. Doing that way, it would be easier to animate I think. Instead, I absolute positioned them.

### Known bugs

- Fast drag an item up and down leads to weird results. `animations` plugin is currently experimental.
