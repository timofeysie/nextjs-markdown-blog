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

The tutorial shows adding a PostExcerpt that should really be in a separate file, but in this case it's a separate component which would make it easy to extract later:

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

### Fetching error

After the changes for this section there is an error from the fetch when running the app:

```Unexpected token '<', "<!DOCTYPE "... is not valid JSON```

In the network tab, headers sections it shows:

```err
Request URL: http://localhost:3000/fakeApi/posts
Request Method: GET
Status Code: 304 Not Modified
Preview: You need to enable JavaScript to run this app.
```

This is a new error for me.  I didn't have an issue like this when I went through with the vanilla Javascript code.  Why would the Typescript version cause this kind of error?  Maybe something is not being transpiled?

There are plenty of StackOverflow hits for this kind of error, such as [this](https://stackoverflow.com/questions/50286927/i-am-getting-error-in-console-you-need-to-enable-javascript-to-run-this-app-r) which recommends putting this in the package.json: ```"proxy": "http://localhost:3000",```.  But then the error is slightly different.

```err
Request URL: http://localhost:3000/fakeApi/posts
Request Method: GET
Status Code: 431 Request Header Fields Too Large
```

What we should get, as seen in the [live demo here](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/checkpoint-3-postRequests/?from-embed) is an array of posts like this:

```json
{
    "id": "Z9SIaQsvAdrzwvf5UlNLj",
    "title": "soluta facere neque",
    "date": "2023-03-09T00:27:20.943Z",
    "content": "Sequi sint molestias hic ad iure ... voluptatem qui.",
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

Check out this file: ```src\api\server.js```

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

It would be nice to have a simple solution like this, but it doesn't work.

Another thing I thought of would be to create a vanilla node.js app to run the server and client.

It would also have been nice if I had thought about this problem before I started this whole Typescript conversion project.

Just trying the above npm command results in:

```shell
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@types%2fmsw - Not found
```

I'm not going to lie, this is a big unexpected problem.

These are APIs the app depends on:

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

The thing is, this is all about async data fetching with Typescript.  I *could* create a simple [Nestjs](https://docs.nestjs.com/) backend for this app pretty easily.

I have an old Node.js app that I would like to upgrade, so it's not a bad idea getting some practice in for that.

I'm also interested in [MACH architecture](https://devops.com/introduction-to-mach-architecture/), which means a cloud based db solution like a hosted database.

FYI, MACH stands for:

- Microservices
- API-first
- Cloud-native
- Headless

It's pretty vague, and I'm wondering if Nest.js and say a Mongo db deployed on some free cloud services fits in with MACH.  We have our API, and just want CRUD functions to support it.

Since we're in to Typescript here, it's not a bad idea.  [Nest](https://docs.nestjs.com/techniques/database) *uses TypeORM because it's the most mature Object Relational Mapper (ORM) available for TypeScript. Since it's written in TypeScript, it integrates well with the Nest framework.*

So as it is the options for going forward with this article then would be:

1. Use .js files in a .ts project.
2. Convert server.js and client.ts to .ts.
3. Recreate the APIs in a Node.js backend.
4. End things here.
5. Raise an issue on the [Redux GitHub](https://github.com/reduxjs/redux-essentials-example-app/issues) and see if they have any ideas.

To start I have [raised an issue here](https://github.com/reduxjs/redux-essentials-example-app/issues/51) so stay tuned to see what happens there.

It was very nice for the maintainer [Mark Erikson](https://github.com/markerikson) to reply regarding the client fakeApi issue, as well as possible plans for a Typescript version:

*I actually did recently make the decision to convert the entire "Essentials" tutorial to be TS-first.  However, I don't yet have any idea when I'll be able to spend the time to do that :) I am kinda confused on the request error you're describing. That doesn't seem anything that would be related to TS at all - that's some kind of a request/URL mismatch.*

In the meantime, I decided to bite the bullet, go with option #3 and create my own Typescript backend which can be used with the project.  Since I would eventually like to deploy the app after some changes, it can be used later for that.

[Here is the repo](https://github.com/timofeysie/flash) and I will be creating another article about how to implement all the API calls with that when they are done.

Now we can move on to the next part.

## [Loading Users](https://redux.js.org/tutorials/essentials/part-5-async-logic#loading-users)

The next step involves fixing the fact that the posts all have "Unknown author" instead of the user name.  To fix this the app needs to fetch the users on application start.

This also means that for the backend app the CRUD endpoints for a users API will have to be scaffolded.  Using Nestjs with TypeORM makes that super easy.

Adding a user interface and using fetchUsers with createAsyncThunk as well as adding that action to the extraReducers to mutate the state looks like this:

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { User } from './User';

const initialState: User [] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await client.get("/fakeApi/users");
    return response.data;
});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default usersSlice.reducer;
```

The builder returns the action.payload directly thanks to Immer which has two possibilities here:

A. mutate the existing state value (which here was an empty array)
B. return a new result (replace the existing state completely)

If we return a new value, that will replace the existing state completely with whatever we return. (Note that if you want to manually return a new value, it's up to you to write any immutable update logic that might be needed.)

The tutorial points out we could use ```state.push(...action.payload)``` to mutate but here we want to replace the users with the server response.

Then, in the src\index.tsx we import that action at dispatch it there.

### Scaffolding the users CRUD API

With the Nestjs CLI, it's as easy as this:

```txt
> nest generate resource
? What name would you like to use for this resource (plural, e.g., "users")? users
? What transport layer do you use? REST API
? Would you like to generate CRUD entry points? Yes
CREATE src/users/users.controller.ts (894 bytes)
CREATE src/users/users.controller.spec.ts (566 bytes)
CREATE src/users/users.module.ts (247 bytes)
CREATE src/users/users.service.ts (609 bytes)
CREATE src/users/users.service.spec.ts (453 bytes)
CREATE src/users/dto/create-user.dto.ts (30 bytes)
CREATE src/users/dto/update-user.dto.ts (169 bytes)
CREATE src/users/entities/user.entity.ts (21 bytes)
UPDATE src/app.module.ts (1122 bytes)
```

Then we need to edit these four files:

1. posts.entity.ts
2. posts.module.ts
3. posts.service.ts
4. posts.controller.ts

The user interface is super simple:

```js
export interface User {
  id: any;
  name: string;
}
```

The entity file looks like this:

```js
@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;
}
```

The ObjectIdColumn decorator will create an ID for us, so that doesn't have to be in the POST to create a user.

Next the entity is imported into the user module.  It can't get any more Angular than this (Angular may well yet survive on the server):

```js
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  ...
})
```

The service provides the CRUD framework:

```js
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: any) {
    return this.usersRepository.findOne(id);
  }

  update(id: any, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: any) {
    return this.usersRepository.delete(id);
  }
}
```

Again with the Angular.  If you think classes are gross, this option may not be for you.

A note on [decorators](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators), these have actually just been added to TypeScript 5, so not a bad thing getting used to them if you're interested in Typescript.

The controller doesn't really need to be modified much at all.  Mainly the ids might be a combination of numbers and letters, so we do this:

```js
  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.usersService.findOne(id);
  }
```

Then Bob is a close family relative.  With [Northflank](https://northflank.com/), we just make a commit and push to the master branch and create some Postman test calls to check it once the build is done.

A little house keeping such as adding some users, deleting the old posts with random ids, adding new posts with actual ids, and then we can test out the user fetch.  It all looks good, and again, Bob is part of the family.  Of course, there is a lot of magic going on behind the scenes here.  If you run into problems, well, no one knows Bob and your on your own.  That's why sometimes boilerplate code some sometimes be a good thing.

## [Adding New Posts](https://redux.js.org/tutorials/essentials/part-5-async-logic#loading-users)

make an API call that will create the new post

we send a request body like { title, content, user: userId }

the server will generate an IDs date and return the completed post.

```js
export const addNewPost = createAsyncThunk(
    "posts/addNewPost",
    // The payload creator receives the partial `{title, content, user}` object
    async (initialPost) => {
        // We send the initial data to the fake API server
        const response = await axios.get(API_URL+"/posts", initialPost);
        // The response includes the complete post object, including unique ID
        return response.data;
    }
);
```

The initialPost arg causes this error: ```Argument of type 'void' is not assignable to parameter of type 'AxiosRequestConfig<any> | undefined'.ts(2345)```

The type for the dispatch looks like this:

```js
createAsyncThunk<any, void>(typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<any, void, AsyncThunkConfig>, options?: AsyncThunkOptions<void, AsyncThunkConfig> | undefined): AsyncThunk<...> (+1 overload)
```

```js
  await dispatch(
      addNewPost({ title, content, user: userId })
  ).unwrap();
```

Argument of type 'AsyncThunkAction<any, any, AsyncThunkConfig>' is not assignable to parameter of type 'AnyAction'.ts(2345)

We already have a ThunkAction which can be used to type the dispatch like this in the store.ts file:

```js
export type AppDispatch = typeof store.dispatch;
```

It's used like this:

```js
import { ThunkAction } from "redux-thunk";
...
const dispatch = useDispatch<AppDispatch>();
```

There is good discussion on the official [Type Checking Redux Thunks](https://redux.js.org/usage/usage-with-typescript#type-checking-redux-thunks) guide with a more in-depth solution shown.

This will wrap up part five.  You can find all the code in the example app [repo part-5-async-login-and-data-fetching branch](https://github.com/timofeysie/redux-typescript-example/tree/part-5-async-login-and-data-fetching).

## Part 6: Performance and Normalizing Data

Despite the title of this article being for part 5, I think it's easier to continue with part six here rather than start with a new article.  Honestly, the rug has been pulled out from under this project by the React teams new documentation which is now not recommending using create-react-app anymore, which is how this project was started.  This means that the Redux team will have to follow suit and update their documentation to account for this, meaning the days are numbered for this project as a demonstration of best practices.

In this section, [Redux Essentials, Part 6: Performance and Normalizing Data](https://redux.js.org/tutorials/essentials/part-6-performance-normalization), we will be covering the following.

- Memoize selector functions to optimize performance
- Optimize React component rendering with Redux
- Normalization (no duplication) of data state structure, and keeping items stored in a lookup table by item ID
- createEntityAdapter API helps manage normalized data in a slice

Feature-wise, this will include:

1. add a page to show the list of all users
2. add a page to show all posts by a specific user.
3. notifications to send a message, leave a comment, or reacted to a posts

If you want to see the finished project (in Javascript not Typescript), you can [open the official repo in a code sandbox here](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/checkpoint-4-entitySlices/?from-embed).

### [Adding User Pages](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#adding-user-pages)

Here a new <UsersList> component is added to the user feature.

- features/users/UsersList.js -> features/users/UsersList.tsx

If you are wondering why we don't use the ".ts" file extension, try that out and you would see errors like this on ending tags: ```Unterminated regular expression literal.ts(1161)```

To support the user list component, we add some selectors.  This will require typing with the root state:

```js
import { RootState } from "../../app/store";
...
export const selectAllUsers = (state: RootState) => state.users;
```

- features/users/UserPage.js -> UserPage.tsx

Some usual issues here with the props and state:

```js
export const UserPage = ({ match }) => {
    const { userId } = match.params;

    const user = useSelector((state) => selectUserById(state, userId));

    const postsForUser = useSelector((state) => {
        const allPosts = selectAllPosts(state);
```

The TS error on match is: ```Binding element 'match' implicitly has an 'any' type.ts(7031)```

When you see this kind of error on a component prop, you know that you will need an interface for it.  I'm not sure about the match type at this point, so will start of with the ominous ```any```:

```js
interface UserPageProps {
    match: any | undefined;
}

export const UserPage = ({ match }: UserPageProps) => { ... }
```

Next, the state variables have this error: ```(parameter) state: unknown - Argument of type 'unknown' is not assignable to parameter of type '{ counter: CounterState; posts: InitialState; users: User[]; }'.ts(2345)```

That is also solved by importing and using the root state type:

```js
    const user = useSelector((state: RootState) => selectUserById(state, userId));

    const postsForUser = useSelector((state: RootState) => { ... })
```

One last issue is that user has this error: ```const user: User | undefined - 'user' is possibly 'undefined'.ts(18048)```

```html
<h2>{user.name}</h2>
```

We can fix that with [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

Next, the routes need to be added.  Here is the react-router-dom version 5 code shown:

```js
<Route exact path="/users" component={UsersList} />
<Route exact path="/users/:userId" component={UserPage} />
```

Here is what we need for version 6:

```js
<Route path="/users" element={<UsersList />} />
<Route path="/users/:userId" element={<UserPage />} />
```

However, there is still an error on the user page: ```Property 'match' is missing in type '{}' but required in type 'UserPageProps'.ts(2741)
UserPage.tsx(10, 5): 'match' is declared here.```

One solution to this would be to make the match prop optional in the interface like this:

```js
interface UserPageProps {
    match?: any | undefined;
}
```

The users list works, but the user detail page has this error:

```err
UserPage.tsx:14 Uncaught TypeError: Cannot read properties of undefined (reading 'params')
    at UserPage (UserPage.tsx:14:1)
    at renderWithHooks (react-dom.development.js:16305:1)
```

I've forgotten that also with the change of the links in the React DOM router, there are changes to how the parameters are handled.  Similar to what was done in the SinglePostPage.tsx component, we can remove our props interface and use the useParams hook like this:

```js
export const UserPage = () => {
  const params = useParams();
  const userId = params.userId ?? "";
```

And then both new pages work.

Next up, [Adding Notifications](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#adding-notifications).

### Notifications

The [Notifications Slice](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#notifications-slice) section starts off with creating the notifications directory and adding the slice:

- features/notifications/notificationsSlice.js -> notificationsSlice.ts

There are a few Typescript errors in the extra reducers section.

```js
extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
        state.push(...action.payload);
        // Sort with newest first
        state.sort((a, b) => b.date.localeCompare(a.date));
    });
},
```

If you mouse over the red-squiggly line over state, you will see this error: ```Argument of type 'any' is not assignable to parameter of type 'never'.ts(2345)  No quick fixes available```

According to [this StackOverflow answer](https://stackoverflow.com/questions/58823346/type-any-is-not-assignable-to-type-never) by noy having an [index signature](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) on the type.  The solution shown is to use a computed property name.  I've seen this syntax before but can never remember the name that they go by.  It looks like this:

```js
const newState: SettingsState = { ...state, [action.parameter]: action.value };
```

Our situation is a little different than that, so not sure how to apply that to ```...action.payload```.

Since we live in a ChatGPT world at the moment, I thought it would be worth asking, and the solution it gives looks interesting:

```js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  date: string;
  message: string;
}

interface NotificationsState extends Array<Notification> {}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [] as NotificationsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state: NotificationsState, action: PayloadAction<Notification[]>) => {
      state.push(...action.payload);
      state.sort((a, b) => b.date.localeCompare(a.date));
    });
  },
});
```

The payload action type from the tool kit has been used twice already in the app.  Once in the counter slice and once in the post slice:

```js
postAdded: {
    reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
    },
    ...
}
```

It's worth seeing if this will work.

What it is suggesting is replacing this:

```js
(state, action) => { ... })
```

with this:

```js
(state: NotificationsState, action: PayloadAction<Notification[]>) => { ... })
```

The only other error then requires using the RootState for the reducer.

After this however, some new errors arise in the reducer:

```js
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (_, { getState }) => {
        const allNotifications = selectAllNotifications(getState());
        const [latestNotification] = allNotifications;
        const latestTimestamp = latestNotification
            ? latestNotification.date
            : "";
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        );
        return response.data;
    }
);
```

The ```getState()``` call has this error: ```Argument of type 'unknown' is not assignable to parameter of type '{ counter: CounterState; posts: InitialState; users: User[]; notifications: never[]; }'.ts(2345)```

And the ```latestNotification.date``` has this error: ```Property 'date' does not exist on type 'never'.ts(2339)```

Just pasting in the fetchNotifications above to prepare ChatGPT for the prompt shows that it already understands the error that I'm about to tell it about.

*It looks like the errors you're seeing may be related to the use of selectAllNotifications. This function is likely a selector that's defined using the createSelector function from the reselect library.  To fix this error, you'll need to make sure that selectAllNotifications is typed correctly. You can define a type for the return value of the selector using the ReturnType utility type from TypeScript. Here's an example:*

```js
export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  {
    getState: () => RootState;
  }
>("notifications/fetchNotifications", async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification ? latestNotification.date : "";
  const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`);
  return response.data;
});
```

That's a pretty bizarre type!  However, it gives a new error: ```ype '{ getState: () => { counter: CounterState; posts: InitialState; users: User[]; notifications: never[]; }; }' has no properties in common with type 'AsyncThunkConfig'.ts(2559)```

It's solution to that gets even worse.  But pointing this out, ChatGPT gives us this:

```js

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  {
    state: RootState;
  }
>("notifications/fetchNotifications", async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification ? latestNotification.date : "";
  const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`);
  return response.data;
});
```

Now we only have the error on the .date.  After a bit more back and forth with ChatGPT, it ends up producing a more simplified version of the above.  I created a specific commit to preserve the recommended changes [here](https://github.com/timofeysie/redux-typescript-example/commit/db980347e7f7ad8147497dd1f660cbe268dcf5f5).

There are now two interfaces:

```js
interface Notification {
    id: any;
    user: string;
    date: string;
    message: string;
}

export type AsyncThunkConfig = {
    state: RootState;
    rejectValue: {
        error: Error;
    };
    extra: {
        jwt: string;
    };
};
```

This:

```js
const allNotifications = selectAllNotifications(getState());
```

becomes this:

```js
const allNotifications = (getState() as RootState).notifications;
```

This:

```js
initialState: [],
```

becomes this:

```js
const allNotifications = (getState() as RootState).notifications;
```

Only time will tell if this will work, because first the backend CRUD actions for notifications will have to go in, and the feature needs to go into the UI.

Here is the fetch post thunk:

```js
export const fetchPosts: any = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
        const response = await axios.get(API_URL+"/posts");
        return response.data;
    }
);
```

Here again in the fetch notifications thunk:

```js
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (_, { getState }) => {
        const allNotifications = (getState() as RootState).notifications;
        const [latestNotification] = allNotifications;
        const latestTimestamp = latestNotification
            ? latestNotification.date
            : "";
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        );
        return response.data;
    }
);
```

Quite a but going on there.  There is an in-depth discussion of the second argument to our payload creator in fetchNotifications thunk which is a thunkAPI object that can contain *several useful functions and pieces of information*.  Have a read about that [here](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments) if you want.

### The notifications list

Next we add a new <NotificationsList> component.  No Typescript specific changes are needed here apparently.

When we add the link to the nav bar, there is some change needed.

```js
const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
};
```

ChatGPT says: *To resolve this error, you can add a type assertion to the dispatch() call to let TypeScript know that you are certain that fetchNotifications() returns an AnyAction:*

```js
const fetchNewNotifications = () => {
    dispatch(fetchNotifications() as any);
};
```

Interesting to see it recommend the ```any```, but it's OK with me at this point to get on with it.

Next, add a link to the App.tsx, which again looks a little different from the DOM router version 6:

```js
<Route path="/notifications" element={<NotificationsList />} />
```

This is the end of the section for Javascript, but for us, we need to add the CRUD operations to the back end.

For now that can go [in the backend repo README](https://github.com/timofeysie/flash).

You can find the full changes done in [this commit](https://github.com/timofeysie/flash/commit/c9d5ce28dc528f4b0aea81c13ca51a7b35a21568).

And the fetch notifications works on the first go.  I must be getting the hang of this.

The messages keep getting added to the list on each fetch, but I think making sure that doesn't happen is coming up later in this section.

### [Showing New Notifications](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#showing-new-notifications)

Here we implement a feature to show the count of unread notifications as a badge on the notifications tab in the navbar, and display new notifications in a different color.

Just when the notifications CRUD API was working fine, now we need to add these two members to support this functionality:

```js
read: boolean;
isNew: boolean;
```

Shouldn't be much of an issue.  I think we just have to update the entity file.

*Our fake API is already sending back the notification entries with isNew and read fields, so we can use those in our code.*

I actually don't see this is the [live app](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/checkpoint-4-entitySlices/?from-embed) linked to at the end of the tutorial.

This is what I see being returned:

```json
{
    "id": "5lCcHekrHiakOAVjnp_kF",
    "date": "2023-04-01T05:13:44.982Z",
    "message": "says hi!",
    "user": "fK8j7R5hGgmSKMIJsRXKH"
}
```

Not sure what to think, so just move on with the tutorial.

There are no changes needed when updating the allNotificationsRead selector.

The next issue is when adding the selector to the NotificationsList component.

```js
import classnames from "classnames";
```

Classnames has not been used before in the app, so causes this error: ```Cannot find module 'classnames' or its corresponding type declarations.ts(2307)```.

This [npm package](https://www.npmjs.com/package/classnames) is described as a *simple JavaScript utility for conditionally joining classNames together.*

This article is about Redux, but as a front end dev we should never avoid styling issues.  It's used like this:

```js
const notificationClassname = classnames('notification', {
  new: notification.isNew
})
```

There is one more issue with the changes from this section.  The allNotificationsRead action has a TS error.

```js
useLayoutEffect(() => {
    dispatch(allNotificationsRead());
});
```

There error is: ```Expected 1 arguments, but got 0.ts(2554)  createAction.d.ts(123, 6): An argument for 'payload' was not provided.```

To solve this we need a type after the method, but we don't need one.  

```js
 allNotificationsRead(state, action) { ... }
```

The action is not being used and can be removed.

```js
 allNotificationsRead(state) { ... }
```  

My notes about the ```useLayoutEffect``` hook say it is run before the browser updates the screen and is used to avoid the flashing of old data.

But the tutorial says this: *The <NotificationsList> component will mount, and the useLayoutEffect callback will run after that first render and dispatch allNotificationsRead.*

The [official docs say](https://react.dev/reference/react/useLayoutEffect) *useLayoutEffect is a version of useEffect that fires before the browser repaints the screen* which matches my understanding.  It also points out a pitfall: *useLayoutEffect can hurt performance. Prefer useEffect when possible.*

It's part of the discussion about the issue that when you select hit the refresh notifications button, the list of notifications duplicates.

The situation is described like this: *Our notificationsSlice will handle that by updating the notification entries in the store. This creates a new state.notifications array containing the immutably-updated entries, which forces our component to render again because it sees a new array returned from the useSelector, and the useLayoutEffect hook runs again and dispatches allNotificationsRead a second time. The reducer runs again, but this time no data changes, so the component doesn't re-render.*

One solution to this is to split the dispatch logic once when the component mounts, and again if the notifications array size changes.

But the approach in the book is that nothing can to happen as a valid action for a reducer.

The last part then shows adding a notifications badge for unread messages.  This doesn't fix the duplication issue.

And I should also point out at this state that since introducing the backend Nextjs/TypeOrm/Mongo CRUD API, the posts are also duplicated each time the app loads the list.

This will only happens in dev mode. If the app is deployed, it will not happen.  Or, we could remove the strict mode ```<React.StrictMode>``` from the index.tsx.  But I have a feeling we are going to get another Redux lesson to solve this.

If you remember, one of the points covered in part 6 is *Normalization (no duplication) of data state structure, and keeping items stored in a lookup table by item ID*.  That sounds like what we needs.

In the [Improving Render Performance](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#improving-render-performance)
section next, we see the use of the [Redux Developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) profiler tab to show that the <UserPage> re-renders when the notifications button is triggered.  However, it doesn't read any notifications.

  const postsForUser = useSelector code:

```js
const postsForUser = useSelector(state => {
  const allPosts = selectAllPosts(state)
  return allPosts.filter(post => post.user === userId)
})
```

The circular logic here goes:

- useSelector will re-run every time an action is dispatched and forces a re-render if for new values.
- calling filter() inside of our useSelector hook means that useSelector always returns a new array reference
- so the component will re-render after every action even if the posts data hasn't changed

The answer to this is given in the [Memoizing Selector Functions](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#memoizing-selector-functions) section.

Memoization is described here as a way to save a previous set of inputs and the calculated result, and if the inputs are the same, return the previous result instead of recalculating it again.

My notes on ```useMemo``` say:

- it only runs when one of its dependencies update
- improves performance
- used for values such as objects or arrays
- Primitives that require a minimal computation don't need to be memoized since they are easily comparable

The article however shows that the toolkit has ```createSelector``` function which generates memoized selectors by using the Reselect library.

The change then goes at the end of the post selector file:

```js
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],  // <-- input selector functions
  (posts, userId) => posts.filter(post => post.user === userId) // <-- output selector function
)
```

What the input selectors return becomes the arguments for the output selector.

In this case we:

- reuse the existing selectAllPosts selector to extract the posts array.
- the output selector takes posts and userId, and returns the filtered array of posts for just that user.
- it will only re-run the output selector if either posts or userId has changed

So in the user page, this:

```js
const postsForUser = useSelector((state: RootState) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => post.user === userId);
});
```

Becomes this:

```js
const postsForUser = useSelector((state: RootState) =>
    selectPostsByUser(state, userId)
);
```

However, with this change, I don't see the same effect in the dev tools profiler that is discussed in the app.  There are a few extra layers such as

- Provider
- ReactRedux.Provider
- BrowserRouter
- Router
- Navigation.Provider
- Location.Provider
- App

The articles only shows

- Provider
- ReactRedux.Provider
- App

I'm not sure if the router version, React or Redux account for these changes.  It's been about two years since this tutorial was written, so hard to tell if this particular detail is still relevant.  But worth thinking about understanding and using the createSelector in my own work.

There is a section on selectors linked to [here](https://redux.js.org/usage/deriving-data-selectors).

In the next section, [Investigating the Posts List](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#investigating-the-posts-list), the same kind of discussion happens for the posts lists.

The problem is defined as this: *clicking a reaction button on one of the posts while capturing a React profiler trace, we'll see that not only did the <PostsList> and the updated <PostExcerpt> instance render, all of the <PostExcerpt> components rendered*

This is because when a parent component renders, all child components inside of it also re-render by default.  Some options to fix this considered are:

1. wrap the <PostExcerpt> component in React.memo()
2. rewrite <PostsList> so that it only selects a list of post IDs from the store
3. have the reducer keep a separate array of IDs for all the posts, and only modify that array when posts are added or removed

This last method I am familiar with from using the Angular version of Redux, the [NgRx EntityAdapter](https://v7.ngrx.io/guide/entity/adapter).

The Redux Toolkit has createEntityAdapter to take care of business.

## The Entity Adapter Solution

The [Normalized State Structure](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#normalized-state-structure) it discusses objects used as lookup tables, a.k.a. maps or dictionaries where item IDs are keys and objects are the values.

The example used looks like this:

```js
{
  users: {
    ids: ["user1", "user2", "user3"],
    entities: {
      "user1": {id: "user1", firstName, lastName},
      "user2": {id: "user2", firstName, lastName},
      "user3": {id: "user3", firstName, lastName},
    }
  }
}
```

As you see, the ids property is a lookup table to access the keys.  This is called normalizing data.

## Managing Normalized State with createEntityAdapter

The [Managing Normalized State with createEntityAdapter](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#managing-normalized-state-with-createentityadapter) section shows how the function creates a ```{ ids: [], entities: {} }``` structure in the slice and automatically generates reducers and selectors to work with the data.  Nice.

This all gets put into action in the next [Updating the Posts Slice](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#updating-the-posts-slice) section.

We need to replace out initial state and interface in the post slice.  After reading the official "Usage with Tyescript" docs about [Typing createEntityAdapter](https://redux.js.org/usage/usage-with-typescript#typing-createentityadapter), I confirmed all that needs to change: *Typing createEntityAdapter only requires you to specify the entity type as the single generic argument.*

So the Post type should be all that is needed:

```js
const postsAdapter = createEntityAdapter<Post>({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
    status: "idle",
    error: null,
});
```

But there are a number of errors now in other parts of the file, such as this:

```js
const postEntity = existingPost(state);
```

There are actually three errors on the existingPost function:

- This expression is not callable.  Type 'WritableDraft<Post>' has no call signatures.ts(2349)
- Cannot invoke an object which is possibly 'undefined'.ts(2722)
- 'existingPost' is possibly 'undefined'.ts(18048)

I think this is a problem with the highlighting in the example code.  That part should be removed, and the whole snipped should be this:

```js
const existingPost = state.entities[postId];
if (existingPost) {
  existingPost.reactions[reaction]++
}
```

Isn't it nice to see the reducer directly look up the right posts by its IDs instead of having to loop over the old posts array.

But there are still a few more issues to resolve.

```js
reducer(state, action: PayloadAction<Post>) {
  state.posts.push(action.payload);
},
```

But again this error: *Property 'posts' does not exist on type 'WritableDraft<EntityState<Post> & { status: string; error: null; }>'.ts(2339)*

```js
reducer(state: Draft<EntityState<Post>>, action: PayloadAction<Post>) {
  state.posts.push(action.payload);
},
```

This finally works, using the immer ```product``` function and explicitly typing the draftState parameter of the produce function as an object with a posts property that's an array of Post objects.

```js
reducer(state, action: PayloadAction<Post>) {
  return produce(state, (draftState: { posts: Post[] }) => {
    draftState.posts.push(action.payload);
  });
},

export const selectAllPosts = (state: RootState) => state.posts.posts;
```

Property 'posts' does not exist on type 'WritableDraft<EntityState<Post> & { status: string; error: null; }>'.ts(2339)

Apply the same fix here:

```js
export const selectAllPosts = (state: { posts: { posts: Post[] } }) => state.posts.posts;
```

The last error on the page comes from this:

```js
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);
```

Two errors here, the first on the second .posts: *Property 'posts' does not exist on type 'WritableDraft<EntityState<Post> & { status: string; error: null; }>'.ts(2339)*

And this on the (post) arg: *Parameter 'post' implicitly has an 'any' type.ts(7006)*

```js
export const selectPostById = (state: { posts: { posts: Post[] } }, postId: string) =>
  state.posts.posts.find((post: Post) => post.id === postId);
```

We explicitly type the state parameter as an object with a posts property that's also an object with a posts property that's an array of Post objects. We're also adding a type annotation for the post parameter in the find method to tell TypeScript that it's a Post object.  I actually don't think this is the best way to do this.  It might be possible to update the root state to handle this situation, or use an action instead of a selector.  But it works, and this is all about learning about Typescript, so let's move on.

The last change is to replace these functions:

```js
export const selectAllPosts = (state: { posts: { posts: Post[] } }) => state.posts.posts;

export const selectPostById = (state: { posts: { posts: Post[] } }, postId: string) =>
  state.posts.posts.find((post: Post) => post.id === postId);
```

Then export the customized selectors for this adapter using `getSelectors`

```js
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
  } = postsAdapter.getSelectors(state => state.posts)
```

However, there is an odd error on the state.posts: *'state' is of type 'unknown'.ts(18046)*

This just requires using the old root state adapter:

```js
postsAdapter.getSelectors((state: RootState) => state.posts)
```

And with this, the app compiles, and the duplicates are gone from the posts list.  Outstanding!

Along with the sorting abilities, entity adapters are really useful.  It's kind of like using a structured database on the frontend.

Next we update the posts lists to use an id instead of the post object prop.

We get a lot of these errors: *'post' is possibly 'undefined'.ts(18048)*

Optional chaining is the easy way out:

```js
<h3>{post?.title}</h3>
```

BUt passing the object as a prop to a child component can't use that cheat:

```js
<ReactionButtons post={post} />
```

The errors here are: *Type 'Post | undefined' is not assignable to type 'Post'. Type 'undefined' is not assignable to type 'Post'.ts(2322) ReactionButtons.tsx(14, 5): The expected type comes from property 'post' which is declared here on type 'IntrinsicAttributes & Props'*

This will fix that, but looks pretty hacky:

```js
{post && <ReactionButtons post={post} />}
```

Now we are getting ordered posts like this:

```js
const orderedPostIds = useSelector(selectPostIds);
...
content = orderedPostIds.map((postId) => (
    <PostExcerpt key={postId} postId={postId} />
));
```

Also, when clicking a reaction button only that one component re-rendered.

### Applying the entity adapter to other features

Next up [Converting Other Slices](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#converting-other-slices) does the same thing for the users feature as was done to the posts list.

We ```import createEntityAdapter```, replace the initialState with ```usersAdapter.getInitialState()``` and use ```const usersAdapter = createEntityAdapter()``` to replace the ```extraReducers(builder) { builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)}``` to fetch all the users.

The only thing that needs to be done is to type the store.  Here we get two reducers for one:

```js
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state: RootState) => state.users)
``` 

#### Typing the user

After a few weeks of not working on this project, running it now shows the following errors:

```txt
Compiled with problems:X
ERROR in src/features/notifications/NotificationsList.tsx:23:43
TS2571: Object is of type 'unknown'.
    21 |         const date = parseISO(notification.date);
    22 |         const timeAgo = formatDistanceToNow(date);
  > 23 |         const user = users.find((user) => user.id === notification.user) || {
       |                                           ^^^^
    24 |             name: "Unknown User",
    25 |         };
    26 |
```

Trying to type the user causes an even larger error:

```js
const user= users.find((user: User) => user.id === notification.user) || {
  name: "Unknown User",
};
```

```err
No overload matches this call.
  Overload 1 of 2, '(predicate: (this: void, value: unknown, index: number, obj: unknown[]) => value is unknown, thisArg?: any): unknown', gave the following error.
    Argument of type '(user: User) => boolean' is not assignable to parameter of type '(this: void, value: unknown, index: number, obj: unknown[]) => value is unknown'.
      Types of parameters 'user' and 'value' are incompatible.
        Type 'unknown' is not assignable to type 'User'.
  Overload 2 of 2, '(predicate: (value: unknown, index: number, obj: unknown[]) => unknown, thisArg?: any): unknown', gave the following error.
    Argument of type '(user: User) => boolean' is not assignable to parameter of type '(value: 
    unknown, index: number, obj: unknown[]) => unknown'.
      Types of parameters 'user' and 'value' are incompatible.
        Type 'unknown' is not assignable to type 'User'.ts(2769)
```

I hate this kind of error.  It makes doing ```(user: any)``` an appealing option.  But since this is a learning experience, lets figure this out.  To save time I asked ChatGPT first.

*The error you're encountering is due to the find method not being able to infer the type of the user parameter based on the type of elements in the users array. You can resolve this error by providing a type assertion for the users array, like this:*

```js
const user = (users.find((user: User) => user.id === notification.user) as User) || {
  name: "Unknown User",
};
```

*By using the type assertion (user: User), you're telling TypeScript that the elements in the users array are of type User, and therefore the user parameter in the find method is also of type User. This will allow TypeScript to correctly infer the type of the user variable and resolve the error. However, please note that using type assertions should be done with caution, as it bypasses TypeScript's type checking and may result in runtime errors if the assumption about the type is incorrect. It's always best to ensure that the type information is accurate and consistent throughout your code to avoid such issues.*

I still don't understand why I have to type user twice here, and even then it bypasses TypeScript's type checking.

I specify that I do not want to bypass typechecking, and Chat throws up this:

```js
const user = users.find((user): user is User => user.id === notification.user) || defaultUser;
```

However, this still causes this error: *'user' is of type 'unknown'.ts(18046)*

Pointing this out and getting the everpresent "I apologize for the confusion", we get to this:

```js
const user = users.find((user): user is User => (user as User).id === notification.user);
```

It works, but what kind of syntax is "user is User"?  "User as User" I understand.  This is a bit comical.  Luckily I am being paid to use Typescript, so I wont complain.

Another similar error now is this:

```js
  const author = useSelector((state: RootState) =>
    state.users.find((user: User) => user.id === userId)
  );
```

Causes this error: *roperty 'find' does not exist on type 'EntityState<unknown>'.ts(2339)*

```txt
Argument of type 'EntityState<unknown>' is not assignable to parameter of type '{ counter: CounterState; posts: WritableDraft<EntityState<Post> & { status: string; error: null; }>; users: EntityState<unknown>; notifications: Notification[]; }'.
  Type 'EntityState<unknown>' is missing the following properties from type '{ counter: CounterState; posts: WritableDraft<EntityState<Post> & { status: string; error: null; }>; users: EntityState<unknown>; notifications: Notification[]; }': counter, posts, users, notificationsts(2345)
No quick fixes available
```

ChatGPT suggests this, which doesn't work either:

```js
type UsersState = EntityState<User>;

// Use the `createSelector` function to define a selector for fetching user by id
export const selectUserById = (state: RootState, userId: string): User => {
    return selectUserById(state.users, userId);
};

export const selectPostsByUser = (state: RootState, userId: string) => {
    const user = selectUserById(state, userId);
    if (user) {
        return selectAllPosts(state).filter((post) => post.user === user.id);
    }
    return [];
};
```

After getting fed up with ChatGPT, I went back to StackOverflow and found this which works to solve the ```'user' is of type 'unknown'.ts(18046)``` error on user.name:

```html
<h2>{(user as User).name}</h2>
```

The thing I like about StackOverflow is the attitue to answers there.  As an old school dev, I remember the days of RTFM answers (look it up if you don't know that acronym).  StackOverflow pioneerd the attitude of finding the best answer to each question.  They let the users decide what the best answer is.  In the face of ChatGPT, it still does well.

However, it doesn't help with this one: 


```export const PostAuthor = ({ userId }: PostAuthorProps) => {
  const author = useSelector((state: RootState) =>
    state.users.find((user: User) => user.id === userId)
  );
```

The error: *Property 'find' does not exist on type "'EntityState<" unknown>'.ts(2339) site:stackoverflow.com*.  No results at all that include ```EntityState```.

I can't find any mention of EntityState in any of the useful links section below either.  So much for doing it by the book.

I could use this to fix that error: ```state: any```.  That indicates that maybe RootState needs some work.

The same error appears here:

```js
const usersOptions = users.map((user) => (
```

There is no RootState used there, but ```users``` is coming from the store like this: ```const users = useSelector((state: RootState) => state.users);```

There we go.  ```RootState``` again.  Time for a deep dive.

In the [Define Root State and Dispatch Types]() section of *Usage with Typescript* officially it's shown as created like this:

```export type RootState = ReturnType<typeof store.getState>;```

This is *inferring these types from the store itself*.

The mouseover info for it shows this:

```js
const store: ToolkitStore<{
    counter: CounterState;
    posts: WritableDraft<EntityState<Post> & {
        status: string;
        error: null;
    }>;
    users: EntityState<unknown>;
    notifications: Notification[];
}, AnyAction, [...]>
```

This is happening now because of our use of the entity adapter: ```const usersAdapter = createEntityAdapter()```.  That's why these errors weren't showing up before.  There must be a way to type the user entity state there and get rid of the unknown.  After all, the posts is typed.

Posts does it like this:

```js
const postsAdapter = createEntityAdapter<Post>({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});
```

So then it seams we could do this:```createEntityAdapter<User>()```

or this: ```createEntityAdapter<User[]>()```

But no, that does not change the error.  Or at least not much: *Property 'map' does not exist on type 'EntityState<User>'.ts(2339)*

If users comes from a selector.

const users = useSelector((state: RootState) => state.users);

There is really not much at all in the way of Typescript with EntityAdapter help.  Options here are to disable that line:

// @ts-ignore: Property 'map' does not exist on type 'EntityState<User>'.ts(2339)

Or use the any escape hatch:

const users: any = useSelector((state: RootState) => state.users);

However, both of these still result in a runtime error:

dPostForm.tsx:44 Uncaught TypeError: users.map is not a function
    at AddPostForm (AddPostForm.tsx:44:1)

Even commenting out that usage results in another user related error:

PostAuthor.tsx:11 Uncaught TypeError: state.users.find is not a function
    at PostAuthor.tsx:11:1

Then I go back to the tutorial trail and read this:

*Our <AddPostForm> is still trying to read state.users as an array, as is <PostAuthor>. Update them to use selectAllUsers and selectUserById, respectively.*

So of course, map doesn't exist anymore, as the shape of users is now:

```js
entities: {}
ids: []
```

Posts uses the entity adapter like this:

```js
const orderedPostIds = useSelector(selectPostIds)
...
    content = orderedPostIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
    ))
```

In the AddPostForm, all we have to do then is this:

```js
const users = useSelector(selectAllUsers)
```

Then is the PostAuthor component:

```js
const author = useSelector((state: RootState) => selectUserById(state, userId!))
```

The "!" mark there is the [non-null assertion operator](Argument of type 'string | undefined' is not assignable to parameter of type 'EntityId'.
  Type 'undefined' is not assignable to type 'EntityId'.ts(2345)).

Otherwise we would get this error: *Argument of type 'string | undefined' is not assignable to parameter of type 'EntityId'.
  Type 'undefined' is not assignable to type 'EntityId'.ts(2345)*

Lots of drama with TypeScript if you run off the rails.  It helps to take a step back and consider what it is you are trying to do and do that proplerly instead of going down the rabbit hole of looking at the error messages sometimes.

### Entity adapter for the notifications

The last section is [Converting the Notifications Slice](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#converting-the-notifications-slice).

As with the other slices, we use the ```createEntityAdapter``` and replace the initial state with version automatcially generated by it.

```js
const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})
...
  initialState: notificationsAdapter.getInitialState(),

  allNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    }
    ...
    extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
    })
  }
```

After these changes, there is an error on this line:

```js
const [latestNotification] = allNotifications;
```

The error: *Type 'EntityState<Notification>' is not an array type.ts(2461)*

I kind of gave up on this one and took the any escape hatch:

```js
        const allNotifications: any = (getState() as RootState).notifications;
        const [latestNotification] = allNotifications;
```

It might come back to this.  I kind of think EntityAdapter needs a whole article devoted to it, as a core skill for Redux, and handling all the Typescript issues associated with it.  It takes too long to go through this whole tutorial to get to this stage, and it could be a kind of accellerated quick start into using the tool kit.

The last thing to do is use the new slice reducer in the notifications list.

```js
    useLayoutEffect(() => {
        dispatch(allNotificationsRead());
    });
```

Causes these errors: *Calling this redux#ActionCreator with an argument will return a PayloadAction of type T with a payload of P

Expected 1 arguments, but got 0.ts(2554) createAction.d.ts(123, 6): An argument for 'payload' was not provided.*

We need to remove the action argument to the reducer like this: ```allNotificationsRead(state)```

The last error is once again the map issue: *Property 'map' does not exist on type 'EntityState<Notification>'.ts(2339)*

We have to use the ids now to get the notifications.

Without thinking about changing the EntityAdapter this time, the simple solution is to handle the case where notification is undefined by returning null or any default value or appropriate handling for notifications.  We also had to deal with possible null dates to avoid this error: ```Property 'date' does not exist on type 'string'.ts(2339)```

```js
    const notificationIds = Object.keys(notifications.entities);

    const renderedNotifications = notificationIds.map((notificationId) => {
        const notification = notifications.entities[notificationId];
        if (!notification) {
            // handle case where notification is undefined
            return null; // or any default value or appropriate handling
        }

        const date = notification?.date ? parseISO(notification.date) : null;
        const timeAgo = date ? formatDistanceToNow(date) : null;
```

### the Navbar

Running the app now, we see some more issues.

```err
Compiled with problems:X
ERROR in src/app/Navbar.tsx:11:50
TS2339: Property 'filter' does not exist on type 'EntityState<Notification>'.
     9 |     const dispatch = useDispatch();
    10 |     const notifications = useSelector(selectAllNotifications);
  > 11 |     const numUnreadNotifications = notifications.filter((n) => !n.read).length;
       |                                                  ^^^^^^
    12 |
    13 |     const fetchNewNotifications = () => {
    14 |         dispatch(fetchNotifications() as any);

ERROR in src/app/Navbar.tsx:11:58
TS7006: Parameter 'n' implicitly has an 'any' type.
     9 |     const dispatch = useDispatch();
    10 |     const notifications = useSelector(selectAllNotifications);
  > 11 |     const numUnreadNotifications = notifications.filter((n) => !n.read).length;
       |                                                          ^
    12 |
    13 |     const fetchNewNotifications = () => {
    14 |         dispatch(fetchNotifications() as any);
```


## Wrapping up

And with that, we are done with part 6.  It's been a long ride.  Unit tests fell along the wayside, but the core purpose to explore this example app using Typescript has been a great benifit.  I hope whoever reads this also gets some benifit from it.

### The futuere of the Redux essentials app

During the writing of this article, the situation with React has changed a bit.  Create React App as a starting point is no longer supported in the [new official docs](https://react.dev/learn/start-a-new-react-project). 

The official options are now:

- Next.js
- Remix
- Gatsby
- Expo (for native apps)

Instead, Next.js is now the preferred method for getting started.

I can also point out that this blog is written in Next.js, as it existed three years ago using v9.4.1, whereas now Next.js 13 was recently released with many new upgrades.  I chose Next.js during a time when I was still working with Angular and wanted at least my blogging to be in React.  Creating a directory based markdown blog proved a simple solution that has worked well.  With the new changes in Next.js and it's rise to the top of the React ecosystem, it might be time to migrate my blog itself to the latest and greatest.

### Using Nextjs with Redux

[This question](https://stackoverflow.com/questions/60626451/is-using-redux-with-next-js-an-anti-pattern) says *if you have a custom App with getInitialProps then the Automatic Static Optimization that Next.js provides will be disabled for all pages.*

The solution provided there is to create a Redux Provider as a wrapper to wrap components so the redux context will be automatically initialized and provided within that component.

I have updated my [issue](https://github.com/reduxjs/redux-essentials-example-app/issues/51) regarding the official Javascript version of this app and it's future with Typescript to see what Mark Erickson is thinking about the future of this project.  Stay tuned for an answer there.

## What's next?

The Redux Essentials, Part 7 & 8 are [RTK Query Basics](https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics)
 and [RTK Query Advanced Patterns](https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced).

Give the length of this piece, the RTK Query in Typescript changes can be discussed in another aticle, so stay tuned for that as well.

## Useful links

Here are some links from the tutorial that I found useful when working on this article.

- [Redux docs: Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript): Examples of how to use Redux Toolkit, the Redux core,and React Redux with TypeScript
- [Redux Toolkit docs: TypeScript Quick start](https://redux-toolkit.js.org/tutorials/typescript): shows how to use RTK and the React-Redux hooks API with TypeScript
- [React+TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet): a comprehensive guide to using React with TypeScript
- [React + Redux in TypeScript Guide](https://github.com/piotrwitek/react-redux-typescript-guide): extensive information on patterns for using React and Redux with TypeScript

## Summary

Using selectors can help to hide implementations in the state.  Using them in Typescript is pretty easy.

Using entity adapters powers up a Redux app with and can solve re-render issues and duplications in lists as well assiting in sorting the lists.  They need a only a little bit more effort to use them with Typescript.

The createEntityAdapter function provided by the Redux Tooklit automatically generates reducers and selectors to work with the data using ids in a lookup table to access the keys which is called normalizing data.

Use the hashtag #ReduxEssentialsTypescript to reach and start a discussion.
