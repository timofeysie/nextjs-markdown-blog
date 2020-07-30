# NextJS Markdown Blog

Based on the simple [blog of Telmo Goncalves](https://telmo.im/writings/open-sourcing-blog) which uses React via Next.js to serve up markdown content.

This project uses [react-markdown](https://github.com/rexxars/react-markdown) to handle markdown formatting and [gray-matter](https://www.npmjs.com/package/gray-matter) to parse the file frontmatter data.

## Workflow

```bash
npm run dev
```

To ship a new version, merge a pull request to the master branch. Vercel will automatically create a production deployment.

## App structure

Here is the basic layout of the app.

```txt
├───components
│   ├───CodeBlock.js
│   └───Layout.js
├───constants
│   ├───Stack.js
│   └───Uses.js
├───content
│   └───hello-world.md
├───pages
│   ├───_app.js
│   ├───about.js
│   ├───index.js
│   ├───uses.js
│   ├───post
│   │   └───[slug].js
│   └───writings
│       └───[slug].js
├───public
│   ├───images
│   │   └───reduce.png
│   └───og
│       └───darkmodecssjs.png
├───styles
│       └───# base.css
├───writings
│       ├───counter-example.md
│       └─── ...
```

I would prefer using TypeScript.  Just seeing the .js file extension makes me a little uncomfortable these days.  TypeScript offers a lot of confidence when working on a project.  I could use Next.js to setup TypeScript, but since this project is not about React with TypeScript, I will keep it as it is.  Keeps me in touch with the Vanilla JavaScript world.

The variety of naming conventions also makes me a little uncomfortable, but again, the goal here is not to create a project with model code, but to serve up markdown tutorials.

## Linting

After using this app for a while with no issues, all of a sudden, after upgrading VSCode, the import statements had TypeScript errors indicated by red squiggly underlines which on mouseover said:

```txt
'import' is only available in ES6 (use 'esversion: 6'). (W119)jshint(W119)
```

Getting rid of the JSHint plugin did the trick.  I was getting an error alert with is sometimes, and this was the last straw.

## The counter example blog

After creating the first blog page, when deployed, it returned a 500 error.  Locally, it's a 500 with messages:

```bash
wait  - compiling...
event - compiled successfully
Warning: Invalid DOM property `charset`. Did you mean `charSet`?
    in script (at _app.js:20)
    in head
    in Head
    in html
    in Html
    in Document
    in Context.Provider
    in Context.Provider
event - build page: /writings/[slug]
wait  - compiling...
event - compiled successfully
TypeError: Cannot read property 'twitter' of undefined
    at Writing (C:\Users\timof\repos\nextjs-markdown-blog\.next\server\static\development\pages\writings\[slug].js:17211:90)
...
counter-example:1 GET http://localhost:3000/writings/counter-example 500 (Internal Server Error)
nodeStackFrames.js:39 Uncaught     at Writing (file://C:\Users\timof\repos\nextjs-markdown-blog\.next\server\static\development\pages\writings\[slug].js:17211:90)
```

This is due to the header missing in the markdown file.  This portion is used by the gray-matter lib to parse the file frontmatter data which is the information between --- strings in the .md files.

## Set up an S3 bucket with AWS for your production and staging environments

Follow [this guide](https://medium.com/@shamnad.p.s/how-to-create-an-s3-bucket-and-aws-access-key-id-and-secret-access-key-for-accessing-it-5653b6e54337). Once that is ready, you can get your keys.

Login to you're [console](https://console.aws.amazon.com/console/home).

I've got a bucket from 2014 named:

elasticbeanstalk-us-west-2-100641718971

Using a new one instead:

nextjs-markdown-blog-s3-bucket

Find the keys in the menu under your name (your account menu) called *My Security Credentials*

```bash
npm install awscli
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/awscli - Not found
npm ERR! 404
npm ERR! 404  'awscli@latest' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.
npm ERR! A complete log of this run can be found in:
```

Check the date on the article: Jul 21, 2018 · 3 min read (yeah right, that doesn't take into account this kind of problem).

There are two versions of the CLI.

Version 2.x – The current, has Breaking changes, Version 1.x is available for backwards compatiblity.  So you might run into problems following older instructions.  What's the cutoff point there?  Doesn't say.  That's not part of the 3 minute read.  [Following this](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html) for now.

```bash
aws --version
aws-cli/2.0.14 Python/3.7.7 Windows/10 botocore/2.0.0dev18
aws s3 ls
<your buckets>
```

These keys need to be added to the GitHub repos secrets section:

```txt
AWS_S3_BUCKET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

Create the yaml file via the article linked to above and make a PR on the master branch.

```bash
##[warning]Unexpected input 'args', valid inputs are ['']
...
Invalid endpoint: https://s3.***.amazonaws.com
```

Possibly the region was wrong.  
"US East (N. Virginia)" in the console should use the key: us-east-1

After that, this error:

```bash
The user-provided path build does not exist.
```

A [SO]() question answer comment says: *I guess it's important to point out the version that you might have used in your configuration, which I assume it was the 2. I had the same problem as you, and when I tried to install awscli in the deploy step using the python-executor, circleci did not like it... Apparently, in the version 2.1, circleci does not accept executor/docker in the deploy step, only in build. – pmanresa93 Dec 19 '19 at 8:51*

So there's the sinking feeling that going with awscli version 2 might be a bigger issue.

Another solution is to use a persist_to_workspace step in the yaml, but there is always a syntax error on the yaml when it's run.

The last part of the yaml:

```yml
      env:
        AWS_S3_BUCKET: ${{ secrets.AWS_PRODUCTION_BUCKET_NAME }}
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_REGION: ${{ secrets.AWS_REGION }}
        SOURCE_DIR: "build"
```

That last part, when we run npm run build, there is no build directory created.

```
> next build

Warning: Built-in CSS support is being disabled due to custom CSS configuration being detected.
See here for more info: https://err.sh/next.js/built-in-css-disabled

Creating an optimized production build

Compiled successfully.

Automatically optimizing pages

Page                                                           Size     First Load JS
┌ λ /                                                          19.7 kB         138 kB
├   /_app                                                      2.21 kB        61.6 kB
├ ○ /404                                                       2.61 kB        64.2 kB
├ ○ /about                                                     864 kB          931 kB
├ λ /post/[slug]                                               981 B           138 kB
├ λ /uses                                                      1.25 kB        68.3 kB
└ λ /writings/[slug]                                           272 kB          414 kB
+ First Load JS shared by all                                  61.6 kB
  ├ static/pages/_app.js                                       2.21 kB
  ├ chunks/319bd00ec334e48eda8ee8651510dfb953cf9cb3.689f56.js  8.12 kB
  ├ chunks/commons.4abdc0.js                                   3.19 kB
  ├ chunks/framework.43cbee.js                                 40.5 kB
  ├ chunks/styles.7a2eb5.js                                    87 B
  ├ runtime/main.e1255e.js                                     6.27 kB
  ├ runtime/webpack.539cb6.js                                  1.26 kB
  └ css/styles.887bae79.chunk.css                              1.94 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
```

There is a .next/static/chunks/... directory that has js chunks.  Shouldn't that be used?  How to put that in the yaml?  And why didn't the article meant for React Next.js projects not include it?

Asking the [author](https://medium.com/p/b1cb9ba75c95/responses/show).

Probably should have looked more at the Next.js docs.  They have an extra export command that can be run after a build.

In the scripts, we can use this:

```bash
"build": "next build && next export",
```

Then this:

```bash
npm run build
...
> using build directory: C:\Users\timof\repos\nextjs-markdown-blog\.next
  copying "static build" directory
> No "exportPathMap" found in "next.config.js". Generating map from "./pages"
  launching 7 workers
  copying "public" directory
[    ] Exporting (4/7)
Error occurred prerendering page "/post/[slug]". Read more: https://err.sh/next.js/prerender-error
Error: Cannot find module './undefined.md'
[==  ] Exporting (6/7)
Error occurred prerendering page "/writings/[slug]". Read more: https://err.sh/next.js/prerender-error
Error: Cannot find module './undefined.md'
Exporting (7/7)
Error: Export encountered errors
    at _default (C:\Users\timof\repos\nextjs-markdown-blog\node_modules\next\dist\export\index.js:19:1164)
    at processTicksAndRejections (internal/process/task_queues.js:88:5)
```

So maybe the static site approach is not going to work with the markdown serving app.

Next.js is *heavily* pushing the Vercel approach.  There is a free hobby version that appears to support GitHub for CI/CD.  It boasts a simple setup.  I delivers.  My interactions from using my GitHub account login I chose the repos, it detected Next.js and did the rest.  Two minutes later the app was live.

The Vercel site provides a dashboard and tools.

https://vercel.com/timofeysie/nextjs-markdown-blog

https://vercel.com/timofeysie/nextjs-markdown-blog/855x35dte

Then I realized that the initial blog by Telmo talked about ZEIT, which is now Vercel.  Well, it's a very proactive deployment process.  Since dev-ops is not the goal of this project, it works well to simplify hosting.

It will use Twitter and hashtags to run comments.  I don't use Twitter for much besides an industry watch, so using it with article specific hashtags to collect comments and discussion is fine.  Disqus was also an option.  SN sharing links would also be an improvement.

For now, I need to do some [more reading about Vercel deployments](https://nextjs.org/docs/deployment).  The first attempt at visiting the counter example markdown file in the writings directory returned a 500.

## Apex and his Orchestra

The promise of an easy deployment faded while following [this guide](https://medium.com/@romanenko/simple-ci-for-next-js-projects-with-apex-up-github-actions-6f0b1b9a5400)

Should have read [this update](https://aws.amazon.com/blogs/mobile/amplify-framework-announces-new-rearchitected-ui-component-and-modular-javascript-libraries/) first.

Amplify Framework announces new, rearchitected UI Component and modular JavaScript libraries, on 09 APR 2020.  Actually, we don't need Amplify.  It is a wrapper for Cognito Auth functionality.  That's nice, but a static blog only needs comments, an email list and social network share links.

SO just an S3 bucket should be fine.

[This is worth a shot](https://medium.com/trackstack/deploying-a-react-app-to-aws-s3-with-github-actions-b1cb9ba75c95)

trigger on push to your master branch

The runs-on step outlines the virtual instance running the app and qdd the Node version to run using the strategy and matrix keys.

The workflow is running the actions/checkout Github Action and install, build and test the app before deploying to S3.  We can and should add linting at this stage.

deployment step, which is can be done by using a Github Action called s3-sync-action by Jake Jarvis.

Set the AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY or AWS_REGION variables in the Settings menu.

## Setting up Apex with Up

[Install up](https://apex.sh/docs/up/setup/) and [set variables with AWS credentials](https://apex.sh/docs/up/credentials/) in our environment.

### Installing Up

Installing up is old school via curl.  I know, but AWS is old school.  You will learn this very quickly working with their Javascript libs.  Anyhow, this is the first command used:

```bash
$ curl -sf https://up.apex.sh/install | sh
'sh' is not recognized as an internal or external command,
operable program or batch file.
```

You get used to people use the latest tools like npm (like for the past ten years) and then you stumble into a walled off old-school territory, and you get [tj's comment on this issue](https://github.com/apex/up/issues/293) saying:

*Hmm I'm not too familiar with the Windows ecosystem, but for the moment you might have better luck downloading a tarball on https://github.com/apex/up/releases for the exe.*

You would think someone at Amazon would know something about windows.  I know this is a full stack app, node/next, and backend is something I tend to avoid these days as I focus purely on front end issues, but c'mon.  Provide an npm dist, please!  Some people might enjoy setting environment variables for things to work, but, it's just so ... old. OK, enough ranting.

Someone there on the issue provides a little more information:

1. From https://github.com/apex/up/releases, for 64-bit Windows, download "up_0.5.0_windows_amd64.tar.gz for 64"
2. Extract the tarball file. Might want to use 7-Zip.
3. Copy up.exe into "c:\Program Files\up"
4. Add "c:\Program Files\up" to your "Path" environment variables.

Had to download 7-Zip.  What an old program.  There's that word, *old* again.  Copied the files, now, tangent done hopefully.  If you don't know how to add environment variables to the PATH on Windows 10, Google is your friend.

I close the terminal, start another one and then try this:

```bash
up
'up' is not recognized as an internal or external command,
operable program or batch file.
```

The file is not in the dll directory C:\Windows\System32\

How does it get there?  I don't care, or want to care, but no I have to care.  Thanks Amazon.  It's late Sunday night and I should be editing a blog post, no researching Windows application setup.

After all that, it appears there is an npm package:

```bash
> npm i -g up
+ up@1.0.2
updated 1 package in 0.231s
```

Have to delete all the ranting!  Darn, love a good rant.  But there are still opportunities.  Despite the above, this still happens:

```bash
> up
'up' is not recognized as an internal or external command,
operable program or batch file.
```

Despite [the article on Medium](https://medium.com/@romanenko/simple-ci-for-next-js-projects-with-apex-up-github-actions-6f0b1b9a5400) being dated Aug 18, 2019, I finally find out the up is no longer maintained.

It says [at the top of the repo](https://github.com/apex/apex) *This software is no longer being maintainted and should not be chosen for new projects, unless your company is interested in sponsoring the project it's unfortunately unsustainable.*

Great.  What is plan B?

### AWS Credentials

To [set variables with AWS credentials](https://apex.sh/docs/up/credentials/) in your environment, you would need some kind of file.

AWS tools support the ~/.aws/credentials

```bash
[myaccount]
aws_access_key_id = xxxxxxxx
aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxx
```

To activate these settings:

```bash
export AWS_PROFILE=myaccount
```

If that seems a little vague, it is.  There is actually a [more detailed page](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) which I'm really eager not to read.  This page looks like all the Amplify documents I had read in the past.  I have an AWS account, but haven't touched it for a year since working with the exciting world of serverless and then having to drop it all for a new role that involved Ionic and Electron.  Yes, as a contractor, unfortunately my learning is often work related.

There is a aws configure command which should allow you to interactively configure these things:
```bash
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

This may not all be needed if the GitHub hook works well.  The ideal is to edit a markdown file on GitHub itself, commit the changes and have an action build and deploy it.  No CLI work needed.  We'll see how that goes.

The second link says: *The AWS Access Key ID and AWS Secret Access Key are your AWS credentials. They are associated with an AWS Identity and Access Management (IAM) user or role that determines what permissions you have. For a tutorial on how to create a user with the IAM service, see [Creating Your First IAM Admin User and Group](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) in the IAM User Guide.*

Great, yet another boring page to read.  Luckily I keep good notes, so I can see from a year and two laptops ago, that I had used this method:

```bash
export AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxx
export AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are now available for serverless to use
serverless deploy
```

That was on a mac however.  I think windows needs a slightly different format?

Windows Command Prompt version:

```bash
C:\> setx AWS_ACCESS_KEY_ID xxxxxxxxxxxxxxxxxx
C:\> setx AWS_SECRET_ACCESS_KEY export AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
C:\> setx AWS_DEFAULT_REGION us-west-2
```

Only the AWS stuff might be useful, if it'a still relevant.  It [may not be](https://aws.amazon.com/blogs/mobile/amplify-framework-announces-new-rearchitected-ui-component-and-modular-javascript-libraries/).

## Original Readme

Boilerplate used for the blog post published [here](https://telmo.online/nextjs-blog-in-less-than-1-hour) by [Telmo](https://twitter.com/telmo)

---

Run:

```
npm install
```

```
npm run dev
```

[Next.js][https://nextjs.org/].

If you access http://localhost:3000/post/hello-world we'll want to load a file called hello-world.md
