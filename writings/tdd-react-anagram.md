---
title: "React TDD Anagram example"
date: "2020-07-19"
og:
  description: "A detailed walk through of TDD using React with TypeScript to solve a simple anagram coding challenge"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## React TDD Anagram example

I recently joined a [coding dojo meetup](https://www.meetup.com/coding-dojo-sydney) where we practice Test Driven Development (TDD).  The group is centered in Sydney, Australia, but since the Coronavirus has us all stuck at home, it's moved online.  

This blog will go through a basic anagram generating example in Javascript using React.   I will cover TDD, how the group works, how to set up the stack and then step through the exercise.  If you just want to look at the coding example, you can skip ahead.

### About TDD

Testing can be hard to get into and easy to skip.  But when done right, it give confidence in a code base and you can rest easier at night, which is actually a real health benefit.

Learning how to practice test driven development (TDD) is a great way to do testing right.

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

There is also the [CoderDojo](https://en.wikipedia.org/wiki/CoderDojo) for youth learning."]

I have some concerns about using Japanese terms and samurai imagery.  I certainly wouldn't want to live in a world where someone could be decapitated at anytime by an angry samurai.
But the term comes from Buddhism originally, and the discipline gained by practice is the main goal, so the actual terms you use for this is not so important.  You could call is a programming exercise club, or frontend skills practice or anything you want.

### About the stack

We will be using React with TypeScript and Jest for this exercise.  I come from an Angular/Java background, but find React a great simple way to get started with web apps, and simple in this complex world is something even greater.

The vanilla JavaScript approach uses a basic test runner made by Kynan that is even simpler.  All you do is open the index.html file in the browser and edit the test and function files and refresh.  That in itself is refreshingly simple.

I code for work, so for me, using React/TS/Jest is similar to a regular frontend work environment and makes sense for the kind of practice I want to do.

To start from scratch, you will need [npm](https://www.npmjs.com/get-npm) installed on your system.

Next, create a blank starter using the TypeScript template with the following command:

```bash
npx create-react-app tdd-react --template typescript
```

We will also use the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) which is installed like this:

npm install –save-dev @testing-library/react

### About this exercise (Kata)

One of the most basic coding challenges is the anagram generator.

Inspired by the [Cyber-dojo site](https://cyber-dojo.org/), the task looks like this:

Write a program to generate all potential anagrams of an input string.

For example, the potential anagrams of "biro" are

```txt
biro bior brio broi boir bori
ibro ibor irbo irob iobr iorb
rbio rboi ribo riob roib robi
obir obri oibr oirb orbi orib
```

### Setup the example

If you were doing the exercise in vanilla JS then you could skip this step.  However, we want to have a UI ready to take user input and show the result.  This is the groundwork needed in our blank React starter created above.

First, it's a good idea to make sure everything is working, so run the app like this:

```bash
npm run dev
```

Also, you might want to open another terminal and run the example unit test to make sure that's working also:

```bash
npm test
```

Open the App.tsx file and replace the contents with this:

#### **`src/App.tsx`**

```js
import React from 'react';
import './App.css';

function App() {
    const [displayOutput, setDisplayMessage] = React.useState(false);
    const [input, setOutput] = React.useState("");
  return (
    <div className="App">
      <label htmlFor="name" className="item padding">
        Enter text
      </label>
      <input
        id="name"
        type="text"
        className="padding"
        onChange={(event) => setOutput(event.currentTarget.value)}
      />
      <button onClick={() => setDisplayMessage(true)} className="padding">
        Submit
      </button>
      {displayMessage && <p className="item">{anagrams(name)}</p>}
    </div>
  );
}
export default App;
```

You can write a test to get the basic setup out of the way also.  Open the App.test.tsx file and do something like this:

#### **`src/App.test.tsx`**

```js
it('should display "Output: Dojo." after entering name', () => {
  const { getByText, getByLabelText } = render(<App />);
  const nameInput = getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Dojo" } });
  fireEvent.click(getByText(/submit/i));
  const expectedMessage = "Output, Dojo.";
  expect(getByText(expectedMessage)).toBeDefined();
});
```

### Step one:  write a test

Now it's time to get started.  Write a test for the kind of result that you are expecting.

#### "Don't boil the ocean when writing a test."

You might be tempted to test for the word "biro" which is shown in the instructions.  But Tony said during the first React dojo session "don't boil the ocean".   Instead of trying to test for a long array of anagrams (by typing in or pasting and formatting 24 strings), we can just use the smallest possible problem set, like 'ab' instead.

#### **`src/App.test.tsx` pt 2**

```js
import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import App from './App';

it('should display anagrams of given input', () => {
  const {getByText, getByLabelText} = render(<App/>);
  const nameInput = getByLabelText(/name/i);
  fireEvent.change(nameInput, {target: {value: "ab"}});
  fireEvent.click(getByText(/submit/i));  
  const expectedAnagrams = [
    'ab', 'ba'
  ];
  expectedAnagrams.forEach((anagram) => {
    expect(document.body.innerHTML).toMatch(anagram);
  })
});
```

### Step two: make is pass

The simplest way to make the test pass that we're going to do may sound like cheating, but it's not.  Just by returning the expected array checks that the test is actually working properly.  After this you can move on to the refactor step.

#### **`src/App.tsx` pt 2**

```js
const anagrams = (word) => {
  return "ab ba";
}
...
{displayMessage && <p className="item">{anagrams(name)}</p>}
```

### Step three: refactor

(coming soon)
