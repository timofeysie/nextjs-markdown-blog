---
title: "Red-Green-Refactor, Repeat, Dojo"
date: "2020-07-19"
og:
  description: "An article about TDD using red-green-refactor with a group programming approach."
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

The article discusses test driven software development (TDD) using a technique known as red-green-refactor.
It talks about an online group programming approach to practicing TDD.

### About TDD & Red-Green-Refactor

I recently joined a [coding dojo meetup](https://www.meetup.com/coding-dojo-sydney) where we practice Test Driven Development (TDD).  The group is centered in Sydney, Australia, but since the Coronavirus has us all stuck at home, it's moved online.  

Testing can be hard to get into and easy to skip.  But when done right, it gives confidence in a code base, enables safer refactoring and lets you rest easier at night, which is actually a real health benefit.

Learning how to practice TDD is a great way to do testing right.

The particular type of TDD we will be talking about here is called Red-Green-Refactor.  The steps for this are.

1. write a failing test
2. make the tests pass in the simplest way
3. refactor the code into a mature solution

The first two steps are all about testing.  Setting up a test for a function is the first step, and is sometimes more tricky than it seems.  There can be dependencies that need to be mocked and other things that can stop testing in it's tracks.

The second step can seem stupid, but actually has an important goal that I didn't catch at first.  That is to test the test.  Sounds stupid, right?  But what you want to check is that the test you wrote in step one is doing what it should be doing.
The third step becomes more focused when you know what a function should be returning to pass the test.

After this, you can take a break and truly relax, or start over again.  There is always another test to right and more functionality to refactor.

### About the meetup

An early description from the meetup page says this:  "A Coding Dojo is a meeting where a bunch of coders get together to work on a programming challenge."

In a Coding Dojo, participants take turns to work on a coding exercise, using good technical practices such as BDD/TDD and pair programming.

The group might have been originally founded by John Ferguson Smart in 2013.   Right now there are sessions going for vanilla JavaScript, and React.

Dojo means "place of the Way" in Japanese.  You could call it a club also.
Another term used is a ["kata"](https://en.wikipedia.org/wiki/Kata_(programming)) which is coding an exercise.

There is also the [CoderDojo](https://en.wikipedia.org/wiki/CoderDojo) for youths learning how to code.

I have some concerns about using Japanese terms and samurai imagery.  I certainly wouldn't want to live in a world where someone could be decapitated at anytime by an angry samurai.

But the term comes from Buddhism originally, and the discipline gained by practice is the main goal, so the actual terms you use for this is not so important.  You could call is a programming exercise club, or frontend skills practice or anything you want.

### An example exercise (Kata)

One of the most basic coding challenges is the anagram generator.

Inspired by the [Cyber-dojo site](https://cyber-dojo.org/), the task looks like this:

*Write a program to generate all potential anagrams of an input string.*

*For example, the potential anagrams of "biro" are:*

```txt
biro bior brio broi boir bori
ibro ibor irbo irob iobr iorb
rbio rboi ribo riob roib robi
obir obri oibr oirb orbi orib
```

### A vanilla JavaScript approach

Using a basic test runner made by the event orgianizer [Kynan Stewart](https://github.com/k7n4n5t3w4rt), all you need to do is open the index.html file in the browser and edit the test and function files and refresh the page to see the results.  This is a refreshingly simple approach for those getting started with TDD.

The html file looks like this:

```html
<html>
  <head></head>
  <body>
    <script src="test_runner.js"></script>
    <script src="functions.js"></script>
    <script src="tests.js"></script>
  </body>
</html>
```

You can see there are three Javascript files involved.

The test runner has three functions:

```js
function pass(message) {
  console.log(message);
}
function fail(message) {
  console.error(message);
}
function Test(message, testFunction) {
  console.log(message);
  testFunction();
}
```

And example test looks like this:

```js
Test("First test", () => {
  const result = exampleFunction();
  if (result === true) {
    pass(`The result is ${result.toString()}`);
  } else {
    fail(`The result is ${result.toString()}`);
  }
});
```

The function file starting point looks like this:

```js
const exampleFunction = () => {
  return true;
};
```

The only tricky part is, when you open the index.html file, you wont see anything.  You have to open the inspector and look at the console to see the output:

```txt
test_runner.js:9 First test
test_runner.js:3 The result is true
```

Now you would be ready to get started writing your first failing test. I wont cover that in this article as there is more to talk about yet.

Kynan actually goes a bit further these days and uses [Flow types](https://flow.org/) which is a static type checker.  Flow is easy to pick up and a popular choice.  For me, I work with [TypeScript](https://www.typescriptlang.org/), and often forget what it's like to work with vanilla JavaScript.  For better or worse, I want to practice TDD with the same frameworks I use professionally, which is [React](https://reactjs.org/) and [Angular](https://angular.io/).

### Using a framework

There is a bit more involved when using a framework.  I will go through how to set things up with React using TypeScript and Jest as a test runner.  Some might point out that React is not a framework like Angular is, so I should probably say it's a *React-based framework* and skip that debate for now.

To start a React project from scratch, you will need [npm](https://www.npmjs.com/get-npm) installed on your system.

You can create a blank starter using the TypeScript template with the following command:

```bash
npx create-react-app tdd-react --template typescript
```

We will also use the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) which is installed like this:

```bash
npm install –save-dev @testing-library/react
```

I walk through the above anagram generator example step by step in another article: [React TDD Anagram example](https://timothycurchod.com/writings/tdd-react-anagram)

## Summary

It's fun to do pair programming or "mobbing" with larger groups online to solve something like this.  

TDD is a big field with many opinions.  Red-green-refactor provides a great framework which puts this powerful technique to good use.  Other benefits include learning to express your ideas about coding and testing better.

Use the hashtag #red-green-refactor=repeat-dojo and the link below on Twitter for any comments or feedback.
