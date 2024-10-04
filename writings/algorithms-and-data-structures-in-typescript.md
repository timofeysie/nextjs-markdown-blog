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

There, it has a basic introduction and code examples and defines the terms and has a large number of class-based examples.  Lets dive in to this codebase and then apply the concepts there to React using Typescript.

First, lets describe the terms.

### Data structures

*A data structure is a particular way of organizing and storing data in a computer so that it can be accessed and modified efficiently.*

### Algorithms

*Algorithms an unambiguous specification of how to solve a class of problems. It is a set of rules that precisely define a sequence of operations.*

>[Fun fact] The etymology of the term came from the name of a Persian scientist and polymath Muḥammad ibn Mūsā al-Khwārizmī who wrote *kitāb al-ḥisāb al-hindī* ("Book of Indian computation") around 825 AD.  He is also credited for the term algebra comes from *Al-Jabr* in the same book (meaning "completion" or "rejoining").  Readers might know that our number system is also based on the Hindu–Arabic numeral system (or decimal system) which replaced the cumbersome Roman numerals in the early 16thj century.

### Why know them?

Coders have to solve problems, many of which fit archetypes that have been solved many times before.  Why not stand on the shoulders of the giants and pick and choose a solution that has known tradeoffs rather than re-inventing the wheel and discovering the tradeoffs down the road when its too late to change anything.

They could be seen as a short cut to struggling through a problem to find a solution.  It's not to say that there are not new or unique problems that require new and unique approaches, but having a knowledge of how to approach a challenge and see a pattern that fits a data type or algorithm can save a lot of time.  When you code as a job, time is money and many startups fail as they arrive at the proper solution too late.  The right answer that takes too long is actually the wrong answer in a lot of cases.

As a collection of data values with relationships and functions to work with them, each type has important trade-offs. During a coding technical test we need to pay attention more to why a certain data structure is appropriate for the challenge.

### The Trekhleb

The aforementioned Algorithms and Data Structures in JavaScript I call The Trekhleb is a very exhaustive list of data structures and algorithms with pseudo code, vanilla JavaScript examples with unit tests and even links to Wikipedia pages and videos from the [hacker rank channel](https://www.youtube.com/@HackerrankOfficial).  There are many contributors, 1,115 commits so far, the last only two months ago.  These seem to mainly be translations of the content into the 18 languages available.  So they are really trying to spread the word there.

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

## Hash table

A [Hash table (hash map)](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/hash-table) is a data structure which implements an associative array abstract data type.

It contains a structure that can map keys to values.

uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found
For fast lookups O(1) constant time (usually, could also be O(n) linear time)

Ideally, the hash function will assign each key to a unique bucket, but most hash table designs employ an imperfect hash function, which might cause hash collisions where the hash function generates the same index for more than one key. Such collisions must be accommodated in some way.

Todo:
    - Collision handling
    - How they grow/shrink
    - Implement simple solution
    - Practice questions

Map stores key-value pairs, where keys can be of any data type, including objects and functions.

Order of Insertion maintained
Efficient Operations: Map provides average constant time complexity, O(1), for operations like set, get, and delete.

Why Use Map Over Object?

No Key Collisions: Unlike objects, Map keys are not limited to strings and symbols, reducing the risk of key collisions.
Size Property: Map has a size property that directly returns the number of key-value pairs.
Better Performance: Map is generally more performant for frequent additions and deletions of key-value pairs123.

Implementing an LRU (Least Recently Used) Cache
An LRU Cache is a data structure that stores a limited number of items and removes the least recently used item when the cache reaches its capacity. This is a great way to showcase your skills with hash tables and linked lists.

## Linked list

This is a linear collection of data elements, in which linear order is not given by their physical placement in memory. Instead, each element points to the next. It is a data structure consisting of a group of nodes which together represent a sequence. 

each node is composed of data and a reference (link) to the next node in the sequence.

efficient insertion or removal of elements from any position in the sequence during iteration.

More complex variants add additional links, allowing efficient insertion or removal from arbitrary element references.
A drawback of linked lists is that access time is linear (and difficult to pipeline). 
Faster access, such as random access, is not feasible. 
Arrays have better cache locality as compared to linked lists.

Under what circumstances are linked lists useful?
https://stackoverflow.com/questions/2429217/under-what-circumstances-are-linked-lists-useful
Asked 14 years, 6 months ago
Modified 2 months ago
Viewed 32k times
I counted 18 answers there.

when do you need to do a lot of insertions and removals at the middle of a sequence, but not very many lookups in the list by ordinal?

Discussions about LLs often revolve around memory use and languages other than JavaScript.  It comes down to a discussion of Big O notation.

Adding an element: O(1)
Indexing: O(n)
Getting an element in a known position: O(n)

One example answer: One of the most useful cases I find for linked lists working in performance-critical fields like mesh and image processing, physics engines, and raytracing is when using linked lists actually improves locality of reference and reduces heap allocations and sometimes even reduces memory use compared to the straightforward alternatives.

Even the least rated answers provide insight into actual usage.

Rope Strings are a good example to start with. It's a popular data structure in text editors where users want to insert and delete all over the place.

The Python data type called deque found in collections.deque uses a doubly linked list.

 a vector or deque would typically be slow to add at either end, requiring (at least in my example of two distinct appends) that a copy be taken of the entire list (vector), or the index block and the data block being appended to (deque).

The Carousel Example
Do we really need to insert/delete items a lot in it?
The main point with the carousel is that it has to loop, so there might be a simpler algorithm that can be used.

Linked Lists
B Straight Traversal
B Reverse Traversal

## Map & Set

In JavaScript, both Map and Set are closely related to the concept of a hashtable, but they serve different purposes:

Map: This is a collection of key-value pairs where the keys can be of any type. It is implemented using a hashtable under the hood, which allows for efficient retrieval, addition, and deletion of key-value pairs. You can think of Map as a more versatile and powerful version of the plain JavaScript object ({}), with better performance for frequent additions and deletions.

```js
const map = new Map();
map.set('key1', 'value1');
console.log(map.get('key1')); // Outputs: 'value1'
```

Set: This is a collection of unique values, meaning it does not allow duplicate entries. It is also implemented using a hashtable, which ensures that each value is stored only once and allows for efficient checks for the presence of a value2.

```js
const set = new Set();
set.add('value1');
console.log(set.has('value1')); // Outputs: true
```

So, while both Map and Set use hashtables internally, Map is used for key-value pairs, and Set is used for unique values.

Since a Set is a collection of unique values. You can convert an array to a Set and then back to an array to remove duplicates:

```js
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = [...new Set(array)];
```

## Trees

Trees are abstract data type/structure that **simulates a hierarchical tree structure, with a root value and subtrees of children with a parent node, represented as a set of linked nodes.*

There are four trees listed:

- Binary Search Trees (ordered or sorted)
- AVL Tree (named after inventors Adelson-Velsky and Landis)
- Red-Black Tree (self-balancing)
- Segment Tree (statistic tree used for storing information about intervals/segments)
- Fenwick Tree / Binary Indexed Tree (efficiently update elements and calculate prefix sums in a table of numbers)

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

Let’s define a TypeScript interface for the node:

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

#### Example usage:

```js
const rootNode = createNode<number>(10);
const leftNode = createNode<number>(5);
const rightNode = createNode<number>(15);

setLeft(rootNode, leftNode);
setRight(rootNode, rightNode);

traverseInOrder(rootNode, (node) => console.log(node.value));
```

#### Explanation

createNode: Function to create a new node.
setLeft and setRight: Functions to set the left and right children of a node.
setValue: Function to set the value of a node.
traverseInOrder: Function to traverse the tree in order and apply a callback to each node.
This functional approach provides a more modular and flexible way to work with binary trees in TypeScript.

### Use Cases of Binary Search Trees

- Implementing efficient search and retrieval for autocomplete suggestions.
- Maintaining a dynamically sorted list of elements, such as a list of users or products.
- Performing range queries to find elements within a specific range, such as filtering products by price.
- Representing hierarchical data structures like file systems or organizational charts.
- Implementing efficient search functionalities, such as finding a specific user in a large dataset.

### Interview Questions

- Explain how a BST can be used to improve search efficiency in a large dataset.
- Can you explain the basic operations of a BST (insertion, deletion, search) and their time complexities?
- What are some techniques to keep a BST balanced, and why is it important?
- Describe the different traversal methods for a BST and their use cases.

### Real-World Application

Question: How would you use a BST to implement a feature in a real-world application, such as a leader board?

Answer: A BST can be used to maintain a sorted list of scores in a leader board, allowing for efficient insertion of new scores and retrieval of top scores.

## Fundamental and frequently asked about in frontend interviews

The Hacker Rank links in the Trekhleb are a great resource for both developers and those hiring them.  However, since there are over a hundred topics to cover, it might be more realistic to start with the most used.

With that in mind, here's the ordered list of algorithms by the most likely to appear in frontend job interviews, based on frequency:

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
11. LRU Cache
12. Graph
13. Depth-First Search (DFS)
14. Breadth-First Search (BFS)
15. Binary Search
16. Quicksort
17. Merge Sort
18. Insertion Sort
19. Selection Sort
20. Bubble Sort
21. Fibonacci Number
22. Euclidean Algorithm
23. Sieve of Eratosthenes
24. Knuth–Morris–Pratt Algorithm (KMP Algorithm)
25. Rabin Karp Algorithm
26. Longest Common Substring
27. Regular Expression Matching
28. Dijkstra Algorithm
29. Prim’s Algorithm
30. Topological Sorting
31. Kruskal’s Algorithm
32. Bellman-Ford Algorithm
33. Floyd-Warshall Algorithm
34. Detect Cycle
35. Segment Tree
36. Fenwick Tree
37. Disjoint Set
38. Bloom Filter
39. Bit Manipulation
40. Factorial
41. Prime Factors
42. Primality Test
43. Least Common Multiple (LCM)
44. Is Power of Two
45. Pascal's Triangle
46. Complex Number
47. Radian & Degree
48. Fast Powering
49. Horner's method
50. Matrices
51. Euclidean Distance
52. Integer Partition
53. Square Root
54. Liu Hui π Algorithm
55. Discrete Fourier Transform
56. Cartesian Product
57. Fisher–Yates Shuffle
58. Power Set
59. Permutations
60. Combinations
61. Longest Common Subsequence (LCS)
62. Longest Increasing Subsequence
63. Shortest Common Supersequence (SCS)
64. Knapsack Problem
65. Maximum Subarray
66. Combination Sum
67. Hamming Distance
68. Palindrome
69. Levenshtein Distance
70. Z Algorithm
71. Linear Search
72. Jump Search
73. Interpolation Search
74. Heap Sort
75. Shellsort
76. Counting Sort
77. Radix Sort
78. Bucket Sort
79. Straight Traversal
80. Reverse Traversal
81. Articulation Points
82. Bridges
83. Eulerian Path and Eulerian Circuit
84. Hamiltonian Cycle
85. Strongly Connected Components
86. Travelling Salesman Problem
87. Polynomial Hash
88. Rail Fence Cipher
89. Caesar Cipher
90. Hill Cipher
91. NanoNeuron
92. k-NN
93. k-Means
94. Seam Carving
95. Weighted Random
96. Genetic algorithm
97. Tower of Hanoi
98. Square Matrix Rotation
99. Jump Game
100. Unique Paths
101. Rain Terraces
102. Recursive Staircase
103. Best Time To Buy Sell Stocks
104. N-Queens Problem
105. Knight's Tour

This list prioritizes algorithms and data structures that are fundamental and frequently asked about in frontend interviews.

I tend to like the articles at the bottom, such as the Rain Terraces problem, so definitely worth having a look around and explore some of the use-cases of data structures and algorithms in depth.

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

## Summary

Data structures and algorithms are the beating heart of coding.  Its good to know them well and how to use them, especially when interviewing or crafting interview questions.

Use the hashtag #AlgorithmsAndDataStructuresUsingTypeScriptInReact and the link below on [Twitter](https://twitter.com/) for any comments or feedback.
