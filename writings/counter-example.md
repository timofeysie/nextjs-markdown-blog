---
title: "Counter Example"
date: "2020-05-22"
og:
  description: "A detailed walk through of the official NgRx counter example"
  image: "https://telmo.im/og/persistdarkmodereact.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---


# Counter example

Here is a brief walk through of the tutorial example from the official NgRx docs.
[The counter tutorial is briefly explained with](https://ngrx.io/guide/store#tutorial) some code.  This article talks in more detail about the state management shown as a model here.

I have broken it down into four steps.

1. Define actions to express events.
2. Define a reducer function to manage the state of the counter.
3. Register the global state container that is available throughout the application.
4. Inject the Store service to dispatch actions and select the current state of the counter.

In more detail.

## Step 1: Define actions to express events

Create a new file named counter.actions.ts to describe the counter actions to increment, decrement, and reset its value.

## Step 2: Define a reducer function to manage the state

Define a reducer function to handle changes in the counter value based on the provided actions.

## Step 3: Register the global state container that is available throughout the application

Import the StoreModule from @ngrx/store and the counter.reducer file.

Add the StoreModule.forRoot function in the imports array of your AppModule with an object containing the count and the counterReducer that manages the state of the counter. The StoreModule.forRoot() method registers the global providers needed to access the Store throughout your application.

## Step 4: Inject the Store service to dispatch actions and select the current state

Create a new Component named my-counter in the app folder. Inject the Store service into your component to dispatch the counter actions, and use the select operator to select data from the state.

Update the MyCounterComponent template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the count\$ observable.

Update the MyCounterComponent class with a selector for the count, and methods to dispatch the Increment, Decrement, and Reset actions.

Add the MyCounter component to your AppComponent template.
