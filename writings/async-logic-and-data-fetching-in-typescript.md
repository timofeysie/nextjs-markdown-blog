---
title: "Async Logic and Data Fetching in TypeScript"
date: "2023-02-26"
og:
  description: "A detailed walk through of the official React Redux example app using TypeScript and unit testing"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- The Redux Essentials part 5 covers async Thunk usage.
- This article aims to convert the example app into TypeScript.

## Redux Essentials, Part 5: Async Logic and Data Fetching

[Step 5 of the Redux Essentials](https://redux.js.org/tutorials/essentials/part-5-async-logic) covers Async Logic and Data Fetching.

Previously I wrote about [converting the counter example from step 2](https://timothycurchod.com/writings/react-redux-typescript-counter-example) to use Typescript and adding unit tests in Jest.

From step 3 to 4 the tutorial covers creating a small social media feed app in React using vanilla JavaScript.  I wrote [a long article](https://timothycurchod.com/writings/redux-essentials-app-in-typescript) about how to convert that app into TypeScript and add unit testing with Jest.  This post is a continuation of that work.

Part 5 covers fetching and updating the posts and users data from an API.

## The mock API

The sample code uses and interesting [Mock Service Worker API tool](https://mswjs.io/) that's worth looking at for it's types, especially as we're all about Typescript here.

src\api\server.js

```js
export const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf('post'),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    date: String,
    content: String,
    reactions: oneOf('reaction'),
    comments: manyOf('comment'),
    user: oneOf('user'),
  },
  comment: {
    id: primaryKey(String),
    date: String,
    text: String,
    post: oneOf('post'),
  },
  reaction: {
    id: primaryKey(nanoid),
    thumbsUp: Number,
    hooray: Number,
    heart: Number,
    rocket: Number,
    eyes: Number,
    post: oneOf('post'),
  },
})
```

Interesting to see the comments property there.  As far as I know, comments on posts are not covered in any of the steps.

## Thunk vs Saga Middleware

Async logic is known as middleware in the React/Redux world.  Coming from the Angular world where services expose observables and [RxJs](https://angular.io/guide/rx-library) provides all the operators you could ever want to do the same thing, it can take a while to get the hang of how the same things are done in Redux.

There are different kinds of middleware.  A popular choice is [Redux Sagas](https://redux-saga.js.org/).  If you're interested in the difference you can read [this blog](https://blog.logrocket.com/redux-toolkits-new-listener-middleware-vs-redux-saga/) on the subject.

Generally, thunks are for logic that requires talking to the store, and listeners if the app needs to react to actions or state changes. If the default functionalities in RTK does not meet a use case, then sagas would be used.  I'm not personally aware of any use cases that would require a saga instead of a thunk, but I will let you know when I run in to one.

The recommended library now redux-thunk, and that's what is covered in the Redux Essentials.  It *lets you write plain functions that may contain async logic directly*.  The Toolkit provides configureStore to set up thunks.

## [Loading posts](https://redux.js.org/tutorials/essentials/part-5-async-logic#loading-posts)

In this part, the following will be accomplished:

- Replace hardcoded sample data in the postsSlice initial state with an empty array of posts and fetch a list of posts from the mock server.
- Change the postsSlice state from an array of posts to an object a posts array and loading state fields to keep track of the API request state.
- Components that read posts from state.posts need to change to match the new data.

### Reusable selector functions in the slice

In the [Extracting Posts Selectors](https://redux.js.org/tutorials/essentials/part-5-async-logic#extracting-posts-selectors) section, we are shown how to make selectors which can hid the kind of changes we intend to makes in the state.  The tutorial puts it this way:

*It would be nice if we didn't have to keep rewriting our components every time we made a change to the data format in our reducers. One way to avoid this is to define reusable selector functions in the slice files, and have the components use those selectors to extract the data they need instead of repeating the selector logic in each component. That way, if we do change our state structure again, we only need to update the code in the slice file.*

In vanilla Javascript, this is what it is talking about:

```js
const posts = useSelector((state) => state.posts)
```

The line above is described as: *the inlined anonymous selectors we wrote directly inside of useSelector*.  We have to know that posts is a direct property on the state.  We cant move that inside another object for example without breaking the app.  Using a selector, the posts can be gotten now like this:

```js
const posts = useSelector(selectAllPosts)
```

Likewise with finding a post:

```js
const post = useSelector(state => state.posts.find(post => post.id === postId))
```

Can be:

```js
const post = useSelector(state => selectPostById(state, postId))
```

You can also create "memoized" selectors that can help improve performance later on.

### Converting to Typescript

Lets go through the code changes needed to implement the changes listed above and covert them to Typescript.

In the features/posts/postsSlice.js file (which for Typescript uses the .ts file extension: postsSlice.tsx), two selectors are added at the bottom of the file:

```js
export const selectAllPosts = state => state.posts

export const selectPostById = (state, postId) =>
  state.posts.find(post => post.id === postId)
```

There are a few TS errors there, the first being on the state in the first line:

```txt
Parameter 'state' implicitly has an 'any' type.ts(7006)
```

This is a little strange, as so far in the app sate hasn't had to be typed anywhere else.  The easy way out looks like this:

```js
 (state: any) => state.posts
```

By the way, my Prettier formatting plugin added the brackets around the state parameter there for me, as it's considered a best practice.  I highly recommended using Prettier to ensure all developers are on the same page when it comes to formatting.

We already have a type for this that is created by the Redux Toolkit configureStore function in the state.ts file.  It is exported like this:

```js
export type RootState = ReturnType<typeof store.getState>;
```

So all we have to do is import that and use it in our code:

```js
import { RootState } from "../../app/store";
...
export const selectAllPosts = (state: RootState) => state.posts;

export const selectPostById = (state: RootState, postId: string) =>
    state.posts.find((post) => post.id === postId);
```

The postId has a similar error, which is why it's typed also.  It is usually a number, but in a string format.  An Id is often a string of letters and numbers, so that's fine.

Next, in the features/posts/PostsList.js which in our project is PostsList.tsx, we can use that selector.  The tutorial shows it used like this:

```js
const posts = useAppSelector((state) => state.posts);
```

But if you've been following along with the earlier steps in this app, we use the custom typed useAppSelector like this:

```js
const posts = useAppSelector(selectAllPosts);
```

In the SinglePostPage.tsx we do the same thing:

```js
const post = useSelector(state => selectPostById(state, postId))
```

Using the RootState again (and Prettier formatting), this becomes:

```js
  const postId = params.postId 

  const post = useAppSelector((state: RootState) =>
      selectPostById(state, postId)
  );
```

But now, there is a new issue with postId:

Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.ts(2345)

To fix this we can add a type guard to ensure that postId is not undefined before passing it to the selectPostById function.  But for this case, we can do something like this:

```js
   const postId = params.postId ?? "";

  const post = useAppSelector((state: RootState) => 
      selectPostById(state, postId)
  );
```

The same thing is done in the EditPostForm component.  Now, nothing has really changed in the app.  Just we have some reusable selectors.  Regarding this, the tutorial says to start an app with no selectors and *add some later when you find yourself looking up the same values in many parts of your application code.*

Stay tuned.  This article will be updated with [the next step](https://redux.js.org/tutorials/essentials/part-5-async-logic#loading-state-for-requests) on loading state soon!

## Useful links

Here are some links from the tutorial that I found useful when working on this article.

- [Redux docs: Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript): Examples of how to use Redux Toolkit, the Redux core, and React Redux with TypeScript
- [Redux Toolkit docs: TypeScript Quick start](https://redux-toolkit.js.org/tutorials/typescript): shows how to use RTK and the React-Redux hooks API with TypeScript
- [React+TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet): a comprehensive guide to using React with TypeScript
- [React + Redux in TypeScript Guide](https://github.com/piotrwitek/react-redux-typescript-guide): extensive information on patterns for using React and Redux with TypeScript

## Summary

Using selectors can help to hide implementations in the state.  Using them in Typescript is pretty easy.  Use the hashtag #ReduxEssentialsTypescript to reach and start a discussion.
