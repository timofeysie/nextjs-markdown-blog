---
title: "MUI Themes"
date: "2022-12-25"
og:
  description: "Implementing a theme using the official React Redux example app in TypeScript"
  image: "images/Capture-react-tdd.PNG"
author:
  twitter: "timofey"
  name: "Timothy Curchod"
---

This article is a work in progress.

In this article I describe using Material UI in React within the Redux Essentials app re-written in TypeScript.  I explore the best practices for creating a theme which will require minimum alteration for specific components throughout the app.

The app in question is a small social media feed app with a number of features that demonstrate some real-world use cases.  The app is originally built bit by bit in the lengthy Redux Essentials tutorials using vanilla JavaScript.  As a fan of TypeScript, I wanted to explore the issues encountered when using TypeScript with the same code.

I show how this is done in my [Redux Essentials Example App with TypeScript](http://localhost:3000/writings/redux-essentials-app-in-typescript) blog post.  That article is actually part two for the project which is started from the beginning in the [React Redux Counter Example with TypeScript](http://localhost:3000/writings/react-redux-typescript-counter-example)

## Analysis of the Posts List card components

Starting off, let's look at how a component is initially styled in the app.

Here is a post 'card' from src\features\posts\PostsList.js

```html
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
```

Posts list styles committed by Mark Erikson in April 2020 with the message "Initial example project setup".  So from the commit message we can guess they may have been written by Mark, as they most likely came from somewhere else and made up just the first commit of a project as opposed to being developed over a number of commits which usually happens when things are developed from scratch.

Here are the styles from src\index.css

```css
.post h2 {
  font-size: 2.5rem;
  margin-bottom: 5px;
}

.post-excerpt {
  padding: 0.25rem 0.25rem;
  border: 1px solid rgb(177, 174, 174);
  border-radius: 7px;
}

.posts-list .post-excerpt + .post-excerpt {
  margin-top: 0.5rem;
}

.posts-container.disabled {
  opacity: 0.5;
}

.post-excerpt h3 {
  margin: 0;
  font-size: 1.5rem;
}

p.post-content {
  margin-top: 10px;
}
```

The theme comes from margins, paddings, borders and fonts.

## Rem units of measure

The rem unit (stands for “root em”) represents the font size of the root element. 1rem usually equals the font size of the html element, which for most browsers has a default value of 16px

The em unit is relative to the font size of its own element, not the root element.

Using rem can help ensure consistency of font size and spacing throughout your UI.

## Using a MUI card

In the 2010s, UI frameworks such as Bootstrap inspired CSS flex-box and grid layouts which didn't come out until late 2018.  So before this time, if you wanted the power of these kinds of responsive layouts, then you had to write your own, or use Bootstrap or some other now legacy framework.  Developers often then had to fight the framework to implement the vision of a graphic designer using an app like Figma.

In my opinion, now that we have a very mature css specification, UI frameworks are not needed for serious projects.  Graphic designers only need to make arrangements of items on a page dictated by the needs of the user as highlighted by a UX designer.  Really, UX should come first, and for the most part, graphic designers should only create a theme and not specific layouts that then serve as fodder for testers to fail issues and create wasteful churn driving up the cost of projects.

Regardless of your opinion of using a UI framework over writing styles from scratch, as a developer you often get on-boarded to projects that you didn't start and have to do your best with the current code base.  To keep things consistent you need to continue to use the framework decided upon before your arrival.

In this case, we have the requirement to use a MUI card.  But the MUI card still requires the theme of margins, paddings, borders and fonts.

The theme should be something that is easy to use regardless of what part of the layout you are working on.  It must also support things like light and dark mode, or special event themes.

What is the best practice for creating a theme in React?

### Theme providers

Debbie O'Brien has a [good article on Theming in React](https://debbie.codes/blog/theming-in-react).  In this article a theme provider is used like this:

```jsx
<Theme.ThemeProvider>
  <Button>Tap me</Button>
</Theme.ThemeProvider>
```

### CSS variables

[Theming with React and Styled Components](https://atmos.style/blog/working-with-colors-in-code) by Vojtěch Vidra

Using variables with meaning and naming conventions along with using a single color notation

*Consider this scenario: You build your app for production, and by default, it is in light mode. The user enters your app and has dark mode selected. Because you have baked your colors into the generated JS classes, all your classes have to regenerate into the dark mode. That results in a brief flicker of light mode before the app regenerates the classes.*

To avoid the flicker we can read the users preferred theme and set the corresponding class name to the html element. Because the CSS variables are still the same, your generated classes don't have to be regenerated.

## MUI Styles

```html
<Card sx={{ maxWidth: 345 }}>
```

The sx property is considered a one-off customization.

## MUI Best Practices

To provided consistency it is considered a best practice to implement MUI components using a single theme.

Develop the theme itself as needed.

There are MUI Theme creators as linked to in the [official docs](https://mui.com/material-ui/customization/theming/).

MUI has it's own ThemeProvider which relies on useContext as most light/dark theme setups are shown to do.

### MUI Theme builder

The [mui-theme-creator](https://bareynol.github.io/mui-theme-creator/) is a tool to help design and customize themes for the MUI component library.  You can edit the properties you want to change and it will provided the needed config file for you.  The bottom right offers snippets to make this happen.

I really like the pre-built Material theme I used in a past Angular project called pink-bluegrey.  It's considered a "dark" palette.

If I want to re-create that using the MUI theme builder, there is a Material palette generator: The [Material palette generator](https://m2.material.io/inline-tools/color/) which can be used to generate a palette.

The [pink-pallette](https://github.com/angular/components/blob/main/src/material/core/theming/_palette.scss) colors look like this:

```css
$pink-palette: (
  50: #fce4ec,
  100: #f8bbd0,
  200: #f48fb1,
  300: #f06292,
  400: #ec407a,
  500: #e91e63,
  600: #d81b60,
  700: #c2185b,
  800: #ad1457,
  900: #880e4f,
  A100: #ff80ab,
  A200: #ff4081,
  A400: #f50057,
  A700: #c51162,
  contrast: (
    50: $dark-primary-text,
    100: $dark-primary-text,
    200: $dark-primary-text,
    300: $dark-primary-text,
    400: $dark-primary-text,
    500: $light-primary-text,
    600: $light-primary-text,
    700: $light-primary-text,
    800: $light-primary-text,
    900: $light-primary-text,
    A100: $dark-primary-text,
    A200: $light-primary-text,
    A400: $light-primary-text,
    A700: $light-primary-text,
  )
);
```

The $dark-primary-text variable is defined as rgba(black, 0.87).  If you want a more detailed explanation of what the above all means, check out [this great post by Dennis](https://levelup.gitconnected.com/defining-your-own-theme-in-angular-material-8a4a6ffad400) on Medium.com.

Colors in a Material theme are specified as:

- primary
- secondary (accent)
- error
- warning
- info
- success
- divider

These are further broken down into:

- main
- light
- dark
- contrast text

Only the main one has to be specified, and the rest are automatically generated from that.

The 700 value is the main color needed for a palette, so for the pink-bluegrey pallette that is #c2185b.

The other change I made for this was using this green for links: #76b900.

A [secondary](https://m2.material.io/design/color/the-color-system.html#color-theme-creation) is optional, and should be applied sparingly to accent select parts of a UI.

primary pink 700: #76b900
secondary bluegrey 700: #607d8b

In Angular we can use the colors in a scss file like this:

```css
@import '~@angular/material/_theming.scss';
@include mat-core();

$accent: mat-palette($mat-blue-grey);

.title {
  color: mat-color($accent);
}
```

When inputting those colors, the [theme creator](https://bareynol.github.io/mui-theme-creator/) shows this code snippet:

```js
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const themeOptions: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#c2185b',
    },
    secondary: {
      main: '#607d8b',
    },
  },
};
```

I you are are not using TypeScript, the typing there along with the import is not needed.

The menu on the left has a list of all the components so you can see what they look like with your custom theme.  If you are only using out of the box components, then you don't need Storybook to see what they will all look like with the custom component.

This is what it looks like using the ThemeOptions in React with MUI:

App.js

```js
...
import { createTheme, ThemeProvider } from '@mui/material'
function App() {
  const theme = React.useMemo(() => createTheme(themeOptions))
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        ...
```

Then, wherever we want to use a button in a component, it's imported and used and has the correct theme:

```js
import Button from '@mui/material/Button'
...
  <Button variant="contained">Contained button</Button>
```

If we wanted to support a light/dark mode, then we could use context and wrap the theme provider in that as shown in [this article on Theming with React and MUI](https://www.welcomedeveloper.com/react-mui-theme) :

```js
    <ColorContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        ...
```

If you wanted to make all the buttons with completely rounded corders and closer together, this can be added to the ThemeOptions:

```js
spacing: 4,
shape: {
  borderRadius: 20,
},
```

### GlobalStyles component

There ps://mui.com/material-ui/customization/how-to-customize/

One-off customization
Reusable component
Global theme overrides
Global CSS override
