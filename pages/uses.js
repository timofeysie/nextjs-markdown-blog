import React from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { USES } from "../constants/Uses";

function Uses({ og }) {
  return (
    <>
      <Layout secondaryPage>
        <h1 className="uses-h1">What I use</h1>
        <h2 className="uses-list">Standard front end tools</h2>
        <p>
          I try to use what the majority of the industry uses. This means the
          usual setup:
        </p>
        <ul>
          <li>VScode</li>
          <li>npm (or yarn) with nvm</li>
          <li>git</li>
          <li>
            nx/monorepo (not standard but should be for enterprise level
            development)
          </li>
        </ul>
        <h2 className="uses-list">Software</h2>
        <p>
          The editor of choice these days is VSCode. I also have Atom for basic
          stuff, but using TypeScript a lot means any VSCode download works out
          of the box for what I need. I do use some standard extensions to make
          life easier.
        </p>
        <p>Here is my list of VSCode extensions.</p>
        <ul>
          <li>Prettier</li>
          <li>Code Spell Checker</li>
          <li>ESLint</li>
          <li>Nx Console</li>
          <li>GitLens</li>
          <li>Markdownlint</li>
        </ul>
        <p>
          After trying out the airbnb linting stylesheet on a project, I was
          hooked. That is known to be the strictest when it comes to JavaScript.
          It takes care of all kinds of smells that can creep into your code.
          And why stop there? Prettier formats code for you also. On save, or on
          commit, anytime is a good time. Why spend time aligning code blocks?
        </p>
        <p>
          I may not agree with all the rules, such as line length, but being
          part of the broader community has many benefits. And say goodby to
          meaningless discussions about tabs versus spaces, which we all know
          have been known to end relationships.
        </p>

        {/* {USES.map(({ title, stack }) => (
          <ul className="uses-list" key={title}>
            <li className="head">{title}</li>

            {stack.map(({ name, description, link }) => (
              <li key={name}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {name}
                </a>
                <span>{description}</span>
              </li>
            ))}
          </ul>
        ))} */}
      </Layout>
    </>
  );
}

Uses.getInitialProps = () => {
  return {
    data: {
      og: {
        description: "What Timothy uses on a daily basis.",
        image: "https://timothycurchod.com/og/Capture-react-tdd.png",
      },
    },
  };
};

export default Uses;
