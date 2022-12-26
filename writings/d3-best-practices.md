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

## Introduction

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
    d3.select(element) 
      .select("#BarChart") 
```

Combining the two sample code bases shows a mature approach with decent D3 basics.  However, the chart object is a class, and would ideally be a functional component.  However, it's not immediately clear how to transform the "this" as it's being used:

```javascript
class D3Chart {
  constructor(element) {
    //initialize graph
    let vis = this;
```

## An 8-step comprehensive manual

These examples are in-depth and introduce animations and interactions in a step-by-step fashion.  They also use line graphs to chart stock, which is what my goal at the moment is.

### Step 1 MultilineChart

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
  margin: { top: 30, right: 30, bottom: 30, left: 60 }
};
```

As a front end developer, I always think how would a responsive layout work when I see static dimensions.  To see how this would work with responsive dimensions, I took a little help from a [StackOverflow](https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs) answer, and used a hook called useWindowDimensions written by QoP.

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
  const [windowDimensions, setWindowDimensions] = useState(
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

This works well, but the data is loaded in the the App.js, and passed into the MultilineChart component.  This means the data will be reloaded each time the window is resized which is not very performant.

As with the other example which also used canned data, it's not realistic and should be coming from an API.

## The data sources

With all these examples, they use canned data, which is not a best practice, obviously.  What is the best practice for fetching data from an API?  Using Redux toolkit, and possibly RTK Query if possible.

There are a few options for the starting point that can be used to then implement one of the D3 examples.  We can then simulate a real-world API call situation with loading state and caching and error handling.

Option 1 is where [Thunk's are used](https://redux.js.org/tutorials/essentials/part-6-performance-normalization).

Option 2 would be to use the completed app with RTK Query completed.  Here is the [live code sandbox example](https://codesandbox.io/s/github/reduxjs/redux-essentials-example-app/tree/checkpoint-6-rtkqConversion/?from-embed).

The problem with option 2 is that I have yet to complete the two extensive web pages that introduce RTK Query and it's advanced options for controlling how to manage cached data.  Also, since Thunks are more standard, and RTK Query is rather new and no one knows at this point if it will be accepted as a best practice in the React community, it's tempting to stick with the example app at the end of step 6.

After thinking about this, I'm going to go with option 1 for now.

The tag for this spot in the tutorial is [checkpoint-4-entitySlices](https://github.com/reduxjs/redux-essentials-example-app/tree/checkpoint-4-entitySlices/).

The goal of this article is not really to provide a comprehensive tutorial on all the tooling involved in a frontend project, but it's worth mentioning how to checkout a tagged place in a codes development.  I did this at the start:

```shell
> git checkout tags/checkpoint-4-entitySlices
> cd checkpoint-4-entitySlices
> git branch
* (HEAD detached at checkpoint-4-entitySlices)
  master
```

As you can see, we are in a detached head state now.  James Gallagher explains: *A detached HEAD occurs when you check out a commit that is not a branch. The term detached HEAD tells you that you are not viewing the HEAD of any repository. The HEAD is the most recent version of a branch. This is sometimes called the “tip of a branch”... To save a change from a detached HEAD, you need to create a new Git branch*

There are two changed files after running npm i that may or may not be needed. Mock Service Worker 0.36.3 has been bumped to 0.36.8 and the public\mockServiceWorker.js file, as well as the package-lock.json file.

Now the code from the [last section titled Converting the Notifications Slice](https://redux.js.org/tutorials/essentials/part-6-performance-normalization#converting-the-notifications-slice) is ready as the starting point to include the D3 example code and create a mock API to be used with Redux in a real-world-ish scenario.
