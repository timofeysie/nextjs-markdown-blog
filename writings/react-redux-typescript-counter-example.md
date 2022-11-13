---
title: "The React Redux Counter Example with TypeScript"
date: "2022-11-13"
og:
  description: "A detailed walk through of the official React Redux counter example using TypeScript"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

This article covers the official React Redux counter example using TypeScript code and the differences to the vanilla Javascript example.

It discusses testing the counter example to lay the ground work for applying TypeScript and TDD to the official Reducx social media feed app example project in a future post.

## React Redux Counter Example

The Redux Essentials tutorial has 7 pages.

In [Part 1: Redux Overview and Concepts](https://redux.js.org/tutorials/essentials/part-1-overview-concepts), there is an overview of Redux and the key concepts of State Management, Immutability, Terminology and Data Flow.

The next page [Redux App Structure](https://redux.js.org/tutorials/essentials/part-2-app-structure) goes over the classic counter app which I have discussed previously in my blog for Angular, but not React.

In [Part 3: Basic Redux Data Flow](https://redux.js.org/tutorials/essentials/part-3-data-flow) they start showing how to build a small social media feed app.  This will be covered in another blog post where I apply Typescript and TDD to that process.

This article is about parts 1 & 2 as they provide the foundation for the next parts.

We will build a counter application to add or subtract from a number via buttons.

The app is begun in the tutorial like this:

```shell
npx create-react-app redux-essentials-example --template redux
```

This command will create the counter example for us using vanilla Javascript.  Next, we will explore using the Typescript version of this code.

### Redux + TypeScript template example

The command we will use is shown [in the getting started section](https://redux-toolkit.js.org/introduction/getting-started):

```shell
npx create-react-app my-app --template redux-typescript
```

Bear in mind, this little nugget takes some time.  It took about five minutes on my trusty 2019 Dell laptop.  Here is the output:

```shell
npx: installed 67 in 10.152s
Creating a new React app in C:\Users\timof\repos\timofeysie\react\redux\counter-example.
Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts with cra-template-redux-typescript...
...
+ react-scripts@5.0.1
+ react@18.2.0
+ react-dom@18.2.0
+ cra-template-redux-typescript@2.0.0
added 1406 packages from 624 contributors in 215.586s
Initialized a git repository.
Installing template dependencies using npm...
npm WARN @apideck/better-ajv-errors@0.3.6 requires a peer of ajv@>=8 but none is installed. You must install peer dependencies yourself.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.2 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
+ @types/react-dom@18.0.8
+ @types/react@18.0.25
+ @testing-library/jest-dom@5.16.5
+ @testing-library/user-event@14.4.3
+ @types/jest@27.5.2
+ web-vitals@2.1.4
+ @types/node@17.0.45
+ typescript@4.8.4
+ @testing-library/react@13.4.0
+ react-redux@8.0.5
+ @reduxjs/toolkit@1.9.0
added 62 packages from 89 contributors and updated 1 package in 31.108s
We detected TypeScript in your project (src\App.test.tsx) and created a tsconfig.json file for you.
Your tsconfig.json has been populated with default values.
Removing template package using npm...
npm WARN @apideck/better-ajv-errors@0.3.6 requires a peer of ajv@>=8 but none is installed. You must install peer dependencies yourself.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.2 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
removed 1 package and audited 1471 packages in 11.501s
found 1 high severity vulnerability
  run `npm audit fix` to fix them, or `npm audit` for details
Created git commit.
Success! Created counter-example at C:\Users\timof\repos\timofeysie\react\redux\counter-example
Inside that directory, you can run several commands:
...
Happy hacking!
```

Now we have an app with .ts files instead of .js files, and .tsx instead of .jsx.

Run the app with 'npm start' and we see the counter example already working.

After this is the step 2 tutorial there is a section on [Using the Counter App with the Redux DevTools](https://redux.js.org/tutorials/essentials/part-2-app-structure#using-the-counter-app).

A section on [Application Contents and structure](https://redux.js.org/tutorials/essentials/part-2-app-structure#application-contents).

A discussion of app/store.js and [Creating Slice Reducers and Actions](https://redux.js.org/tutorials/essentials/part-2-app-structure#creating-slice-reducers-and-actions)
 shows the features/counter/counterSlice.js

This goes over the Rules of Reducers, Reducers and Immutable Updates and shows the Redux Toolkit's createSlice function which lets you write immutable updates an easier way: *createSlice uses a library called Immer inside. Immer uses a special JS tool called a Proxy to wrap the data you provide, and lets you write code that "mutates" that wrapped data. But, Immer tracks all the changes you've tried to make, and then uses that list of changes to return a safely immutably updated value*

It contrasts a  handwrittenReducer with a reducerWithImmer which is all of one line.

Writing Async Logic with Thunks shows the incrementAsync example code. Here is the vanilla Javascript file:

```js
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
```

Here is the Typescript version we have:

```ts
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
```

createAsyncThunk is part of the [Redux toolkit](https://redux-toolkit.js.org/api/createAsyncThunk).  We don't get to see that as part of this tutorial trail until [Part 5: Async Logic and Data Fetching](https://redux.js.org/tutorials/essentials/part-5-async-logic).

There is also a section on the Counter.js component file.

Now, time for the tests.  

## Unit Tests

Out of the box we have a the usual src\App.test.tsx as well as a specification test src\features\counter\counterSlice.spec.ts file.

Run 'npm test' and we see this output:

```shell
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        4.246 s
```

In the usual src\App.test.tsx there is already a TypeScript error on this line:

```ts
src\App.test.tsx

```ts
expect(getByText(/learn/i)).toBeInTheDocument();
```

Mouseover of getByText and see this:

```txt
const getByText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement
Avoid destructuring queries from `render` result, use `screen.getByText` insteadeslinttesting-library/prefer-screen-queries
```

We can fix that error by doing this:

```ts
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByText("Learn")).toBeInTheDocument();
```

This should be the first commit we make for this new repo:

```shell
git add .
git commit  -m "avoiding destructuring queries from render result in the App.test.tsx and using screen.getByText instead"
```

The src\features\counter\counterSlice.spec.ts file:

```ts
describe('counter reducer', () => {
  const initialState: CounterState = {
    value: 3,
    status: 'idle',
  };
  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });
```

The above expect line is testing what happens in the Counter.tsx file on the button:

```tsx
onClick={() => dispatch(increment())}
```

### Root State and Dispatch Types​

The count from the store is created like this:

```tsx
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCount,} from './counterSlice';
export function Counter() {
  const count = useAppSelector(selectCount);
```

In the hooks.ts file:

```ts
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Compare this to the vanilla Javascript version which looks like this:

```js
import { useSelector } from 'react-redux';
import { selectCount } from './counterSlice';
export function Counter() {
  const count = useSelector(selectCount);
```

As you can see, there is now an extra step there in the useSelector process.

TypedUseSelectorHook is discussed in the [Usage with TypeScript](https://react-redux.js.org/using-react-redux/usage-with-typescript) section of the React Redux website.

Since React-Redux is written in TypeScript now, this helper function as the docs say make it *easier to write typesafe interfaces between your Redux store and your React components.*

So the useAppDispatch and useAppSelector are there to *create pre-typed versions of the useDispatch and useSelector hooks for usage in your application.*  This is done in a separate file as they are variables, not types, and this file allows you to import them into any component file that needs to use the hooks and avoids potential circular import dependency issues.

There is also a section called [Typing Hooks Manually​](https://react-redux.js.org/using-react-redux/usage-with-typescript) which I wont cover.

### Store types

One other thing that is different is that there are types exported in the app/store.ts file:

```ts
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
```

This are not in the vanilla Redux example.  About this the above link says: *extract the RootState type and the Dispatch type so that they can be referenced as needed. Inferring these types from the store itself means that they correctly update as you add more state slices or modify middleware settings.*

There is a discussion of using connect with hooks which the counter example doesn't have.  At the end there are some helpful links which will become important in the next blog post about the small social media feed app that is started in part 3.

- [Redux docs: Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript): Examples of how to use Redux Toolkit, the Redux core, and React Redux with TypeScript
- [Redux Toolkit docs: TypeScript Quick start](https://redux-toolkit.js.org/tutorials/typescript): shows how to use RTK and the React-Redux hooks API with TypeScript
- [React+TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet): a comprehensive guide to using React with TypeScript
- [React + Redux in TypeScript Guide](https://github.com/piotrwitek/react-redux-typescript-guide): extensive information on patterns for using React and Redux with TypeScript
