---
title: "E2E Testing with Cypress and Cucumber"
date: "2024-03-25"
og:
  description: "End-to-end testing with Cypress and Cucumber using the plain English Gherkin syntax for Behavior Driven Development."
  image: "images/Capture-react-tdd.PNG"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- This tutorial walks you through using the Gherkin assertion library with Cypress for frontend testing to enable Behavior Driven Development.

I have written a lot about unit testing and TDD.  However, there are a lot of limitations with unit tests.  Primarily the dependency setup is always difficult, and tests go out of date quickly.  The power of e2e testing is that if a website is running, it can be tested.  Add the ability of Cucumber and it's Gherkin syntax, and we get a human readable executable specification that anybody on the project can compose and read the results of.  So lets get into it!

## Project setup

If you want to create your own testing project from scratch, I would recommend following the steps in the README of [this repo](https://github.com/timofeysie/cypress-cucumber).

If you want to get started quickly, you can just clone it and replace the three types of files that go into create the tests with your own.

I tried to create a TypeScript version but due to incompatibilities of some of the packages involved, I abandoned that effort and I recommend a vanilla JavaScript approach.

## Your First Gherkin

If you are starting out, here are the of the tools we will be using.

[Cypress](https://docs.cypress.io/guides/overview/why-cypress) is a frontend testing tool built for web apps.

[Cucumber](https://cucumber.io/school/) enables Behavior-Driven Development (BDD).

Tests can be written in [Gherkin Syntax](https://cucumber.io/docs/gherkin/) which is called 'human readable'.

The goal is to write a test with natural language such as "Given I am on the homepage, when I click the 'Posts' link, then I should be on the Posts page".

These are known as *[executable specifications](https://cucumber.io/blog/hiptest/what-are-executable-specifications/)* in "Given-When-Then-And-But" steps. These scenarios are saved as `.feature` files in the [yaml](https://en.wikipedia.org/wiki/YAML) format.  An example of one of these from this project looks like this:

```yml
Feature: Navigation
  Scenario: Navigating to sign in page
    Given I am on the HomePage
    When I click the "Sign in" link
    And I enter the username "..."
    And I enter the password "..."
    And I click on the sign in button
    Then I will be signed in
```

These scripts connect with Javascript files to provide end-to-end tests for a web app.

## The basics

Imagine we have a web page with navigation elements we want to test.  We start by creating a page object that contains selectors for the elements we want to test.  It can have elements and user actions defined.

In this example we use the cypress\support\page_objects\PostsList.js file this project like this:

```js
class NavPage {
    // Elements
    get postsLink() {
        return cy.get('nav a[href="/"]');
    }
    ...
    // Actions
    clickPostsLink() {
        this.postsLink.click();
    }
    ...
}
```

This is a support [Page Object Model](https://medium.com/tech-tajawal/page-object-model-pom-design-pattern-f9588630800b) which is a design pattern to use an object to represent the page for use in testing.

It uses the Cypress Query [get](https://docs.cypress.io/api/commands/get) to get a DOM elements by a selector which can be used by the 'postsLink' getter function.

Imagine this nav-spec.js file uses the above page object to test the list on the web app:

```js
import PostsList from '../support/page_objects/PostsList';

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/'); // Assuming this is the URL of your page
  });

  it('should navigate to Posts page', () => {
    PostsList.clickPostsLink();
    // Add assertions or further actions related to the Posts page
  });

  it('should refresh posts when Refresh Posts button is clicked', () => {
    PostsList.clickRefreshPostsButton();
    // Add assertions or further actions related to refreshing posts
  });

});
```

This is a plain cypress test and does not provide the readable specification shown above.  To do that we need the power of cucumber and gherkin.

If we want to convert the above to use cucumber, this is what it would look like.

We have a cypress\support\step_definitions\navigation.steps.js file that contains our cucumber assertions:

```js
Given('I am on the homepage', () => {
  cy.visit('/');
});

When('I click the {string} link', (linkText) => {
  if (linkText === 'Posts') {
    PostsList.clickPostsLink();
  } else if (linkText === 'Refresh Posts') {
    PostsList.clickRefreshPostsButton();
  }
});
```

The steps definition file connects the gherkins feature file to the PO.

The cucumber test with gherkin syntax in a yml format looks like this:

```yml
Feature: Navigation

  Scenario: Navigating to Posts page
    Given I am on the homepage
    When I click the "Posts" link
    Then I should be on the Posts page
```

## In brief

In brief we go from a Page Object -> Cucumber definition -> Gherkin test.

1. cypress\support\page_objects\PageName.js
2. cypress\support\step_definitions\page.steps.js
3. cypress\e2e\features\page.feature (yml)

In code this looks like the following:

### cypress\support\page_objects\PostsList.js

```js
class NavPage {
    // Elements
    get postsLink() {
        return cy.get('nav a[href="/"]');
    }

    // Actions
    clickPostsLink() {
        this.postsLink.click();
    }
}
```

### cypress\support\step_definitions\navigation.steps.js

```js
Given('I am on the homepage', () => {
  cy.visit('/');
});

When('I click the {string} link', (linkText) => {
  if (linkText === 'Posts') {
    PostsList.clickPostsLink();
  } else if (linkText === 'Refresh Posts') {
    PostsList.clickRefreshPostsButton();
  }
});

Then('I should be on the Posts page', () => {
  // Add assertions or further actions related to the Posts page
  // For example: cy.url().should('include', '/posts');
});
```

### cypress\e2e\features\navigation.feature

```yml
Feature: Navigation

  Scenario: Navigating to Posts page
    Given I am on the homepage
    When I click the "Posts" link
    Then I should be on the Posts page
```

The important thing is that language in the Cucumber Expression matches the Gherkin step.

The [official Cucumber docs say](https://cucumber.io/docs/cucumber/step-definitions/?lang=javascript): *A Step Definition is a method with an expression that links it to one or more Gherkin steps. When Cucumber executes a Gherkin step in a scenario, it will look for a matching step definition to execute.*

## A real work example

I have a demo social network site I want to test.

I set the baseUrl in the cypress.config.js file.

I want to test the sign in functionality.  This starts with the home page nave bar link to sign in.

In cypress\support\page_objects\HomePage.js I create a get statement for the sign in link and then a function to click it.

```js
class NavPage {
    // Elements
    get signinLink() {
        return cy.get('nav a[href="/signin"]');
    }
    // Actions
    clickSigninLink() {
        this.signinLink.click();
    }
}
```

In the cypress\support\step_definitions\navigation.steps.js file using the Given/When/Then Cucumber functions I visit the home page, check that I am not already signed in, then call the sign in function created above.

Then I check that I am on the sign in page.

```js
Given('I am on the HomePage', () => {
  cy.visit('/');
});

When('I click the {string} link', (linkText) => {
  if (linkText === 'Sign in') {
    HomePage.clickSigninLink();
  }
});

Then('I should be on the Sign in page', () => {
  cy.url().should('include', '/signin');
});
```

In the cypress\e2e\features\navigation.feature file I compose the steps in Gherkin syntax to use the above functionality.

```yml
Feature: Navigation

  Scenario: Navigating to Sign in page
    Given I am on the HomePage
    When I click the "Sign in" link
    Then I should be on the Sign in page
```

Then in the command line, I run ```npx cypress open```, choose e2e testing, choose a browser and "start e2e testing in <browser>", and the navigation test and it runs and I sit back and watch it do its thing.

### Signing in

After arriving on the sing in page, next we want to enter credentials and confirm sign in.  That looks like this.

#### file: cypress\support\page_objects\HomePage.js

```js
elements = {
    usernameInput: () => cy.get('#username'),
    passwordInput: () => cy.get('#password'),
    signinBtn: () => cy.get('form button[type="submit"]')
}

typeUsername(username) {
    this.elements.usernameInput().type(username, { force: true });
}

typePassword(password) {
    this.elements.passwordInput().type(password, { force: true });
}

clickSignin() {
    this.elements.signinBtn().click();
}
```

#### file: cypress\support\step_definitions\navigation.steps.js

```js
Then('I should be on the Sign in page', () => {
  cy.url().should('include', '/signin');
});

And('I enter the username {string}', (username)=> {
  HomePage.typeUsername(username);
})

And('I enter the password {string}', (password)=> {
  HomePage.typePassword(password);
})

And('I click on the sign in button', ()=> {
  HomePage.clickSignin()
})

Then('I will be signed in', ()=> {
  cy.url().should('contains' , '/');
})
```

#### file: cypress\e2e\features\navigation.feature

```yml
And I enter the username "Centrist1"
And I enter the password "iamthelizardking"
And I click on the sign in button
Then I will be signed in
```

## Further resources

If you are curious about going deeper, there is a lot of good documentation that can help you write all kinds of test scenarios.

You can look at the official [cypress-cucumber-preprocessor guide](https://www.browserstack.com/guide/cypress-cucumber-preprocessor) which also shows how to install and create a Cucumber test.

The Given, When, Then, And, or But are [Step keywords](https://cucumber.io/docs/gherkin/reference/?sbsearch=given#keywords).

The [Before](https://cucumber.io/docs/cucumber/api/?lang=javascript#hooks) keyword is a hook which runs before the first step of each scenario.

## Summary

I hope you enjoyed this introduction.  Testing can be a powerful tool not only for developers and testers, but with human readable BDD testing, anyone can start to write assertions to confirm behavior in web development.

Also considering that natural language is tipped to be the new coding language due to the rise of ML/AI and ChatGPT (which can often be wrong) writing tests to confirm what is expected will also become more and more important.

The hard part wont be writing code from scratch anymore.  It will become properly testing that code for bugs, along with breaking down large problems into smaller steps the AI can handle.

In another post I will cover knitting together those steps into a complete solution with the [Red-Green-Refactor coding game](/writings/rgr-coding-game-getting-started) using Cucumber, React and Django.

Use the hashtag #e2eTestingWithCypressAndCucumber and the link below on [Twitter](https://twitter.com/) for any comments or feedback.
