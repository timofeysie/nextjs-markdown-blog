---
title: "RGR Coding Game Getting Started"
date: "2023-01-28"
og:
  description: "Getting started with a red-green-refactor coding game"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- RGR (Red Green Refactor) is a coding game for one or more players
- It uses a TDD (test driven development) in a structured approach to problem solving

## The Rules of the Game

The steps for the Red Green Refactor game are as follows:

1. write a failing test
2. make the tests pass in the simplest way
3. refactor the code into a more mature solution
4. repeat

## Getting Started

This game can be played in any programming language, but this article focuses on JavaScript.

Starting points for the game range from vanilla JavaScript to a framework such as [React](https://reactjs.org/) or [Angular](https://angular.io/).

### The vanilla JavaScript starter

Test runner by [Kynan Stewart](https://github.com/k7n4n5t3w4rt). [Red-Green-Refactor repo](https://github.com/timofeysie/Red-Green-Refactor) created the most basic approach.  Here are the files in repo.

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

## Using a Git workflow

The basic three files shown above as a starting point can be found [in this project](https://github.com/timofeysie/Red-Green-Refactor).

An example game would require players to clone the repo:

```shell
git clone https://github.com/timofeysie/Red-Green-Refactor.git
cd Red-Green-Refactor
```

Create a new branch for a new challenge, such as anagrams, write a failing test then push the branch (note this would require the -set-upstream flag the first time the branch is pushed):

```shell
git checkout -b anagrams
git add .
git commit -m "step 1 - first failing test"
git push
```

The second player then makes the test pass in the simplest way then writes another failing test, commits the changes and pushes the branch.  THe next player pulls the changes, and refactors the code to make the second failing test pass and then writes a new failing test for another round.

### Using an online code-sharing platform

To avoid turing a game into a git lesson, it's also possible to take advantage of a plethora of online platforms for developers to share code and work together.  These come in many shapes and sizes.  I have used all kinds and I'm sure there will be more options coming up all the time.

A  starting point can be found here

Blank starter based on Kynan's test runner for the "Balanced Parenthesis" challenge can be [found on Stackblitz here](https://stackblitz.com/edit/vanilla-js-playground-spxxvb?file=index.js).  This has an added basic UI instead of using the console log.  I have found though that people spend time looking at how this is done which like learning git can be distracting from the basic goals of the exercise.

Here is a sorting challenge in progress on [js fiddle by Kynan](https://jsfiddle.net/k7n4n5t3w4rt/92m1facn/11/).

A basic starting point with [two tests is here](https://stackblitz.com/edit/vanilla-js-playground-kq1kcx?file=index.js)

Another good choice with a free option is [Git Pod](https://www.gitpod.io/).

### Using a framework

To start a React project from scratch, you will need [npm](https://www.npmjs.com/get-npm) installed on your system.

You can create a blank starter using the TypeScript template with the following command:

```bash
npx create-react-app tdd-react --template typescript
```

We will also use the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) which is installed like this:

```bash
npm install –save-dev @testing-library/react
```

## Problem Solving

*“Give me six hours to chop down a tree and I will spend the first four sharpening the axe.”* (Attributed to Abraham Lincoln)

For developers, *this means spending time understanding the problem and finding high-level solutions before starting to code. In the average coding interview, candidates are expected to spend less than half of their time actually writing code, and the rest of the time understanding the problem.* (from [Forget about algorithms and models — learn how to solve problems first](https://thenextweb.com/news/forget-about-algorithms-and-models-learn-how-to-solve-problems-first) by Ari Joury)

The main point is, before starting to code, spend time:

1. understanding the problem
2. finding high-level solutions
3. iterating on the solution by refactoring

Regardless of you feelings about Test Driven Development (TDD), a major point for it's use in an agile development environment is to make us consider the behavior of the feature before we start writing code.

In relation to RGR, we generally don't want to spend too much time on each step.  It's better to make small improvements and pass the buck on to the next team.  It's not about showing off, it's about learning how to problem solve and collaborate.

In [The Paradox of Goals](https://nesslabs.com/the-paradox-of-goals), Anne-Laure Le Cunff writes that cycles of deliberate experimentation are considered the theoretical cornerstone of most modern theories of learning and meta-cognition.

In the article there is a quote by Nassim Taleb which says: *it is in complex systems, ones in which we have little visibility of the chains of cause-consequences, that tinkering, bricolage, or similar variations of trial and error have been shown to vastly outperform the teleological — it is nature’s modus operandi.*

Bricolage means making small changes to something in an attempt to improve it.  If the first attempt works, that’s great. If it doesn’t, try again.  This process sets in motion a cycle of deliberate experimentation:

1. First, we commit to an action.
2. Then, we execute the target behavior.
3. Finally, we learn from our experience and adjust our future actions accordingly and repeat.

This sounds a lot like the rules of the RGR game!

Another note about refactoring and writing tests.  It's considered not good form to test implementation details.  This is because if you test the inner workings of a function, then it's a barrier to refactoring, and refactoring is a key of this iterative problem solving process.

## Further Reading

- a [coding meetup](https://www.meetup.com/coding-dojo-sydney) where we practice Test Driven Development (TDD)

There is also the [CoderDojo](https://en.wikipedia.org/wiki/CoderDojo) for youths learning how to code.

Using a basic test runner made by the event orgianizer [Kynan Stewart](https://github.com/k7n4n5t3w4rt),

Kynan actually goes a bit further these days and uses [Flow types](https://flow.org/) which is a static type checker.  Flow is easy to pick up and a popular choice.  For me, I work with 

[TypeScript](https://www.typescriptlang.org/), and often forget what it's like to work with vanilla JavaScript.  For better or worse, I want to practice TDD with the same frameworks I use professionally, which is 

I walk through the above anagram generator example step by step in another article: [React TDD Anagram example](https://timothycurchod.com/writings/tdd-react-anagram)

I also wrote [an article](https://timothycurchod.com/writings/red-green-refactor-repeat) about how I got started with the RGR game.

## Summary

Use the hashtag #RedGreenRefactorGame and the link below on Twitter for any comments or feedback.
