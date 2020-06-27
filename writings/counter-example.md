---
title: "The Classic Counter Example"
date: "2020-05-22"
og:
  description: "A detailed walk through of the official NgRx counter example"
  image: "https://telmo.im/og/persistdarkmodereact.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## The NgRx Counter example

- Angular and Redux versus React
- Using Nx in a Nrwl workspace
- The official store counter example
- Create a new project with the nx CLI
- Install NgRx
- Define actions to express events
- Define a reducer function to manage the state
- Register the global state container that is available throughout the application
- Inject the Store service to dispatch actions and select the current state of the counter
- Use the Redux devtools

### Angular and Redux versus React

NgRx is short for "Angular Redux". It's the best thing Angular has to keep large production apps from falling into a soup of functions. React is a great choice to start simple, but you have to make bets on all the libs needed to fill out a complete production architecture, which can lead code bases into excessive technical debt.

There are plenty of articles comparing the two choices. It's an interesting subject I think. Some people think it's a framework war. If that's so, React is certainly winning these days. As a contractor, I have to worry about getting jobs. As of right now, there are at least double the number of React jobs compared with Angular, and the situation is getting worse for Angular.

That being said, Angular is a great choice for large projects. It has stricter conventions which is great for tooling and you don't have to leave those opinions up to a team of rotating devs.

Taking things a step further is the monorepo tools offered by Nrwl. This used to be more of a niche area for the largest most organized projects. But as the nx tools mature, now allowing React development also, it's a space worth watching and if you're lucky enough, working with it it on the job.

### Using Nx in a Nrwl workspace

This article will use an [Nrwl workspace](https://blog.nrwl.io/) and the [nx CLI](https://nx.dev/angular/cli/overview) to scaffold the files. This is not necessary for the counter example, but I found too little help when learning nx and NgRx, so decided to capture the whole process so that it might help others in the same situation and me and also make it all clearer to myself in the process.

To install the nx CLI you can use yarn or npm.

```bash
yarn global add @nrwl/cli
npm install -g @nrwl/cli
```

You should only use one or the other, not both. At work we use npm, but at home I use yarn. I have run into issues with npm that were solved by using yarn. The only reason I could find was [this article suggests](https://dev.to/stereobooster/typescript-monorepo-for-react-project-3cpa) using yarn instead of npm in a monorepo because it supports workspaces to link cross-dependencies.

### The official store counter example

The official NgRx docs page for a store has [a counter tutorial briefly explained with some code](https://ngrx.io/guide/store#tutorial). This article aims to go into more detail about the state management shown as a model here.

I wont go into detail about what a store is, as you can read plenty of articles online about it. My goal his is to flesh out the code shown in their counter example.

In the next article I will go through unit tests for this example. The goal of these two articles will be to lay out a model for achieving TDD (test driven development) with NgRx. To do TDD, you need to know before hand how to write meaningful tests for what you want to do. It's kind of a chicken and egg kind of thing.

Now getting on with the counter example there are four steps to accomplish this simple feature.

1. Define actions to express events.
2. Define a reducer function to manage the state of the counter.
3. Register the global state container that is available throughout the application.
4. Inject the Store service to dispatch actions and select the current state of the counter.

I will refer to these steps when we get to the code in a moment.

## Create a new project with the nx CLI

Trying this our on the counter example form the official docs.

```bash
nx g @nrwl/angular:app stratum
Cannot find module '@nrwl\angular\package.json'
Require stack:
- C:\Users\timof\repos\timofey
...
```

Same for this:

```bash
nx generate @nrwl/angular:app
```

This fixed it:

```bash
yarn add @nrwl/angular
```

Next step:

### Install NgRx

Three methods are shown:

```bash
npm install @ngrx/store --save
yarn add @ngrx/store
ng add @ngrx/store
```

That only adds the package. The below will do a lot more:

```bash
ng add @ngrx/store --minimal false
The add command requires to be run in an Angular project, but a project definition could not be found.
```

Changing into the stratum directory, we get this error:
_The add command requires to be run in an Angular project, but a project definition could not be found._

Using that command is a nice idea, but not working and not necessary for our goal of creating unit tests for the counter example. So on with that for now.

### 1. Define actions to express events

Create a new file named counter.actions.ts to describe the counter actions to increment, decrement, and reset its value.

Creating a store directory to hold these files.

### 2. Define a reducer function to manage the state

Define a reducer function to handle changes in the counter value based on the provided actions.

The example shows creation of a counter.reducer.ts file.

### 3. Register the global state container that is available throughout the application

Import the StoreModule from @ngrx/store and the counter.reducer file in the app.module.ts file.

Add the StoreModule.forRoot function in the imports array of your AppModule with an object containing the count and the counterReducer that manages the state of the counter. The StoreModule.forRoot() method registers the global providers needed to access the Store throughout your application.

### 4. Inject the Store service to dispatch actions and select the current state

Create a new Component named my-counter in the app folder. Going to change the name a bit. I'm pretty over the "my-whatever" naming convention for tutorials, so we will just call it "counter" not "my-counter".

We can use nx for this step.

```bash
ng generate component counter --project=stratum
```

Another example shows this flag:

```bash
ng g c components/counter --project=stratum --skip-import
```

There is also the nx way of doing things:

```bash
nx g component counter --project=stratum
Schematic "component" not found in collection "@nrwl/web".
```

That error came up in the Quallasuyu project. It was fixed with something like this:

```bash
yarn add @schematics/angular
yarn add @schematics/web
>nx g component counter --project=stratum
Schematic "component" not found in collection "@nrwl/web".
```

Or not. Let's look at some more examples.

```bash
nx generate @nrwl/angular:component counter --project=stratum
```

This works. Took a while, but we have a counter component now. Should have put it in a components directory. Next time. The naming convention used by nx gives us this:

```bash
<clades-counter>
```

Inject the Store service into your component to dispatch the counter actions, and use the select operator to select data from the state.

Update the MyCounterComponent template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the count\$ observable.

Update the MyCounterComponent class with a selector for the count, and methods to dispatch the Increment, Decrement, and Reset actions.

Add the MyCounter component to your AppComponent template.

### Use the Redux devtools

Install the Redux devtools for the Chrome browser by finding the "add more tools" link which will open [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

Currently, nothings shows up (unless you have another app open which uses a store, in which case you might see that store).

_No store found. Make sure to [follow the instructions](https://github.com/zalmoxisus/redux-devtools-extension#usage)._

The counter is working and using the store. So an extra few steps are required. Looking at [this article](*https://alligator.io/angular/ngrx-store-redux-devtools/).

```bash
yarn add @ngrx/store-devtools
npm install @ngrx/store-devtools --save
```

In the app.module.ts file, import StoreDevtoolsModule and add it to your NgModule’s imports:

After this, in the Chrome inspector/Redux tab, we see the actions working on the counter. How great is that?!
