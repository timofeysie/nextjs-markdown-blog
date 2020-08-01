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

This blog will go through a basic anagram generating example in Javascript using React and TypeScript.  I will cover TDD, how the group works, how to set up the stack and then step through the exercise.  If you just want to look at the coding example, you can skip ahead.

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
import React from "react";
import "./App.css";

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
      {displayOutput && <p className="item">{input}</p>}
    </div>
  );
}
export default App;
```

This app now has an input, that when the submit button is pressed, will output the contents of the input.  We are using React hooks to create two values, and functions to set them:

```js
  const [displayOutput, setDisplayMessage] = React.useState(false);
  const [input, setOutput] = React.useState("");
```

We could import useState from React and use it without the dot notation there, but we can do that later when refactoring.  Anyhow, now we have something that will let the user enter the text they want to generate anagrams for, so we can move on to step one.

Open the App.test.tsx file and check it out.  This is the test that was generated by create-react-app:

#### **`src/App.test.tsx` initial**

```js
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

Since we replaced the original App.tsx file with the input, this test should be failing now, which is fine.  Let's move on.

### Step one:  write a test

Now we will write a test for the kind of result that you are expecting.  If you think about the specification for the program we want to write, you can get an idea of what will prove that it is working.  Let's read the goal again:

*Write a program to generate all potential anagrams of an input string.*

So we will have a function that accepts the input string and output *all potential anagrams*.  That is all the combinations of the letters of the input.  This will be printed out on web page, which means it will be in the html.

We have to fire the submit button being pressed action, and look for the output.  We could do something like this:

#### **`src/App.test.tsx` pt 2**

```js
import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import App from './App';

it('should display anagrams of given input', () => {
  const {getByText, getByLabelText} = render(<App/>);
  const nameInput = getByLabelText(/Enter text/i);
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

If you run the tests (or look at the tests that are already running), you will see something like this:

```bash
 FAIL  src/App.test.tsx
  × should display anagrams of given input (46ms)
  ● should display anagrams of given input
    expect(received).toMatch(expected)
    Expected substring: "ba"
    Received string:    "<div><div class=\"App\"><label for=\"name\" class=\"item padding\">Enter text</label><input id=\"name\" type=\"text\" class=\"padding\"><button class=\"padding\">Submit</button><p class=\"item\">ab</p></div></div>"
      12 |   ];
      13 |   expectedAnagrams.forEach((anagram) => {
    > 14 |     expect(document.body.innerHTML).toMatch(anagram);
         |                                     ^
      15 |   });
      16 | });
      17 |
      at forEach (src/App.test.tsx:14:37)
          at Array.forEach (<anonymous>)
      at Object.<anonymous> (src/App.test.tsx:13:20)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        3.46s
Ran all test suites.
```

So you can see in the output there that our <p> tag doesn't have the expected output:

```html
<p class=\"item\">ab</p></div>
```

#### "Don't boil the ocean when writing a test."

You might be tempted to test for the word "biro" which is shown in the instructions.  But Tony said during the first React dojo session "don't boil the ocean".   Instead of trying to test for a long array of anagrams (by typing in or pasting and formatting 24 strings), we can just use the smallest possible problem set, like 'ab' instead.

If you want to see this change, you can check out the commit I made for [the demo project here](https://github.com/timofeysie/react-tdd-dojo/commit/725f47be69f0392a2d32eda8383bf33205c183d6).

Now we have confirmed that the test is looking for something we want.  Time to move on to the next step.

### Step two: make is pass

The simplest way to make the test pass that we're going to do may sound like cheating, but it's not.  Just by returning the expected array checks that the test is actually working properly.  After this you can move on to the refactor step.  Lets implement the simplest function we can to make our test pass.

In the App.tsx file, right after we declare the ```const [input, setOutput] = React.useState("");```, add this function:

#### **`src/App.tsx` step 2 - a**

```js
const anagrams = (word: string) => {
  return "ab ba";
};
```

Next, where we output the text ```{input}```, we can instead call the function with that input like this:

#### **`src/App.tsx` step 2 - b**

```js
{displayOutput && <p className="item">{anagrams(input)}</p>}
```

The output from the tests now should look like this:

```bash
 PASS  src/App.test.tsx
  √ should display anagrams of given input (49ms)
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.578s
Ran all test suites.
```

If you want to see this change, you can [check out the next commit here](https://github.com/timofeysie/react-tdd-dojo/commit/f19f445529282bafbed8a51b5eddf176e9a2f7d4].

Other options for this step might be to do a Google search for a JavaScript anagram generator, and just paste that in to make the test pass in an actual working way.  That's also valid.  I think however there is value to "testing the test".  We might somehow get the test to pass when it should be failing by using code we don't understand, and that would be bad.

However, since it's time for the next step, we could try something like that when refactoring the solution.

### Step three: refactor

Here is a basic function that will do a more realistic job for us.  Change the anagrams function to look like this:

#### **`src/App.tsx` step 3 - a**

```js
  const anagrams = (word: string): string => {
    return word
      .split("")
      .map((character: string, index: number) => {
        const head = word.slice(0, index);
        const tail = word.substring(index + 1);
        const result: string[] = [];
        for (let nextCharInTail of head) {
          result.push(character + nextCharInTail);
        }
        for (let nextCharInTail of tail) {
          result.push(character + nextCharInTail);
        }
        return result;
      })
      .join(" ");
  };
```

Now if you run the tests, it passes!  But does the app do what we want it to do yet?  Run the app with the command ```npm start``` and test it out.

If you enter "ab", you will see the expected results there returned by the function above.  But if you enter the text from the instructions, "biro" you will see this output:

```txt
bi,br,bo ib,ir,io rb,ri,ro ob,oi,or
```

So, yeah, we have a problem.  But never fear, TDD is here!  What do we do?  Back to step 1.  We write a failing test.  Let's do that now.

### Step one again

Open the test file and create a new test for what we want to see.

```js
it("should display anagrams of given input", () => {
  const {getByText, getByLabelText} = render(<App/>);
  const nameInput = getByLabelText(/Enter text/i);
  fireEvent.change(nameInput, {target: {value: "biro"}});
  fireEvent.click(getByText(/submit/i));  
  const expectedAnagrams = [
    "biro", "bior", "brio", "broi", "boir", "bori",
    "ibro", "ibor", "irbo", "irob", "iobr", "iorb",
    "rbio", "rboi", "ribo", "riob", "roib", "robi",
    "obir", "obri", "oibr", "oirb", "orbi", "orib",
  ];
  expectedAnagrams.forEach((anagram) => {
    expect(document.body.innerHTML).toMatch(anagram);
  })
});
```

This test will fail in the same way our manual test of the function failed.  I wont go into an actual real life solution here.  I'm sure you could find a better function that the one we used above.  Or you could take the challenge and fix the function yourself.

It's fun to do pair programming or "mobbing" with larger groups online to solve something like this.  Use the hashtag #tdd-react-anagram and the link below on Twitter to let me know how it goes!
