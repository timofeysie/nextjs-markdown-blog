---
title: "Algorithms and Data Structures using TypeScript in React"
date: "2024-09-23"
og:
  description: "A detailed walk through of Algorithms and Data Structures using TypeScript with examples"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- This article gives an overview of the Algorithms and Data Structures in JavaScript repo by Oleksii Trekhleb.
- It takes the example code and explores these concepts in the context of TypeScript as used in React.

## Algorithms and Data Structures using TypeScript in React

This article is inspired by the awesome [Algorithms and Data Structures in JavaScript](https://github.com/trekhleb/javascript-algorithms) GitHub repo by Oleksii Trekhleb.

It is a popular project that introduces the concepts with well defined class-based code examples.  Lets dive in to this codebase and then apply the concepts there to React using Typescript.

First, here is a brief overview of the subject.

### Data structures

*A data structure is a particular way of organizing and storing data in a computer so that it can be accessed and modified efficiently.*

### Algorithms

*Algorithms are an unambiguous specification of how to solve a class of problems. It is a set of rules that precisely define a sequence of operations.*

>[Fun fact] The etymology of the term came from the name of a Persian scientist and polymath Muḥammad ibn Mūsā al-Khwārizmī who wrote *kitāb al-ḥisāb al-hindī* ("Book of Indian computation") around 825 AD.  He is also credited for the term algebra comes from *Al-Jabr* in the same book (meaning "completion" or "rejoining").  Readers might know that our number system is also based on the Hindu–Arabic numeral system (or decimal system) which replaced the cumbersome Roman numerals in the early 16thj century.

### Why know them?

Coders have to solve problems, many of which fit archetypes that have been solved many times before.  Why not stand on the shoulders of the giants and pick and choose a solution that has known tradeoffs rather than re-inventing the wheel and discovering the tradeoffs down the road when its too late to change anything.

They could be seen as a short cut to struggling through a problem to find a solution.  It's not to say that there are not new or unique problems that require new and unique approaches, but having a knowledge of how to approach a challenge and see a pattern that fits a data type or algorithm can save a lot of time.  When you code as a job, time is money and many startups fail as they arrive at the proper solution too late.  The right answer that takes too long is actually the wrong answer in a lot of cases.

As a collection of data values with relationships and functions to work with them, each type has important trade-offs. During a coding technical test we need to pay attention more to why a certain data structure is appropriate for the challenge.

For more about why they are important, read this short piece called [1 Year of Consistent LeetCoding](https://dev.to/davinderpalrehal/1-year-of-consistent-leetcoding-26d0) by Davinderpal Singh Rehal.  He calls them DSA (Data Structures and Algorithms) and goes over some of the most common ones and how he loves testing himself with them.

### The Trekhleb

The aforementioned Algorithms and Data Structures in JavaScript repo (which I call The Trekhleb here) is a very exhaustive list of data structures and algorithms with pseudo code, vanilla JavaScript examples with unit tests and even links to Wikipedia pages and videos from the [hacker rank channel](https://www.`yo`utube.com/@HackerrankOfficial).  There are many contributors, 1,115 commits so far, the last only two months ago.  These seem to mainly be translations of the content into the 18 languages available.  So they are really trying to spread the word there.

One limitation I see with it is that it does not fit in with the way I code these days, which is usually in TypeScript and in a React/Node setting.

The examples are class-based and don't match the coding paradigm that I use daily on the job.  Consider this example of the linked list:

```js
import LinkedList from '../linked-list/LinkedList';

export default class Queue {
  constructor() {
    this.linkedList = new LinkedList();
  }

  isEmpty() {
    return !this.linkedList.head;
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.linkedList.head.value;
  }

  enqueue(value) {
    this.linkedList.append(value);
  }

  dequeue() {
    const removedHead = this.linkedList.deleteHead();
    return removedHead ? removedHead.value : null;
  }
}
```

### Frontend vs. Backend

These days JavaScript does not immediately mean frontend, as its is equally at home on the backend.  The class-based approach taken by the Trekhleb would be right at home in my favorite backend JavaScript/TypeScript backend framework [NextJS](https://docs.nestjs.com/) which might remind Angular developers of the class-based annotated approach used in that framework.

It should also be said that there are different requirements for working with data on the frontend versus the backend.

The backend has more resources and flexibility when it comes to data.  It can be seamlessly re-deployed and thoroughly unit tested.

The frontend in a mix of layout, styles and business logic that relies on a single threaded JavaScript model where long running functions can actually block the UI and result in a frozen web page.

## The goal of this article

First I will look at some of the most popular data types, such as hash tables, linked lists and trees.

I will discuss the example code at suggest some sample implementations using functional TypeScript approach.

I will then try to implement a real world solution and see how that goes.  The scop of this article has already increased quite a bit just with this, so possibly I will include the real world example in a separate article.

## Hash table

A [Hash table (hash map)](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/hash-table) is a data structure which implements an associative array abstract data type.  It contains a structure that can map keys to values.

The data type uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found
For fast lookups O(1) constant time (usually, could also be O(n) linear time)

Ideally, the hash function will assign each key to a unique bucket, but most hash table designs employ an imperfect hash function, which might cause hash collisions where the hash function generates the same index for more than one key. Such collisions must be accommodated in some way.

Todo:
    - Collision handling
    - How they grow/shrink
    - Implement simple solution
    - Practice questions

It is possible to use a JavaScript object as a hash table, or a Map.
Map stores key-value pairs, where keys can be of any data type, including objects and functions.

Order of Insertion maintained
Efficient Operations: Map provides average constant time complexity, O(1), for operations like set, get, and delete.

Why Use Map Over Object?

No Key Collisions: Unlike objects, Map keys are not limited to strings and symbols, reducing the risk of key collisions.
Size Property: Map has a size property that directly returns the number of key-value pairs.
Better Performance: Map is generally more performant for frequent additions and deletions of key-value pairs.

Another common use case is implementing an LRU (Least Recently Used) Cache.

An LRU Cache is a data structure that stores a limited number of items and removes the least recently used item when the cache reaches its capacity. This is a great way to showcase your skills with hash tables and linked lists.

When hash tables encounter collisions, they can use a technique called chaining to store multiple key-value pairs in the same bucket which is often done with a linked list.

## Linked list

This is a linear collection of data elements, in which linear order is not given by their physical placement in memory. Instead, each element points to the next. It is a data structure consisting of a group of nodes which together represent a sequence.

- Each node is composed of data and a reference (link) to the next node in the sequence.
- It offers efficient insertion or removal of elements from any position in the sequence during iteration.
- More complex variants add additional links, allowing efficient insertion or removal from arbitrary element references.
- A drawback of linked lists is that access time is linear (and difficult to pipeline).
- Faster access, such as random access, is not feasible.
- Arrays have better cache locality as compared to linked lists.

Under what circumstances are linked lists useful?  This [StackOverflow question](https://stackoverflow.com/questions/14311786/when-do-you-need-to-do-a-lot-of-insertions-and-removals-at-the-middle-of-a-se) has some good answers.

It was Asked 14 years, 6 months ago and viewed 32k times. I counted 18 answers there.

One answer: when do you need to do a lot of insertions and removals at the middle of a sequence, but not very many lookups in the list by ordinal?

Discussions about LLs often revolve around memory use and languages other than JavaScript.  It comes down to a discussion of Big O notation (more on that later).

Adding an element: O(1)
Indexing: O(n)
Getting an element in a known position: O(n)

One example answer: One of the most useful cases I find for linked lists working in performance-critical fields like mesh and image processing, physics engines, and raytracing is when using linked lists actually improves locality of reference and reduces heap allocations and sometimes even reduces memory use compared to the straightforward alternatives.

Even the least rated answers provide insight into actual usage.

Rope Strings are a good example to start with. It's a popular data structure in text editors where users want to insert and delete all over the place.

The Python data type called deque found in collections.deque uses a doubly linked list.

A vector or deque would typically be slow to add at either end, requiring (at least in my example of two distinct appends) that a copy be taken of the entire list (vector), or the index block and the data block being appended to (deque).

## Map & Set & modern JavaScript

The Set object was introduced in ECMAScript 2015 (ES6), which was officially released in June 2015.  Note the dates were used to embarrass browsers who might implement the features years later.

This was a significant update to JavaScript that introduced many new features and data structures, including Set, Map, WeakSet, WeakMap, arrow functions, let and const declarations, and more.

In JavaScript, both Map and Set are closely related to the concept of a hash table, but they serve different purposes.

### Map

This is a collection of key-value pairs where the keys can be of any type.

It is implemented using a hash table under the hood, which allows for efficient retrieval, addition, and deletion of key-value pairs.

You can think of Map as a more versatile and powerful version of the plain JavaScript object ({}), with better performance for frequent additions and deletions.

```js
const map = new Map();
map.set('key1', 'value1');
console.log(map.get('key1')); // Outputs: 'value1'
```

### Set

This is a collection of unique values, meaning it does not allow duplicate entries. It is also implemented using a hash table, which ensures that each value is stored only once and allows for efficient checks for the presence of a value.

```js
const set = new Set();
set.add('value1');
console.log(set.has('value1')); // Outputs: true
```

So, while both Map and Set use hash tables internally, Map is used for key-value pairs, and Set is used for unique values.

Since a Set is a collection of unique values. You can convert an array to a Set and then back to an array to remove duplicates:

```js
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = [...new Set(array)];
// Older JavaScript version:
const uniqueArray = Array.from(new Set(array));
```

## Trees

Trees are abstract data type/structure that **simulates a hierarchical tree structure, with a root value and subtrees of children with a parent node, represented as a set of linked nodes.*

There are four trees listed:

- Binary Search Trees: Ordered tree structure where each node has at most two children, with left subtree values less than the node and right subtree values greater.
- AVL Tree: Self-balancing binary search tree where the heights of child subtrees differ by at most one.
- Red-Black Tree: Self-balancing binary search tree with color-based balancing properties to ensure logarithmic operations.
- Segment Tree: Tree data structure for storing information about intervals or segments, allowing for efficient range queries.
- Fenwick Tree / Binary Indexed Tree: Data structure that efficiently updates elements and calculates prefix sums in a table of numbers.

### The Binary Search Tree (aka ordered or sorted binary trees)

The Trekhleb for [Binary Search Tree](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/tree/binary-search-tree) says they are *a particular type of container: data structures that store "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key*

The video linked to is a helpful introduction.

It makes finds really fast because with each step down into the tree, you have excluded half of it each time which means less and less nodes to search.

### The sample code

It's worth going into the details of the implementation of this code.

```js
import Comparator from '../../utils/comparator/Comparator';
import HashTable from '../hash-table/HashTable';

export default class BinaryTreeNode {
  constructor(value = null) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;
    this.meta = new HashTable(); // node related meta information.
    this.nodeComparator = new Comparator(); // used to compare binary tree nodes with each other.
  }
  get leftHeight() {  }
  get rightHeight() {  }
  get height() {  }
  get balanceFactor() {  }
  get uncle() {  }
  setValue(value) {  }
  setLeft(node) {  }
  setRight(node) {  }
  removeChild(nodeToRemove) {  }
  replaceChild(nodeToReplace, replacementNode) { }
  static copyNode(sourceNode, targetNode) {  }
  traverseInOrder() {  }
}
```

#### Overview of BinaryTreeNode Class

The BinaryTreeNode class represents a node in a binary tree. Each node has:

- value: The value stored in the node.
- left and right: References to the left and right child nodes.
- parent: Reference to the parent node.
- meta: A HashTable for storing additional metadata.
- nodeComparator: A Comparator for comparing nodes.

The class also includes various methods for manipulating the node and traversing the tree.

### A Functional Approach

I usually work with TypeScript in a React or Node.js setting.

So with that in mind let’s define a TypeScript interface for the node:

```TypeScript
interface BinaryTreeNode<T> {
  value: T | null;
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
  parent: BinaryTreeNode<T> | null;
  meta: Map<string, any>;
  nodeComparator: (a: T, b: T) => number;
}
```

Instead of using a class, we can use functions to create and manipulate nodes.

```TypeScript
import { Comparator } from '../../utils/comparator/Comparator';

type BinaryTreeNode<T> = {
  value: T | null;
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
  parent: BinaryTreeNode<T> | null;
  meta: Map<string, any>;
  nodeComparator: (a: T, b: T) => number;
};

const createNode = <T>(value: T | null = null): BinaryTreeNode<T> => ({
  value,
  left: null,
  right: null,
  parent: null,
  meta: new Map(),
  nodeComparator: new Comparator().compare,
});

const setLeft = <T>(node: BinaryTreeNode<T>, leftNode: BinaryTreeNode<T> | null): void => {
  node.left = leftNode;
  if (leftNode) leftNode.parent = node;
};

const setRight = <T>(node: BinaryTreeNode<T>, rightNode: BinaryTreeNode<T> | null): void => {
  node.right = rightNode;
  if (rightNode) rightNode.parent = node;
};

const setValue = <T>(node: BinaryTreeNode<T>, value: T): void => {
  node.value = value;
};

const traverseInOrder = <T>(node: BinaryTreeNode<T> | null, callback: (node: BinaryTreeNode<T>) => void): void => {
  if (node) {
    traverseInOrder(node.left, callback);
    callback(node);
    traverseInOrder(node.right, callback);
  }
};
```

#### Example usage

```js
const rootNode = createNode<number>(10);
const leftNode = createNode<number>(5);
const rightNode = createNode<number>(15);

setLeft(rootNode, leftNode);
setRight(rootNode, rightNode);

traverseInOrder(rootNode, (node) => console.log(node.value));
```

#### Explanation

The createNode function creates a new node.

The setLeft and setRight Functions to set the left and right children of a node.  There is also a setValue function to set the value of a node.

The traverseInOrder function is a recursive function that traverses the tree in order and applies a callback to each node (that's the ```(node) => console.log(node.value)``` part).

When creating a binary tree node, the decision to create a left or right node typically depends on the specific requirements of the tree structure you're building. In a Binary Search Tree (BST), which is a common type of binary tree, the decision is based on the value of the new node compared to the value of the existing node. Here's how it generally works:

##### For a Binary Search Tree

If the new value is less than the current node's value, it goes to the left.
If the new value is greater than the current node's value, it goes to the right.
If the value is equal, it can go either left or right, depending on how you want to handle duplicates (or you might choose not to add duplicates at all).

##### For a balanced tree (like AVL or Red-Black tree)

The same principle as BST applies, but additional balancing operations are performed after insertion to maintain the tree's balance.

##### For a general binary tree

The decision might be based on the specific problem or data you're representing. For example, in a [Huffman coding tree](https://en.wikipedia.org/wiki/Huffman_coding), the decision might be based on frequency or probability.

Here's an example of how you might implement this decision in TypeScript:

```ts
function insertNode<T>(root: BinaryTreeNode<T> | null, value: T): BinaryTreeNode<T> {
  if (root === null) {
    return createNode(value);
  }

  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }

  // If value is equal, you can choose to insert it to the left, right, or not at all
  // Here we're choosing not to insert duplicates
  
  return root;
}

// Usage
let root = createNode(10);
root = insertNode(root, 5);  // This will become the left child
root = insertNode(root, 15); // This will become the right child
root = insertNode(root, 3);  // This will become the left child of 5
root = insertNode(root, 7);  // This will become the right child of 5
```

In this example, the insertNode function recursively traverses the tree, comparing the new value with each node's value to decide whether to go left or right.

When it finds an empty spot (null node), it creates a new node there.

### Use Cases of Binary Search Trees

Here are some examples of how binary search trees are used in the real world.

- Implementing efficient search and retrieval for autocomplete suggestions.
- Maintaining a dynamically sorted list of elements, such as a list of users or products.
- Performing range queries to find elements within a specific range, such as filtering products by price.
- Representing hierarchical data structures like file systems or organizational charts.
- Implementing efficient search functionalities, such as finding a specific user in a large dataset.

### Interview Questions for BSTs

Here are some example interview questions asking about BSTs.

- Explain how a BST can be used to improve search efficiency in a large dataset.
- Can you explain the basic operations of a BST (insertion, deletion, search) and their time complexities?
- What are some techniques to keep a BST balanced, and why is it important?
- Describe the different traversal methods for a BST and their use cases.

### Real-World Application

This is a sample question and answer involving a BST.

Question: How would you use a BST to implement a feature in a real-world application, such as a leader board?

Answer: A BST can be used to maintain a sorted list of scores in a leader board, allowing for efficient insertion of new scores and retrieval of top scores.

### Other Tree type examples

#### AVL trees

While not as commonly used directly in frontend development as some other data structures, AVL trees can still have practical applications in certain scenarios. Here are some examples of how an AVL tree might be relevant to a front-end developer:

- Autocomplete suggestions: efficiently store and retrieve words or phrases, maintaining them in sorted order for quick prefix-based searches.
- Maintaining a dynamically sorted list of elements, such as a leaderboard or a list of users/products that need to be kept in order.
- Range queries: When you need to efficiently find elements within a specific range, such as filtering products by price or date range.

#### Red-Black Trees

- Implementing an efficient state management system, especially for large applications with complex state structures.
- Efficient event scheduling in complex UIs: For apps that need to manage many scheduled events or animations, a Red-Black Tree can provide efficient insertion, deletion, and lookup of scheduled items.
- Implementing an efficient undo/redo system, especially for applications with complex state changes.

#### Segment Tree

- Interactive Data Visualization: efficiently handle range queries on large datasets for data visualization tools. This allows for quick updates and responsive user interactions when zooming, panning, or selecting specific data ranges on charts or graphs.
- Performance Monitoring Dashboard: store and query performance metrics over time. This enables efficient retrieval of min, max, or average values for metrics like response times, error rates, or resource usage within user-selected time ranges.
- Dynamic Content Loading: efficiently handle content pagination and "infinite scrolling" features. This allows for quick calculations of total content length, finding the shortest/longest items, or summing up attributes (like read times) for dynamically loaded content sections.

#### Fenwick Tree

- Real-time Leaderboard
- Efficient Range Sum Queries in Data Grids.
- Interactive Histogram with Cumulative Frequency that allows users to select ranges and instantly see cumulative frequencies with efficient prefix sum calculations.

### Leaderboards and trees

You might notice that a leaderboard is listed in both AVL and Fenwick Tree examples.  They can also be a good use case for a BST.  In fact, they could apply to all tree types.So what's the difference in these implementations?

A BST can be a good choice for a leaderboard when you want a simpler implementation than an AVL tree and can tolerate occasional performance degradation. It's a middle ground between the consistent but complex AVL tree and the specialized Fenwick tree.

For smaller to medium-sized leaderboards or those with frequent updates and varied query types, a BST could be an excellent choice.

Why not use a Red-Black Tree?

For a leaderboard, a Red-Black tree doesn't offer significant advantages over an AVL tree. Both provide similar performance guarantees, so the choice often comes down to implementation preference.

Why not use a Segment trees?  They excel at range queries, which could be useful for certain types of leaderboards, especially those requiring frequent updates to ranges of scores.  But why not use it?  For a typical leaderboard that primarily needs individual updates and rank queries, a segment tree might be overkill. It's more complex to implement and maintain than necessary for basic leaderboard operations.

## Algorithms (how to solve a class of problems)

An algorithm is an unambiguous specification of how to solve a class of problems with a set of rules or steps that define a sequence of operations.

The list is marked for beginner and advanced and grouped by topics or by by paradigms.

### Topic groupings

- Math
- Sets
- Strings
- Searches
- Sorting
- Linked Lists
- Trees
- Graphs
- Cryptography
- Machine Learning
- Image Processing
- Statistics
- Evolutionary algorithms
- Un-categorized

### Paradigm groupings

- Brute Force - look at all the possibilities and selects the best solution
- Greedy - choose the best option at the current time, without any consideration for the future
- Divide and Conquer - divide the problem into smaller parts and then solve those parts
- Dynamic Programming - build up a solution using previously found sub-solutions
- Backtracking - similarly to brute force, try to generate all possible solutions, but each time you generate next solution you test if it satisfies all conditions, and only then continue generating subsequent solutions. Otherwise, backtrack, and go on a different path of finding a solution. Normally the DFS traversal of state-space is being used.
- Branch & Bound - remember the lowest-cost solution found at each stage of the backtracking search, and use the cost of the lowest-cost solution found so far as a lower bound on the cost of a least-cost solution to the problem, in order to discard partial solutions with costs larger than the lowest-cost solution found so far. Normally BFS traversal in combination with DFS traversal of state-space tree is being used.

## Algorithm Example: Quicksort

To get an idea of how algorithms are described, here is an example of a popular sorting algorithm, Quicksort.

### Quicksort

[Quicksort](https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/sorting/quick-sort) is a divide and conquer algorithm. Quicksort first divides a large array into two smaller sub-arrays: the low elements and the high elements. Quicksort can then recursively sort the sub-arrays

The steps are:

1. Pick an element, called a pivot, from the array.

2. Partitioning: reorder the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it (equal values can go either way). After this partitioning, the pivot is in its final position. This is called the partition operation.

3. Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.

### Quicksort complexity

Complexity is measured in a system called [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation) which tracks how the running time or space requirements grow as the input size grows.

```txt
Best/Average: n log(n)
Worst: n2 (n squared)
Memory: n log(n)
Stable: no
Comments: usually done in-place with O(log(n)) stack space
```

The `Stable: no` means that when Quicksort encounters elements of equal value, their relative order in the final sorted array may be different from their original order in the unsorted array.

### The example code

Here is what the steps above look like in the class-based code example.  I have removed the comments for brevity and tightened up the layout so please visit the Quicksort link above for the full code.

Most of the examples use the Comparator class which looks like this:

```js
export default class Comparator {
  constructor(compareFunction) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  static defaultCompareFunction(a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

  equal(a, b) { return this.compare(a, b) === 0 }
  lessThan(a, b) { return this.compare(a, b) < 0 }  
  greaterThan(a, b) { return this.compare(a, b) > 0 }
  lessThanOrEqual(a, b) { return this.lessThan(a, b) || this.equal(a, b) }
  greaterThanOrEqual(a, b) { return this.greaterThan(a, b) || this.equal(a, b) }
  reverse() { const compareOriginal = this.compare; this.compare = (a, b) => compareOriginal(b, a) }
}
```

Then there is a Sort class which will be extended by the QuickSort class after this.

```js
import Comparator from '../../utils/comparator/Comparator';

export default class Sort {
  constructor(originalCallbacks) {
    this.callbacks = Sort.initSortingCallbacks(originalCallbacks);
    this.comparator = new Comparator(this.callbacks.compareCallback);
  }

  static initSortingCallbacks(originalCallbacks) {
    const callbacks = originalCallbacks || {};
    const stubCallback = () => {};
    callbacks.compareCallback = callbacks.compareCallback || undefined;
    callbacks.visitingCallback = callbacks.visitingCallback || stubCallback;
    return callbacks;
  }

  sort() {
    throw new Error('sort method must be implemented');
  }
}
```

Then this is what the QuickSort class looks like.

```js
import Sort from '../Sort';

export default class QuickSort extends Sort {
  sort(originalArray) {
    const array = [...originalArray];

    if (array.length <= 1) {
      return array;
    }

    const leftArray = [];
    const rightArray = [];

    const pivotElement = array.shift();
    const centerArray = [pivotElement];

    while (array.length) {
      const currentElement = array.shift();
      this.callbacks.visitingCallback(currentElement);
      if (this.comparator.equal(currentElement, pivotElement)) {
        centerArray.push(currentElement);
      } else if (this.comparator.lessThan(currentElement, pivotElement)) {
        leftArray.push(currentElement);
      } else {
        rightArray.push(currentElement);
      }
    }

    const leftArraySorted = this.sort(leftArray);
    const rightArraySorted = this.sort(rightArray);

    return leftArraySorted.concat(centerArray, rightArraySorted);
  }
}
```

### A functional TypeScript approach

Lets create a TypeScript functional version of the above sample code.

If you want to see the code below implemented in a React with Typescript project, checkout my [example code project](https://github.com/timofeysie/acknowledge/tree/master/examples/javascript/react-ts-redux/src/features/quicksort).

Here is a TypeScript Comparator utility: comparator.ts

```ts
export type CompareFunction<T> = (a: T, b: T) => number;

export const createComparator = <T>(compareFunction?: CompareFunction<T>) => {
  const defaultCompareFunction: CompareFunction<T> = (a, b) => {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  };

  const compare = compareFunction || defaultCompareFunction;

  return {
    compare,
    equal: (a: T, b: T) => compare(a, b) === 0,
    lessThan: (a: T, b: T) => compare(a, b) < 0,
    greaterThan: (a: T, b: T) => compare(a, b) > 0,
    lessThanOrEqual: (a: T, b: T) => compare(a, b) <= 0,
    greaterThanOrEqual: (a: T, b: T) => compare(a, b) >= 0,
    reverse: () => createComparator<T>((a, b) => compare(b, a))
  };
};
```

And then the Sort utility: sortUtils.ts

```ts
import { CompareFunction, createComparator } from "./comparator";

type SortCallbacks<T> = {
  compareCallback?: CompareFunction<T>;
  visitingCallback?: (element: T) => void;
};

// Initialize sorting callbacks with default values if not provided
const initSortingCallbacks = <T>(originalCallbacks?: SortCallbacks<T>): Required<SortCallbacks<T>> => {
  const callbacks = originalCallbacks || {};
  const stubCallback = () => {};
  return {
    compareCallback: callbacks.compareCallback || ((a: T, b: T) => 0),
    visitingCallback: callbacks.visitingCallback || stubCallback
  };
};

const createSort = <T>(originalCallbacks?: SortCallbacks<T>) => {
  const callbacks = initSortingCallbacks(originalCallbacks);
  const comparator = createComparator(callbacks.compareCallback);

  return {
    callbacks,
    comparator,
    // Placeholder sort method to be implemented by specific sorting algorithms
    sort: () => {
      throw new Error('sort method must be implemented');
    }
  };
};

export type { SortCallbacks };
export { initSortingCallbacks, createSort };
```

And finally, a quicksort function: quicksort.ts

```js
import { SortCallbacks, createSort } from "./sort";

export const quickSort = <T>(originalArray: T[], originalCallbacks?: SortCallbacks<T>): T[] => {
    const { comparator, callbacks } = createSort(originalCallbacks);
    const visitedElements = new Set<T>();

    const sort = (array: T[]): T[] => {
      if (array.length <= 1) {
        // Call visitingCallback for single-element arrays
        if (array.length === 1 && !visitedElements.has(array[0])) {
          callbacks.visitingCallback(array[0]);
          visitedElements.add(array[0]);
        }
        return array;
      }
  
      // Step 1: Pick an element, called a pivot, from the array.
      const [pivot, ...rest] = array;
  
      // Call visitingCallback for the pivot
      if (!visitedElements.has(pivot)) {
        callbacks.visitingCallback(pivot);
        visitedElements.add(pivot);
      }
  
      // Step 2: Partitioning
      const leftArray: T[] = [];
      const rightArray: T[] = [];
      const centerArray: T[] = [pivot];
  
      // Reorder the array so that all elements with values less than the pivot
      // come before the pivot, while all elements with values greater than
      // the pivot come after it. Equal values can go either way.
      for (const element of rest) {
        if (!visitedElements.has(element)) {
          callbacks.visitingCallback(element);
          visitedElements.add(element);
        }
        if (comparator.equal(element, pivot)) {
          centerArray.push(element);
        } else if (comparator.lessThan(element, pivot)) {
          leftArray.push(element);
        } else {
          rightArray.push(element);
        }
      }
  
      // Step 3: Recursively apply the above steps to the sub-arrays
      const leftArraySorted = sort(leftArray);   // Sub-array with smaller values
      const rightArraySorted = sort(rightArray); // Sub-array with greater values
  
      // Combine the sorted sub-arrays and the pivot
      return [...leftArraySorted, ...centerArray, ...rightArraySorted];
    };
  
    // Start the sorting process with a copy of the original array
    return sort([...originalArray]);
  };
```

### Example usage of the quickSort function

This will console log out the results.

```js
const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const sortedNumbers = quickSort(numbers, {
  compareCallback: (a, b) => a - b,
  visitingCallback: (element) => console.log(`Visiting: ${element}`)
});
console.log(sortedNumbers);

// Example with custom comparator (sorting strings by length)
const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
const sortedWords = quickSort(words, {
  compareCallback: (a, b) => a.length - b.length
});
console.log(sortedWords);
```

### Unit tests

What feature is complete without unit tests?  Instead of using the console log, here is a set of tests for the quick sor code above.

```ts
describe('quickSort', () => {
  it('should sort numbers in ascending order', () => {
    const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    const sortedNumbers = quickSort(numbers, {
      compareCallback: (a, b) => a - b,
    });
    expect(sortedNumbers).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
  });

  it('should call visitingCallback for each element', () => {
    const numbers = [3, 1, 4];
    const visitingCallback = jest.fn();
    quickSort(numbers, {
      compareCallback: (a, b) => a - b,
      visitingCallback,
    });
    expect(visitingCallback).toHaveBeenCalledTimes(numbers.length);
    numbers.forEach(num => {
      expect(visitingCallback).toHaveBeenCalledWith(num);
    });
  });

  it('should sort an already sorted array', () => {
    const sortedArray = [1, 2, 3, 4, 5];
    const result = quickSort(sortedArray, {
      compareCallback: (a, b) => a - b,
    });
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a reverse-sorted array', () => {
    const reverseSortedArray = [5, 4, 3, 2, 1];
    const result = quickSort(reverseSortedArray, {
      compareCallback: (a, b) => a - b,
    });
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
```

### The Binary Search Algorithms (aka half-interval search, logarithmic search, or binary chop)

A [binary search](https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/search/binary-search) is described as: *It finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array; if they are unequal, the half in which the target cannot lie is eliminated and the search continues on the remaining half until it is successful. If the search ends with the remaining half being empty, the target is not in the array.*

The example code looks like this:

```js
import Comparator from '../../../utils/comparator/Comparator';

/**
 * Binary search implementation.
 *
 * @param {*[]} sortedArray
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @return {number}
 */

export default function binarySearch(sortedArray, seekElement, comparatorCallback) {
  // Let's create comparator from the comparatorCallback function.
  // Comparator object will give us common comparison methods like equal() and lessThan().
  const comparator = new Comparator(comparatorCallback);

  // These two indices will contain current array (sub-array) boundaries.
  let startIndex = 0;
  let endIndex = sortedArray.length - 1;

  // Let's continue to split array until boundaries are collapsed
  // and there is nothing to split anymore.
  while (startIndex <= endIndex) {
    // Let's calculate the index of the middle element.
    const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);

    // If we've found the element just return its position.
    if (comparator.equal(sortedArray[middleIndex], seekElement)) {
      return middleIndex;
    }

    // Decide which half to choose for seeking next: left or right one.
    if (comparator.lessThan(sortedArray[middleIndex], seekElement)) {
      // Go to the right half of the array.
      startIndex = middleIndex + 1;
    } else {
      // Go to the left half of the array.
      endIndex = middleIndex - 1;
    }
  }

  // Return -1 if we have not found anything.
  return -1;
}
```

## The Leader board example

(*This is a work in progress, check back later to see how it goes.*)

When adding scores binary Search algorithm is used to find the correct position for a new score in the BST. It ensures that the tree remains sorted.

Reverse Traversal: To get the top scores, we can perform a reverse in-order traversal (right, root, left)

To show a user their score position in the leader board along with the four scores above and the five scores below, we can use the Binary Search algorithm from your list. Here’s how it can be applied:

### Binary Search

Purpose: Efficiently find the position of the user’s score in the sorted list of scores.

### Description

Perform a binary search to locate the user’s score in the BST. Once the score is found, you can then retrieve the surrounding scores by traversing the tree.

Steps:

1. Binary Search: Use binary search to find the exact position of the user’s score in the sorted list.
2. In-order Traversal: Perform an in-order traversal to get the scores in sorted order.
3. Retrieve Surrounding Scores: Once the position is found, retrieve the four scores above and the five scores below the user’s score.

### Example Process

1. Find User’s Score: Use binary search to find the user’s score in the BST.
2. In-order Traversal: Traverse the BST in in-order to get all scores in ascending order.
3. Extract Surrounding Scores: From the list of scores obtained from the in-order traversal, extract the four scores above
and the five scores below the user’s score.

### Complexity

- Binary Search: O(log n) on average, O(n) in the worst case (unbalanced tree).
In-order Traversal: O(n) to get the sorted list of scores.
Extracting Surrounding Scores: O(1) once the position is found.

## Frequently asked about data structures and algorithm in frontend interviews

The Hacker Rank links in the Trekhleb are a great resource for both developers and those hiring them.  However, since there are over a hundred topics to cover, it might be more realistic to start with the most used.

With that in mind, here's the ordered list of the top ten algorithms by the most likely to appear in frontend job interviews, based on frequency:

1. Depth-First Search (DFS)
2. Breadth-First Search (BFS)
3. Binary Search
4. Quicksort
5. Merge Sort
6. Insertion Sort
7. Selection Sort
8. Bubble Sort
9. Fibonacci Number
10. Euclidean Algorithm

I tend to like the articles at the bottom, such as the Rain Terraces problem, so definitely worth having a look around and explore some of the use-cases of data structures and algorithms in depth.

It's good to know what each of these are good for by memory, such as Merge sort for Linked list, Quick sort for arrays.  I'll go over why a little later.

Here is a list of the top ten data structures:

1. Hash Table
2. Stack
3. Queue
4. Linked List
5. Doubly Linked List
6. Binary Search Tree
7. Heap
8. Priority Queue
9. Trie
10. Tree

## The Top Ten

Here's the ordered list of the top ten algorithms by the most likely to appear in frontend job interviews, based on frequency:

| Data Structure/Algorithm | Adding/Deleting an Element | Indexing | Getting an Element in a Known Position | Notes |
|--------------------------|----------------------------|----------|----------------------------------------|-------|
| Hash Table               | O(1)                       | -        | O(1)                                   | Efficient for adding, deleting, and retrieving elements. Worst-case O(n) due to collisions. |
| Stack                    | O(1)                       | -        | O(1)                                   | Operations are O(1) since elements are added/removed from the top. |
| Queue                    | O(1)                       | -        | O(1)                                   | Operations are O(1) since elements are added at the end and removed from the front. |
| Linked List              | O(1)                       | O(n)     | O(n)                                   | Adding/deleting is O(1) if you have a reference to the node. Indexing and getting an element are O(n). |
| Doubly Linked List       | O(1)                       | O(n)     | O(n)                                   | Similar to linked list but with references to both previous and next nodes. |
| Binary Search Tree       | O(log n)                   | O(n)     | O(log n)                               | Efficient for balanced trees (O(log n)), but can degrade to O(n) if unbalanced. |
| Heap                     | O(log n)                   | O(n)     | O(log n)                               | Efficient for priority queue operations, maintaining a balanced structure. |
| Priority Queue           | O(log n)                   | O(n)     | O(log n)                               | Typically implemented with a heap, hence similar complexities. |
| Trie                     | O(m)                       | O(m)     | O(m)                                   | Efficient for prefix-based searches, with complexities dependent on the length of the key. |
| Tree                     | O(log n)                   | O(n)     | O(log n)                               | General tree operations depend on the specific type of tree and its balance. |

Most of these are data structures, strictly speaking.  The specific algorithms in the list are:

Binary Search Tree: Often used with algorithms for searching and sorting.
Heap: Used in heap sort and priority queue operations.
Trie: Used in algorithms for prefix-based searches.

## An example LeetCode problem

Remember the article I mentioned at the start of this: [1 Year of Consistent LeetCoding](https://dev.to/davinderpalrehal/1-year-of-consistent-leetcoding-26d0)?

An example of what he is talking about is this classic [Two Sum problem](https://leetcode.com/problems/two-sum/description/).

The question goes like this:  *Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.*

Have a think about how you would solve this problem.  Then read on.

There is a follow-up condition: *Can you come up with an algorithm that is less than O(n2) time complexity?*

The LeetCode format is pretty good I think.  It has hints, a video discussion, a forum, lots and lots of solutions in many different programming languages, a solution article and more.

> Spoiler alert!  I go over the answer here, so if you want to try the problem yourself first, stop reading now.

There are plenty of questions to answer, but it's good to get an overview of what a full fledged three step solution looks like.  So let's dive in.

### Hint 1

The hints seem to mirror my thought process.

*A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.*

This was my first thought also.  Loop through each element x and find if there is another value that equals to target−x.

The TypeScript solution looks like this:

```js
function twoSum(nums: number[], target: number): number[] {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[j] === target - nums[i]) {
                return [i, j];
            }
        }
    }
    // Return an empty array if no solution is found
    return [];
}
```

This is exactly how I would have done it, as it's usually a timed test, and it seems obvious and can be written out quickly.

The problem here is that it doesn't meet the follow-up condition.

#### Complexity Analysis

Time complexity: O(n squared).  Here, n is the number of elements in the nums array.  We were asked to make it less that this.

For each element, we try to find its complement by looping through the rest of the array which takes O(n) time. Therefore, the time complexity is O(n squared).

Space complexity: O(1). This is because the space required does not depend on the size of the input array, so only constant space is used.

We can see here that time complexity is a lot more than the space complexity.

So can you think how this could be improved?  I bet it involves an algorithm!

### Hint 2

This says: *So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?*

The article section says this: *A hash table is well suited for this purpose because it supports fast lookup in near constant time.*

Remember that in JavaScript, a Map is a hash table implementation.  That's our data structure for this problem.

A simple implementation uses two iterations. In the first iteration, we add each element's value as a key and its index as a value to the hash table.

Then, in the second iteration, we check if each element's complement (target−nums[i]) exists in the hash table. If it does exist, we return current element's index and its complement's index.

```js
function twoSum(nums: number[], target: number): number[] {
    const map: Map<number, number> = new Map();
    for (let i = 0; i < nums.length; i++) {
        map.set(nums[i], i);
    }
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement) && map.get(complement) !== i) {
            return [i, map.get(complement)];
        }
    }
    // If no valid pair is found, return an empty array
    return [];
}
```

### Hint 3

This says: *The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?*

The editorial section lays it out for us: *It turns out we can do it in one-pass. While we are iterating and inserting elements into the hash table, we also look back to check if current element's complement already exists in the hash table. If it exists, we have found a solution and return the indices immediately.*

That's our algorithm.  Let's look at the TypeScript example given.

```js
function twoSum(nums: number[], target: number): number[] {
    const map: Map<number, number> = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            // this is the solution, so return the two indices
            return [map.get(complement), i];
        }
        // remember the current value and its index
        map.set(nums[i], i);
    }
    return [];
}
```

There we are, a single loop.  Sweet.

I dream of being able to write something like this the first time through.  I suppose that is my goal here - you have to pretty much know these by heart to then choose the correct solution right away.  What better way than to write an article about it?

If current + x = target, then we know we have a solution, and since there is guaranteed to be only one solution, we can return immediately.  We use algebra to turn this into target - current, or ```complement = target - nums[i]```.

When the map has that complement (because we have saved all the values in the hash table), we return the two indices.  The ```map.has(complement)``` looks at the indexes of the hash table.

The [has() method of Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) returns a boolean indicating whether an element with the specified key exists in this map or not.

There is actually a [link in the comments](https://leetcode.com/problems/two-sum/solutions/1527009/o-n-javascript-typescript-with-detailed-explanatory-comments/) to a very well commented TypeScript solution with a lot of replies on it also.

#### Final complexity analysis

Time complexity: O(n).
We traverse the list containing n elements only once. Each lookup in the table costs only O(1) time.

Space complexity: O(n).
The extra space required depends on the number of items stored in the hash table, which stores at most n elements.

Time is usually more important than space, because space means memory, and that can always be increased (I mean, to a point).

We can't however buy more time, which is why time complexity is more critical.

### Single-Pass Hash Table

This algorithm is also known as the Two-Sum Hash Table algorithm.

It's a specific implementation of a more general problem-solving pattern called the "Complement/Pair Finding" pattern.

I know, this one is not on the Trekhleb list.  I guess despite it thoroughness, it's not a complete list.  This would indicate that at this point we have to get our feet wet and dive into the real world of algorithms in action.

As I've been told, this is a classic example of the space-time tradeoff in algorithms, where extra space (the hash table) is used to achieve better time complexity (a single loop with constant time lookups).

It's a common pattern in coding interviews and is often used as a building block for more complex problems like Three Sum, Four Sum, etc.

It's a good idea to also dive into the comments at the end of the editorial section.  There are extensive ideas there:

Someone asks: *How does the HashMap solution work if the elements are not unique in the array and the target is a addition of two duplicate integers?*  They also show their own solution.

## Summary

Data structures and algorithms are the beating heart of coding.  Its good to know them well and how to use them, especially when interviewing or crafting interview questions.

Use the hashtag #AlgorithmsAndDataStructuresUsingTypeScriptInReact and the link below on [Twitter](https://twitter.com/) for any comments or feedback.
