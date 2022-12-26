---
title: "Redux Toolkit Query"
date: "2022-12-25"
og:
  description: "A detailed walk through of the official React Redux example app using TypeScript and unit testing"
  image: "https://timothycurchod.com/og/Capture-react-tdd.png"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

## TL;DR

- RTK Query's React integration will automatically generate React hooks for every endpoint such as the useGetPostsQuery to load the posts from the Redux Essentials example app.

## RTK Query

[Redux Essentials, Part 7: RTK Query Basics](https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics)

RTK Query's React integration will automatically generate React hooks for every endpoint  

getPosts endpoint generated hook useGetPostsQuery.  

Middleware must be added to manage cache lifetimes and expiration.  
