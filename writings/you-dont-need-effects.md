---
title: "You don't need effects to transform data"
date: "2024-02-21"
og:
  description: "Hooks like useEffect are a complex subject.  Here I explore best practices for their use."
  image: "images/Capture-react-tdd.PNG"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## You don’t need Effects to transform data for rendering

This article is about the ```useEffect``` hook, when to use it, when not to use it, and how to use it and custom hooks to refactor code.

## Hooks rules

Hook basic rules we must always follow.

1. Never call Hooks from inside a loop, condition or nested function
2. Hooks should sit at the top-level of your component
3. Only call Hooks from React functional components
4. Never call a Hook from a regular function
5. Hooks can call other Hooks

## useEffect & useLayout

The ```useEffect``` hook invokes side effects from within functional components.

It runs after every render (by default), and can optionally clean up for itself before it runs again.

This hook takes the place of class lifecycle functions like componentDidMount.

The ```useLayoutEffect``` hook runs before the browser updates the screen and avoids flashing of old data.

## Effect docs

The new react docs have a series of articles called escape hatches.  One is all about [common cases in which you don’t need Effects](https://react.dev/learn/you-might-not-need-an-effect).

The first example given is to filter a list before displaying it.

An Effect that updates a state variable when the list changes will re-run whenever props or state change creating unnecessary render passes.

The recommendation is to transform all the data at the top level of components which will re-run whenever props or state change.

## Cannot update a component while rendering a different component

When using an effect, sometimes I was getting an errors like this:

```txt
Warning: Cannot update a component (Setup) while rendering a different component (Setup). To locate the bad setState() call inside Setup, follow the stack trace as described in [Bug: too hard to fix "Cannot update a component from inside the function body of a different component." · Issue #18178 · facebook/react](https://github.com/facebook/react/issues/18178#issuecomment-595846312)
at Setup (http://localhost:3001/static/js/bundle.js:28411:76))
```

That's usually not the kind of thing you want to see in your console.  The article link is titled: *Bug: too hard to fix*.

The link there shows a screenshot of how to use the stack trace to find the error, but since the app uses Redux, there is no setState() in the app at all.

The last time I fixed this error, this is what I did.

Near the top of the setup component, I determined this was the culprit:

```js
// pre-select the client for existing projects that have a client in the input
if (!myForm.clientObject && defaultClient !== '') {
    clients.forEach((client: any) => {
        if (client.id === defaultClient.id) {
            defaultClient = client;
            dispatch(selectClient(client));
        }
    })
}
```

After changing it to this, the warning was gone:

```js
useEffect(() => {
    if (!myForm.clientObject && defaultClient !== null) {
        clients.forEach((client: ClientDTO) => {
            if (client.id === defaultClient?.id) {
                setDefaultClient(client);
                dispatch(selectClient(client));
            }
        });
    }
}, []);
```

It says we need Effects to synchronize with external systems.

## The example

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

A rule of state management is if something can be calculated from the existing props or state, don’t put it in state.

But what happens in the above example when the settings a triggered after the component renders?  Wont the full name then be out of date?

## A Redux example of deriving data

Relating to the rule above that we should derive additional values from that state whenever possible, [here is another example](https://redux.js.org/usage/deriving-data-selectors#deriving-data) of avoiding a useEffect.

The example shows says: *Many times users tried to define a useEffect hook that waits for a state value to change, and then sets state with some derived value like setAllCompleted(allCompleted). Instead, that value can be derived during the rendering process and used directly, without having to save the value into state at all:*

```js
function TodoList() {
  const [todos, setTodos] = useState([])

  // Derive the data while rendering
  const allTodosCompleted = todos.every(todo => todo.completed)

  // render with this value
}
```

## Cascading updates

Back to the [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) article, it says *avoid the extra “cascading” updates*

When you update a component during rendering, React throws away the returned JSX and immediately retries rendering. To avoid very slow cascading retries, React only lets you update the same component’s state during a render. If you update another component’s state during a render, you’ll see an error. A condition like items !== prevItems is necessary to avoid loops. You may adjust state like this, but any other side effects (like changing the DOM or setting timeouts) should stay in event handlers or Effects to keep components pure.

The example of the solution to this is:

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

Use Effects only for code that should run because the component was displayed to the user. In this example, the notification should appear because the user pressed the button, not because the page was displayed.

## About effects

There is a difference between even handlers and effects.

### Event handlers

In event handlers the state behaves like a snapshot. We call a setter and variables will reflect the value at the time the user clicked the button.
If you need to use the next value for calculations, define it manually like const nextRound = round + 1.  Event handlers are used to:

- handle particular events
- only re-run when you perform the same interaction again.

### Effects

All code inside Effects is reactive. It will run again if some reactive value it reads has changed due to a re-render.  Effects are used to:

- run some code after rendering like synching a component with something outside of React.
- re-synchronize if any of the values they read, like props or state, are different than during last render.

Sometimes, you want a mix of both behaviors: an Effect that re-runs in response to some values but not others.

If some logic must run once per app load rather than once per component mount, add a top-level variable to track whether it has already executed such as this: ```letdidInit= false;```

To also run it during module initialization and before the app renders: ```if (typeof window !== 'undefined') { ...```

## Custom hooks

[Implement your own custom hook in React with typescript](https://dev.to/atbrakhi/implement-your-own-custom-hook-in-react-with-typescript-1f1l) By Rakhi, posted on 25 Apr 2023.

[Typing custom hooks with tuple types](https://fettblog.eu/typescript-react-typeing-custom-hooks/?ref=morioh.com&utm_source=morioh.com)

Stick to the naming convention as regular React hooks do: Returning an array that you destructure when calling the hook.

Hook:  ```const [isVisible, toggleVisible] = useToggle(false)```

Usage: ```<button onClick={toggleVisible}>Hello</button>```

Error: Type ‘boolean | (() => void)’ is not assignable to type …
boolean | (() => void)'. This comes from returning an array
onClick. onClick expects a function.

### Option 1: Add a return tuple type

```js
useToggle = (init: boolean): [boolean, () => void] => { 
  ...
}
```

### Option 2: as const

```js
export const useToggle = (initialValue: boolean) => { …
  // here, we freeze the array to a tuple
  return [value, toggleValue] as const
}
```

The return type is now readonly ```[boolean, () => void]```

## Best practices with custom hooks

When refactoring code using the SRP (Single Responsibility Principal), it's good to get a clear idea of what types of code do what.

- hooks are for state,
- functions are for functions

When a piece of information is used for rendering, useState.

When a piece of information is only needed by event handlers and changing it doesn’t require a re-render, useRef

Use state variables when you have values that will influence the display. But you use refs when you have values that should stay in memory - but are not used in the display.

Two components employing the same Hook cannot share the same state: When two components share a custom Hook, each has its own isolated state and effects.

This implies that the state and effects included within the Hook are not shared by the two components, but rather that each component has its own instance of the state and effects.

The official docs say: *Custom Hooks let you share stateful logic but not state itself.*

We want to follow the best practice idea from here:
[#15. Avoid huge component](https://dev.to/sathishskdev/part-4-writing-clean-and-efficient-react-code-best-practices-and-optimization-techniques-423d)

It then says, for #15 [read this article](https://dev.to/sathishskdev/part-3-component-structure-building-reusable-and-maintainable-components-in-react-54n6)

Here the author is separating the state and event handling into custom hooks or components.  It's well worth it to get clear on the examples in this article and how to apply that in your own work.

### Custom hook warning: Don't share state

Creating a custom hook doesn't mean the data is shared, it is just so code can be shared.

While component 1 is rendering, if it calls ```const [data, setData] = useState<boolean>(false)```, it creates a state variable for component 1.

This is the case whether it's written inline or extracted to a helper function (aka, a custom hook).

Similarly, when component 2 calls useState, it creates state for component 2. The two states are not shared.

The standard approach is to lift the state up to a common ancestor components and then pass it down.

If the common ancestor is nearby, props can be used; if it's far away, context or Redux can be used.

## Summary

The useEffect hook is an essential part of a React, but that doesn't mean it should be used everywhere.  As always, clean code should avoid unessesary complexity, so knowing when not to use more code is just as important as knowing when to use it.

Use the hashtag #YouDontNeedEffects and the link below on [Twitter](https://twitter.com/) for any comments or feedback.
