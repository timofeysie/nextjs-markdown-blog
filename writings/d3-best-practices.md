---
title: "D3 Best Practices in React"
date: "2022-12-25"
og:
  description: "Best practices for using the D3 charting and visualization library in React apps"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- The goal of this article is to capture details about best practices using D3 in react
- Meta study of demonstrated techniques for using D3 with React and eventually Redux in this case

## Introduction

npm install d3

### D3 API links

https://d3-wiki.readthedocs.io/zh_CN/master/Scales/

https://github.com/d3/d3/blob/main/API.md#scales-d3-scale

### Source articles

[D3 starters guide](https://megagon.ai/react-d3-a-starters-guide).

- Compares approaches

[creating-data-visualizations-with-d3-and-reactjs](https://medium.com/codesphere-cloud/creating-data-visualizations-with-d3-and-reactjs-c288d7890390)

- Bar and line graph examples, and getting comfortable editing the DOM to dynamically insert p tags based on data.

[Using D3.js with React.js: An 8-step comprehensive manual](https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/) by griddynamics

- Extensive three line graph stock examples.

[Free code camp historical price charts](https://www.freecodecamp.org/news/how-to-build-historical-price-charts-with-d3-js-72214aaf6ba3/)

### D3 React options

There are two basic methods for using D3 with React as discussed in the [D3 starters guide](https://megagon.ai/react-d3-a-starters-guide).

1. React Faux DOM npm package

Keep most of D3’s utility and combine it with React. The faux DOM is placed to allow D3 a virtual DOM so you can still access all of D3’s API. At the same time, React remains in control of the virtual DOM and ultimately the real DOM, allowing it to control state and transitions.

2. React for the DOM and D3 for Calculations

There are two different approaches for this type.

#### A: D3 within React

In this option we will use D3’s data-driven layouts and style but data will be passed on to React for eventual rendering. Likewise, the user input will be taken in by React, recorded in state and passed to D3 for recalculation. The tradeoff: we lose the D3 transition suit and updating but are still able to have dynamically changing charts due to React’s DOM instant updates. Let me break down two ways to do this:

This method is the useEffect( ) way that is discussed in detail in the Medium article [Creating Data Visualizations with D3 and ReactJS](https://medium.com/codesphere-cloud/creating-data-visualizations-with-d3-and-reactjs-c288d7890390) published by Codesphere.

#### B: Lifecycle Methods Wrapping

This allows more of a modularized implementation. It’s also the approach I took for Extreme Reader. If you are already good at D3 and a beginner to React, this method allows you to take a chart or visualization with which you are purely using D3 and easily implement it in your React project by importing the JavaScript class into a React container component. The container component then wraps the visualization in its React lifecycle methods.

## The layered approach

The [React D3 starters guide](https://megagon.ai/react-d3-a-starters-guide) shows pseudo code which has a nice layered approach with a container and a chart.

[This article by Codesphere](https://medium.com/codesphere-cloud/creating-data-visualizations-with-d3-and-reactjs-c288d7890390) has good examples of using D3 to create bar and line charts along with simple transitions, but it dumps everything in the App.js file which is not a good way to go for actual apps.

It took a while to get the select statements working with the element props passed in and the Codesphere Medium article. The trick was to use two selects in the d3 object:

```javascript
d3.select(element).select("#BarChart");
```

Combining the two sample code bases shows a mature approach with decent D3 basics. The chart object is a class, and would ideally be a functional component. However, it's not immediately clear how to transform the "this" as it's being used:

```javascript
class D3Chart {
  constructor(element) {
    //initialize graph
    let vis = this;
```

## An 8-step comprehensive manual

These examples are in-depth and introduce animations and interactions in a step-by-step fashion. They also use line graphs to chart stock, which is what my goal at the moment is.

### Step 1 MultilineChart dimensions

```javascript
const MultilineChart = ({ data, dimensions }) => {
const svgRef = React.useRef(null);
const { width, height, margin } = dimensions;
const svgWidth = width + margin.left + margin.right;
const svgHeight = height + margin.top + margin.bottom;
```

#### Usage

<MultilineChart
data={[portfolioData, schcData, vcitData]}
dimensions={dimensions}
/>

Data Format

```json
{
    "date": "2019-07-16",
    "marketvalue": 96525.107316,
    "value": 0.06505874978567416
},
```

The dimensions used look like this:

```js
const dimensions = {
  width: 600,
  height: 300,
  margin: { top: 30, right: 30, bottom: 30, left: 60 },
};
```

As a front end developer, I always think how would a responsive layout work when I see static dimensions. To see how this would work with responsive dimensions, I took a little help from a [StackOverflow](https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs) answer, and used a hook called useWindowDimensions written by QoP.

The complete hook looks like this:

```js
import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDi mmensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
```

This works well, but the data is loaded in the the App.js, and passed into the MultilineChart component. This means the data will be reloaded each time the window is resized which is not very performant.

As with the other example which also used canned data, it's not realistic and should be coming from an API.

Also, if we want to use the D3 charts in detail page where the space should be limited, we actually don't want to use the window dimensions, but the parent dimensions.

The [Bobby Hadz](https://bobbyhadz.com/blog/react-get-parent-width-height) approach shows using a ref on the surrounding div to set the dimensions:

```js
import {useEffect, useRef, useState} from 'react';

export default function App() {
  const ref = useRef(null);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setHeight(ref.current.offsetHeight);
    setWidth(ref.current.offsetWidth);
  }, []);

  return (
    <div ref={ref}>
      <h2>Width: {width}</h2>
      <h2>Height: {height}</h2>
    </div>
  );
}
```

Using the sample in the Redux Essentials app also causes this error;

### Step 1 in the Redux Essentials app

Implementing step 1 of the 8-step comprehensive manual](https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/) by griddynamics cuases the following issues:

index.js:1 Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.

src\features\charts\MultilineChart.js
  Line 72:6:  React Hook React.useEffect has missing dependencies: 'height', 'margin.bottom', 'margin.left', 'margin.top', and 'width'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

## The data sources

With all these examples, they use canned data, which is not a best practice, obviously. What is the best practice for fetching data from an API? Using Redux toolkit, and possibly RTK Query if possible.

There are a few options for the starting point that can be used to then implement one of the D3 examples. We can then simulate a real-world API call situation with loading state and caching and error handling.

Option 1 is where [Thunk's are used](https://redux.js.org/tutorials/essentials/part-6-performance-normalization).

Option 2 would be to use the completed app with RTK Query completed. Here is the [live code sandbox example](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/checkpoint-6-rtkqConversion/?from-embed).

The problem with option 2 is that I have yet to complete the two extensive web pages that introduce RTK Query and it's advanced options for controlling how to manage cached data. Also, since Thunks are more standard, and RTK Query is rather new and no one knows at this point if it will be accepted as a best practice in the React community, it's tempting to stick with the example app at the end of step 6.

After thinking about this, I'm going to go with option 1 for now.

The tag for this spot in the tutorial is [checkpoint-4-entitySlices](https://github.com/reduxjs/redux-essentials-example-app/tree/checkpoint-4-entitySlices/).

The goal of this article is not really to provide a comprehensive tutorial on all the tooling involved in a frontend project, but it's worth mentioning how to checkout a tagged place in a codes development. I did this at the start:

```shell
> git checkout tags/checkpoint-4-entitySlices
> cd checkpoint-4-entitySlices
> git branch
* (HEAD detached at checkpoint-4-entitySlices)
  master
```

As you can see, we are in a detached head state now. James Gallagher explains: _A detached HEAD occurs when you check out a commit that is not a branch. The term detached HEAD tells you that you are not viewing the HEAD of any repository. The HEAD is the most recent version of a branch. This is sometimes called the “tip of a branch”... To save a change from a detached HEAD, you need to create a new Git branch_

There are two changed files after running npm i that may or may not be needed. Mock Service Worker 0.36.3 has been bumped to 0.36.8 and the public\mockServiceWorker.js file, as well as the package-lock.json file.

Now the code from the [last section titled Converting the Notifications Slice](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#converting-the-notifications-slice) is ready as the starting point to include the D3 example code and create a mock API to be used with Redux in a real-world-ish scenario.

### Future proof

On thing about the choice above is that it may affect the future of the project.  One of the problems with blogging about frontend development in general is that the landscape is continually changing.  All those packages in the node_modules are being updated and new versions coming out all the time.  Patches and minor changes are not so much of a problem, but major updates usually mean breaking changes.  You either stay up to date with these or you incur gradual technical debt that will render the project meaningless.

If the Redux team continues to support this demo app with future updates, then we should be able to pull the latest into the master branch, and merge that into our work and have the updates happen pretty easily.  Then it's just about looking at where the breaking changes are and fixing those.

However, since we went with option 1, there is a danger that the tags will change, and we wont be able to get a working version that uses the thunks without the RTK Query final version of the app.  I'm just pointing this out now, and will have to come back to this at some point in the future and see how this plays out.

## Directory structure

In the first D3 project I wrote based on the creating-data-visualizations-with-d3-and-reactjs on medium.com by codesphere-cloud combined with the react-d3-a-starters-guide article concept by megagon.ai used this structure:

/components/LineGraphContainer.js

It seemed like the layered approach should have separate component "features", so really, they are features.

How about this:

```txt
├── app
│   ├── Navbar.js
│   └── store.js
├── components
│   └── spinner.js
└──  features
    ├── notifications
    ├── posts
    ├── users
    └── charts
        ├── Container.js
        └── Chart.js
```

It's OK for now, but there has to be a better way, otherwise why have a container and chart in separate files rather than one file unless there was utility to share them. There must be some shared features between different types of visualizations. Such as, what is common between the bar and svg line chart?

Another thing to consider here is the styles.

Using feature directories [is considered a best practice](https://blog.webdevsimplified.com/2022-07/react-folder-structure/) for advanced projects.  The idea is to put all the files that have the same purpose in a separate feature directory.  In React this often means putting styles into files which might seem to break the Single Responsibility rule but since we are talking about the purpose, not just the type of code, it makes sense to colocate the styles and other parts in this directory.

This does not mean that the file structure has to stay the same as things grow.  As we can see from the posts feature folder, there is potential here for refactoring features already.

```txt
└──  features
    ├── notifications
    └── posts
        ├── AddPostForm.js
        ├── EditPostForm.js
        ├── PostAuthor.js
        ├── PostsList.js
        ├── postsSlice.js
        ├── ReactionButtons.js
        ├── SinglePostPage.js
        └── TimeAgo.js
```

TimeAgo should be in a utilities directory.  PostAuthor could be in a new feature.  I would be interesting to see how this structure could scale for a full fledged micro-posting app specifically for sharing charted data.  Maybe even 0

### Styles

Uncaught Error: Cannot find module '../App.css'
at webpackMissingModule (D3Chart.js:58:1)

The only file that uses styles from the codesphere-cloud article is the chart component. This can be co-located also in that directory for now: features/charts/styles.css

And the samples work fine in this setting. Now to get the content from the store.

## The concept

Since the app is a chat app, and we want to show stock indexing visualizations, it might be a good idea to have a specific subject for the posts to be about, namely, the performance of stocks.

So along with the D3Chart dataSet and the array of line data from the line graph container.

### D3Chart dataSet

```js
[{ subject: "Indexes", count: 500 }, ... ];
```

### Line graph container data

```js
0: x: 1, y: 69
```

We can have a reference for these in a post with an external id like the user id:

```js
{
  content: "Ad maiores voluptatem accusamus.\n \rFugit ipsa maiores alias sit. Sequi totam iste nihil sapiente et ..."
  date: "2022-12-20T16:23:13.427Z"
  id: "uIZpo995gP8E_4Fy7cS0a"
  reactions: {id: 'fLHJOxBvuP7272EbC6AbE', thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, …}
  title: "quis consequuntur officiis"
  user: "2MpTTbRoN3EEGKaDBpo91"
}
```

For example, a user wants to compare the S&P 500 index with the Dow Jones Index for a certain period.  This these charts then become part of the content of a post.

This would be a big feature, so should be broken down into multiple sections.

Now that the bar and line charts are being used for the detail pages, which are not full screen, the width/height hook can be used to limit the size.

The goal would be to have a micro graph for the list of posts, and a medium sized on for a single post, and a full sized version when the user clicks on the chart, possibly with interactions.  This is a big set of features, but can create a really valuable app for users.

## Material UI

In many apps, a ready to go UI framework is used.  Some of the top ones are Bootstrap, Tailwind and [Material UI](https://mui.com/material-ui/getting-started/overview/).

We will be using MUI here, which supports styled-components:

```shell
npm install @mui/material @mui/styled-engine-sc styled-components
npm install @fontsource/roboto
npm install @mui/icons-material
```

https://mui.com/material-ui/react-card/#media

<Card sx={{ maxWidth: 345 }}>

(to be continued ...)
