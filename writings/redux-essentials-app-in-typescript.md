---
title: "Redux Essentials Example App with TypeScript"
date: "2022-11-20"
og:
  description: "A detailed walk through of the official React Redux example app using TypeScript and unit testing"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- The Redux Essentials tutorial creates a small social media feed app in React using vanilla JavaScript.
- This article aims to convert that app into TypeScript and add unit testing with Jest.

## Starting the social media feed app

In a [previous post](https://timothycurchod.com/writings/react-redux-typescript-counter-example) I walked through [step 2 of the Redux Essentials](https://redux.js.org/tutorials/essentials/part-2-app-structure) counter example app introducing TypeScript and unit testing.

At the start of [part three](https://redux.js.org/tutorials/essentials/part-3-data-flow) of the tutorial the reader is introduced to the goal of the next few steps: *a small social media feed app, which will include a number of features that demonstrate some real-world use cases.*

This starts with *a pre-configured starter project that already has React and Redux set up, includes some default styling, and has a fake REST API*.

[Here](https://github.com/reduxjs/redux-essentials-example-app) is the starting point codebase.

We will have to diff the current counter app code and see what needs to be added to get to this point.  I will walk through the changes need to take the example app starting point code from above and convert it to TypeScript and add unit tests where sensible.  If you're new to this, starting with the counter example in my previous blog would be a good first step.

In the counter app there are two directories in the src:

- app
- features/counter

In the redux-essentials-example-app there is:

- api
- app
- components

Begin by copying the api and components directories here.

In tha app directory, there is also a new file:

src/app/Navbar.js

Copy that file, but change the extension to .tsx.  Do the same for src\components\Spinner.tsx.

The store.js has an empty reducer, so that doesn't need to change here.

Next, use the App.js in the App.tsx here.  This shows that we will need to install react-router-dom.

Then, our first issue:

import Switch
Module '"react-router-dom"' has no exported member 'Switch'.ts(2305)
No quick fixes available

This code is old.  There is a comment from Dec 3, 2021: *Use Routes instead of Switch.*

That's an easy *switch* to make.  But then there is another error:

Type '{ exact: true; path: string; render: () => Element; }' is not assignable to type 'IntrinsicAttributes & RouteProps'.
  Property 'exact' does not exist on type 'IntrinsicAttributes & RouteProps'.ts(2322)

The version we are using:

```json
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.3",
```

The Redux example:

```json
    "react": "^17",
    "react-dom": "^17",
    "react-redux": "^7.2.4",
    "react-router-dom": "^5.1.2",
```

So that's the problem.  Use a simple example from router 6, then just use the styles from index.css and the app runs and looks good.

## Fixing the tests

Next, the App.tsx test is failing.

Remember, we are looking for the work "Learn".  Change that to "Redux" but still an error:

TestingLibraryElementError: Unable to find an element with the text: Redux.

The original getByText contained a regex.

```tsx
test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
```

I can see that there are different formats for it also.

We could use a data-testid.  Since there is no test in the redux-essentials-example-app, it's up to us.

This will work for now:

```tsx
test('renders learn react link', () => {
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(container).toHaveTextContent("Redux");
});
```

That's something I saw in the comments of [this issue](https://github.com/testing-library/dom-testing-library/issues/410) on the testing-library GitHub.  It works, so time to move on.

There are no tests also for the new code.  There eventually should be for the api/client.js and api/server.js and maybe the spinner, but since this is TDD, there is no point in going back at this point and testing that working code.  Time to move on.

## Main Posts Feed

(https://redux.js.org/tutorials/essentials/part-3-data-flow#main-posts-feed)

The first goal is to only show the list of post entries.  This starts in the inside the src/features folder which we already have.

We create a posts folder and add a new file named postsSlice.ts (instead of postsSlice.js)

Since we already have a src\features\counter\counterSlice.spec.ts, time to create a postsSlice.spec.ts

As there are no reducers yet, all we can do is test the initial state.

I don't think we test the store directly.  At least not now.  We add the posts: postsReducer to the store.

### Showing the Posts List

The PostsList component needs some TypeScript changes.

posts/PostsList.js

```tsx
export const PostsList = () => {
  const posts = useSelector(state => state.posts)
```

```sh
Object is of type 'unknown'.ts(2571)
```

Remember useAppSelector from the counter example?  It's a pre-typed versions of the useSelector hook.

If we import that and use it instead of useSelector, then that error goes away.

Before the above, the next line was also showing a TypeScript error.

```tsx
  const renderedPosts = posts.map(post => (
```

```sh
Parameter 'post' implicitly has an 'any' type.ts(7006)
```

After replacing useSelector with useAppSelector, this error is also gone.

After this, the App.tsx file can import the posts list component and show it in the app.  We can leave the working counter example there if we want also.

```tsx
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <React.Fragment>
                  <PostsList />
                </React.Fragment>
                <Counter />
              </section>
            }
          />
        </Routes>
```

Another TypeScript feature encouraged is typing objects with interfaces.

Without being asked to, I created the simple interface for a post:

```ts
export interface Post {
  id: string;
  title: string;
  content: string;
}
```

Now we can start to use that wherever a Post object is expected:

```tsx
const renderedPosts = posts.map((post: Post) => ( ...
```

### Adding New Posts

In [this step](https://redux.js.org/tutorials/essentials/part-3-data-flow#adding-new-posts) the AddPostForm.js is added to the posts directory.

Since this is a TypeScript JSX format file, the extension should now be using .tsx.  I'm not sure why on the website it's using .js instead of jsx.  A JSX returns JavaScript XML not JavaScript as it contains HTML in React.  If you are following along with this as a tutorial, then make the following change:

features/posts/AddPostForm.js -> AddPostForm.tsx

There are two useState hooks that need some TypeScript:

```jsx
  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
```

Both event objects have the same error in VSCode:

Parameter 'e' implicitly has an 'any' type.ts(7006)

The quick way out of this kind of error is to use the any type:

const onTitleChanged = (e: any) => setTitle(e.target.value)

This is OK to get on with work and test features, but it's bad form when using TypeScript, and should only be used if using the appropriate type is causing issues, in which case, you should leave a comment that excuses it's use explicitly.

We can see that the function calling that setter is a button which looks like this (in breif):

```html
<input onChange={onTitleChanged} />
```

There is a [cheat-sheet](https://github.com/typescript-cheatsheets/react) which has a specific section for [Forms and Events](https://github.com/typescript-cheatsheets/react#forms-and-events).  This shows a few examples such as this:

```js
/** function type syntax that takes an event (VERY COMMON) */
onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
```

Using that in the add posts form looks like this:

```js
const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
```

However, now there is an error on the onChange={onContentChanged} event:

```txt
(property) React.TextareaHTMLAttributes<HTMLTextAreaElement>.onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined
Type '(e: React.ChangeEvent<HTMLInputElement>) => void' is not assignable to type 'ChangeEventHandler<HTMLTextAreaElement>'.
  Types of parameters 'e' and 'event' are incompatible.
    Type 'ChangeEvent<HTMLTextAreaElement>' is not assignable to type 'ChangeEvent<HTMLInputElement>'.
      Type 'HTMLTextAreaElement' is missing the following properties from type 'HTMLInputElement': accept, align, alt, capture, and 27 more.ts(2322)
index.d.ts(2461, 9): The expected type comes from property 'onChange' which is declared here on type 'DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
```

React.ChangeEvent<HTMLInputElement>

This seems like another option:

React.FormEvent<HTMLInputElement>

const onTitleChanged = (e: React.FormEvent<HTMLInputElement>) => setTitle((e.target as HTMLInputElement).value)

However, the error on onChange only gets longer.

The issue here is that there are two different types needed, depending on the input.  For example:

```ts
const onTitleChanged = (e: React.FormEvent<HTMLInputElement>) => setTitle((e.target as HTMLInputElement).value)
const onContentChanged = (e: React.FormEvent<HTMLTextAreaElement>) => setContent((e.target as HTMLInputElement).value)
...
return (
      <input nChange={onTitleChanged} />
      <textarea onChange={onContentChanged} />
)
```

The input element uses HTMLInputElement and the textarea uses HTMLTextAreaElement.

Next import that component into App.tsx, and add it right above the <PostsList /> component:

The form is not  doing anything yet, so we don't need to make a test now.  After the next step, we can update the postsSlice.spec.ts which currently only tests the initial state.

### Create a reducer to save a new post

The next section is [Saving Post Entries](https://redux.js.org/tutorials/essentials/part-3-data-flow#saving-post-entries).

In the empty reducers argument to the createSlice function in the postsSlice.ts file, we create postAdded which has two arguments: the current state value, and the action object that was dispatched.  It looks like this:

```ts
reducers: {
  postAdded(state, action) {
    state.push(action.payload)
  }
}
```

We also need to createSlice automatically generates an action creator to dispatch from the UI when when the user clicks "Save Post".

```ts
export const { postAdded } = postsSlice.actions
```

The above [destructured assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) export might look a little strange to some.  What it is doing is exporting just the postAdded action which is created by the Redux Toolkit [createSlice function](https://redux-toolkit.js.org/api/createslice) which *generates action creators and action types that correspond to the reducers and state*.  The only part we need from that is the postAdded action.

No TypeScript changes need to be made for this update.

### Creating a post id on dispatch

A new post needs to have an id.  The tutorial shows how to generated a random unique ID with the Redux Toolkit nanoid function we can use for that.

AddPostForm.tsx

```ts
import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { postAdded } from './postsSlice'
```

You can now see how the id is created and the action is dispatched:

```ts
const onSavePostClicked = () => {
  if (title && content) {
    dispatch(
      postAdded({
        id: nanoid(),
        title,
        content,
      })
    );

    setTitle("");
    setContent("");
  }
};
```

### Missing styles

If you've been following along an got to this point, you might notice that when you run the app, the styles are missing for the form.

You can see what it should look like in the [completed example vanilla app](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/tutorial-steps?file=/src/App.js) which is running on codesandbox.io.

If you inspect the form, you can see the styles are coming from a file called primitiveui.css

The Redux Essentials tutorial doesn't mention anything about this.  That's understandable, as they are focusing on teaching Redux Toolkit features.  However, as a frontend developer, we always need to worry about style.  So I want to first of all find out how the styles broke, and then how to fix them.

My first guess is the missing styles have something to do with the changes made in the router and the way the components are now used in the App.tsx.

I will update this section once I've figured out what's going on and how to fix it.

### Unit testing the save added post function

After this change a post can be added and a unit test for the add can be created in the postsSlice.spec.ts.

Similar to the form, import the reducer:

postsSlice.spec.ts

```tsx
import { postAdded } from "./postsSlice";
```

Then create an expected posts array.  The reducer takes the initial state, and the postAdded action with the wanted content.

```ts
const expectedPostAddedState = [
  { id: "1", title: "First Post!", content: "Hello!" },
  { id: "2", title: "Second Post", content: "More text" },
  { id: "3", title: "test-title", content: "test-content" },
];
it('should handle increment', () => {
  const actualState = postsReducer(initialState, postAdded({
    id: "3",
    title: "test-title",
    content: "test-content",
  }));
  expect(actualState).toEqual(expectedPostAddedState);
});
```

Now we have some decent tests that cover some of the functionality added.

```txt
Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
```

## Summary

This is the end of step three.  I hope you have a good idea now of how to incorporate TypeScripts and unit testing into a React app using the Redux toolkit.

The commit for the above add post form work can be found [here](https://github.com/timofeysie/redux-typescript-example/commit/2d18b74728fe01bc8eb5b1c41b3a7d896b3787df).

In [the next step](https://redux.js.org/tutorials/essentials/part-4-using-data) the following will be covered:

- Creating a Single Post Page
- Editing Posts
- Updating Post Entries
- Users and Posts
- Sorting the Posts List
- Post Reaction Buttons

I will probably break these up into separate posts to keep each post focused on a specific topic.  For example the single post page code involves typing props and using the router.

Use the hashtag #ReactReduxTypescriptExample and the link below on Twitter for any comments or feedback.
