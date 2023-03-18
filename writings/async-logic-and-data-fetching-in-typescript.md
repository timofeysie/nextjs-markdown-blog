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

## Loading State

In [the next step](https://redux.js.org/tutorials/essentials/part-5-async-logic#loading-state-for-requests) the tutorial covers how to track loading states as a single enum value.  It actually shows a code snippet in Typescript for the firs time:

```js
{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```

In features/posts/postsSlice.js (postsSlice.ts) for us, add the initial state which replaces the current sample data with an empty array:

```js
const initialState = {
  posts: [],
  status: 'idle',
  error: null
}
```

Then we have to make the change to the structure of the state, so instead of the flat state:

```js
postAdded: {
  reducer(
    state,
    action: PayloadAction<Post>
  ) {
    state.push(action.payload);
  },
```

We have this:

```js
postAdded: {
  reducer(state, action) {
    state.posts.push(action.payload)
  },
```

This should give us now an empty array of posts, but there are errors.  All the post properties such as id, title and content have errors like this:

```txt
Property 'id' does not exist on type 'never'.ts(2339)
```

This is because now our initial state is not typed anymore.  Before, we had this:

```js
const initialState: Post[] = [ ... ]
```

Because there was only an array of posts on the state.  Now that our state has an array of posts, a status and an error, we will need a new interface for this.

To make these errors go away, we can use the hint given earlier about the loading state enum and create an interface:

```js
interface InitialState {
    posts: Post [];
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}
```

We can use it like this:

```js
const initialState: InitialState = {
    posts: [],
    status: "idle",
    error: null,
};
```

### Testing the implementation

If you have followed along from the counter example along to the creation of this app, you will know that I have created unit tests in Jest for each step.  Once upon a time I was a Java developer smitten with XP (extreme programming) which uses TDD (test driven development) as a method to create features.  However, there are a number of issues with this.

Currently the tests are breaking because the implementation has changed.  It might be great to have coverage of all the features, but no one wants to maintain old tests.  It might make sense to practice TDD when developing some complex business logic, but after it's working, those tests become a liability.

If coverage of features is what is needed, integration and end-to-end testing is the way to go.  If we had tested just adding a post, and that the post appears on the list, then that test wouldn't be failing now that the internal structure of the store is changing.

Of course, my goal was just to get more practice at writing tests, so no harm done.  I want to practice unit testing for TDD, but a tutorial is not TDD.  But to practice TDD in the wild, you need to know how to test all kinds of things.  So that practice has to come from somewhere.

I'm just bringing this up because I'm not going to be commenting out failing unit tests for now and implementing Cypress for testing soon.

## [Fetching Data with createAsyncThunk](https://redux.js.org/tutorials/essentials/part-5-async-logic#fetching-data-with-createasyncthunk)

The new Thunk added looks like this:

```js
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})
```

The createAsyncThunk function automatically dispatch loading state actions actions.  That's great!

The first argument is the prefix for the generated action types.

It's a Promise based response, but the API docs really show this:

```js
createAsyncThunk<any, void>(typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<any, void, AsyncThunkConfig>, options?: AsyncThunkOptions<void, AsyncThunkConfig> | undefined): AsyncThunk<...> (+1 overload)
```

I have to trust the description of what is going on within this magic.

*We typically write (an AJAX Promise) using the JS async/await syntax, which lets us write functions that use Promises while using standard try/catch logic instead of somePromise.then() chains.*

I have to say I like Promises.  Coming from Angular where we were expected to use RxJs for everything I thought overcomplicated things.  It's nice to know that now Angular has ditched RxJs for Signals which are a kind hook, or so I've heard.

In the dispatch action, we have an Typescript error to deal with:

```js
    useEffect(() => {
        if (postStatus === "idle") {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);
```

The fetchPosts() function shows this:

```txt
Argument of type 'AsyncThunkAction<any, void, AsyncThunkConfig>' is not assignable to parameter of type 'AnyAction'.ts(2345)
```

This is because the return type is not clear.  The easy way out is to use the evil *any*.

```js
export const fetchPosts: any = createAsyncThunk("posts/fetchPosts", async () => {
```

I'm not proud of this, but just trying to get this series done at this point, so corners need to be cut.

## Reducers and Loading Actions

The next step, [Reducers and Loading Actions](https://redux.js.org/tutorials/essentials/part-5-async-logic#reducers-and-loading-actions) is to handle these actions in the reducers.

The createSlice function creates our actions, and has an "extraReducers" functional argument that receives a "builder" parameter to handle async thunk actions.

Adding an action there looks like this:

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // omit existing reducers here
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})
```

I don't thing we need any Typescript-specific changes here.

Next up, we [display the loading states](https://redux.js.org/tutorials/essentials/part-5-async-logic#reducers-and-loading-actions) in the UI.

There is already a spinner component in the '../../components/Spinner' file.  We import that into the posts list component.

The tutorial shows adding a PostExcerpt that should really be in a separate file:

```js
const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
```

The post prop has an error: ```Binding element 'post' implicitly has an 'any' type.ts(7031)```

We need an interface for the props to fix this.  We can use the same interface that was created for the reaction buttons from the [last article](https://timothycurchod.com/writings/redux-essentials-app-in-typescript):

```js
interface Props {
    post: Post;
}
```

It's then used like this:

```js
const PostExcerpt = ({ post }: Props) => {
```

Both of these should ideally be in separate files.  But that can happen later during a refactor round.

Inside the PostsList functional component we create an error selector to use.

```js
  const error = useSelector(state => state.posts.error)
```

We need to add the state: RootState type as usual to that:

```js
  const error = useSelector(state: RootState => state.posts.error)
```

After implementing the error state and content in the posts list like this:

```js
export const PostsList = () => {
    const dispatch = useDispatch();

    const posts = useAppSelector(selectAllPosts);
    const orderedPosts = posts
        .slice()
        .sort((a: Post, b: Post) => b.date.localeCompare(a.date));

    const postStatus = useSelector((state: RootState) => state.posts.status);
    const error = useSelector((state: RootState) => state.posts.error);

    useEffect(() => {
        if (postStatus === "idle") {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;

    if (postStatus === "loading") {
        content = <Spinner text="Loading..." />;
    } else if (postStatus === "succeeded") {
        // Sort posts in reverse chronological order by datetime string
        const orderedPosts = posts
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date));

        content = orderedPosts.map((post) => (
            <PostExcerpt key={post.id} post={post} />
        ));
    } else if (postStatus === "failed") {
        content = <div>{error}</div>;
    }

    const renderedPosts = orderedPosts.map((post: Post) => {
        return (
            <article className="post-excerpt" key={post.id}>
                <h3>{post.title}</h3>
                <div>
                    <PostAuthor userId={post.user} />
                    <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content.substring(0, 100)}</p>
                <ReactionButtons post={post} />
                <Link to={`/posts/${post.id}`} className="button muted-button">
                    View Post
                </Link>
            </article>
        );
    });

    return (
        <section className="posts-list">
            <h2 data-testid="post-list-title">Posts</h2>
            <h2>Posts</h2>
            {content}
        </section>
    );
};
```

There is an error from the fetch:

```Unexpected token '<', "<!DOCTYPE "... is not valid JSON```

In the network tab, headers sections it shows:

Request URL: http://localhost:3000/fakeApi/posts
Request Method: GET
Status Code: 304 Not Modified
Preview: You need to enable JavaScript to run this app.

This is a pretty new error.  I didn't have an issue like this when I went through with the vanilla Javascript code.  Why would the Typescript version cause this kind of error?  Maybe something is not being transpiled?

There are plenty of StackOverflow hits for this kind of error, such as [this](https://stackoverflow.com/questions/50286927/i-am-getting-error-in-console-you-need-to-enable-javascript-to-run-this-app-r) which recommends putting this in the package.json: ```"proxy": "http://localhost:3000",```.  But then the error is slightly different.

Request URL: http://localhost:3000/fakeApi/posts
Request Method: GET
Status Code: 431 Request Header Fields Too Large

What we should get, as seen in the [live demo here](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/checkpoint-3-postRequests/?from-embed) is an array of posts like this:

```json
{
    "id": "Z9SIaQsvAdrzwvf5UlNLj",
    "title": "soluta facere neque",
    "date": "2023-03-09T00:27:20.943Z",
    "content": "Sequi sint molestias hic ad iure. Aspernatur officia eveniet hic qui exercitationem quis omnis minus et. Id maiores aut. Consequuntur molestias asperiores aut dolores natus. Sit facere est et dolores.\n \rLibero aut nihil enim. Voluptas dolores et. Sed a eveniet praesentium atque. Est natus et accusantium error odio eligendi esse exercitationem.\n \rNatus libero consequatur vitae reiciendis ab. Aliquam nemo qui alias autem eum. Dolorem aspernatur iste voluptatibus in sunt. Sunt non recusandae qui sint. Dolor totam non. Inventore laudantium cumque quae voluptatem qui.",
    "reactions": {
        "id": "LTo_Sq0uInSqw2ivYOgtT",
        "thumbsUp": 0,
        "hooray": 0,
        "heart": 0,
        "rocket": 0,
        "eyes": 0
    },
    "user": "4E5O6cJXWu5jma1QV50Z-"
}
```

It's time to consider that the fake api which is written in Javascript might not be working in our Typescript setting.

Check out this file: src\api\server.js

Changing that file extension to .ts reveals a nightmare of problems, starting with the first line such as:

```js
import { rest, setupWorker } from 'msw'
```

This would involve installing the types for this package.  That would be done like this:

```shell
npm install @types/msw
```

However, there are a huge number of errors in that file.  It could take a while to fix them, and some of them might be pretty tricky.  Is there a way to leave those .js file as is?

An answer on [this StackOverflow question](https://stackoverflow.com/questions/74766575/how-to-use-plain-javascript-react-component-in-a-typescript-react-project) says to put this in the tsconfig.json file: ```allowJs: true```.

Status Code: 431 Request Header Fields Too Large

It would be nice to have a simple solution like this.  Another thing I thought of would be to create a vanilla node.js app to run the server and client.

It would have been nice if I had thought about this problem before I started this whole Typescript conversion project.

Just trying the above npm command results in:

```shell
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@types%2fmsw - Not found
```

I'm not going to lie, this is a big unexpected problem.

There are three APIs needed:

```txt
/fakeApi/posts GET
/fakeApi/posts POST
/fakeApi/posts/:postId GET
/fakeApi/posts/:postId PATCH
/fakeApi/posts/:postId/comments GET
/fakeApi/posts/:postId/reactions POST
/fakeApi/notifications GET
/fakeApi/users GET
```

Quite a bit of work there no matter what we do.

The thing is, this is all about async data fetching with Typescript.  I could create a simple [Next.js](https://docs.nestjs.com/) backend for this app pretty easily.

I have an old Node.js app that I would like to upgrade, so it's not a bad idea.

I'm also interested in [MACH architecture](https://devops.com/introduction-to-mach-architecture/), which means a cloud based db solution.

MACH stands for:

- Microservices
- API-first
- Cloud-native
- Headless

It's pretty vague, and I'm wondering if Nest.js and say a Mongo db deployed on some free services fits with that?  We have our API, and just want crud functions to support it.

Since we're in to Typescript here, it's not a bad idea.  [Nest](https://docs.nestjs.com/techniques/database) *uses TypeORM because it's the most mature Object Relational Mapper (ORM) available for TypeScript. Since it's written in TypeScript, it integrates well with the Nest framework.*

The options for going forward with this article then would be:

1. Use .js files in a .ts project.
2. Convert server.js and client.ts to .ts.
3. Recreate the APIs in a Node.js backend.
4. End things here.
5. Raise an issue on the [Redux GitHub](https://github.com/reduxjs/redux-essentials-example-app/issues) and see if they have any ideas.

To start I have [raised an issue here](https://github.com/reduxjs/redux-essentials-example-app/issues/51) so stay tuned to see what happens there.

It was very nice for the maintainer [Mark Erikson](https://github.com/markerikson) to reply regarding the client fakeApi issue, as well as possible plans for a Typescript version:

*I actually did recently make the decision to convert the entire "Essentials" tutorial to be TS-first.  However, I don't yet have any idea when I'll be able to spend the time to do that :) I am kinda confused on the request error you're describing. That doesn't seem anything that would be related to TS at all - that's some kind of a request/URL mismatch.*

In the meantime, I decided to bite the bullet and create my own Typescript backend which can be used with the project.  Since I would eventually like to deploy the app after some changes, it can be used later for that.

[Here is the repo](https://github.com/timofeysie/flash) and I will be creating another article about how to implement all the API calls with that when they are done.

Now we can move on to the next part.

### [Reducers and Loading Actions](https://redux.js.org/tutorials/essentials/part-5-async-logic#reducers-and-loading-actions)

Coming soon.

## Useful links

Here are some links from the tutorial that I found useful when working on this article.

- [Redux docs: Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript): Examples of how to use Redux Toolkit, the Redux core, and React Redux with TypeScript
- [Redux Toolkit docs: TypeScript Quick start](https://redux-toolkit.js.org/tutorials/typescript): shows how to use RTK and the React-Redux hooks API with TypeScript
- [React+TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet): a comprehensive guide to using React with TypeScript
- [React + Redux in TypeScript Guide](https://github.com/piotrwitek/react-redux-typescript-guide): extensive information on patterns for using React and Redux with TypeScript

## Summary

Using selectors can help to hide implementations in the state.  Using them in Typescript is pretty easy.  Use the hashtag #ReduxEssentialsTypescript to reach and start a discussion.
