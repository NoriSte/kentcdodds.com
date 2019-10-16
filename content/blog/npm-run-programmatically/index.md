---
slug: 'npm-run-programmatically'
title: 'Launching npm run programmatically with npm.run()'
date: '2019-16-10'
author: 'Stefano Magni'
description:
  '_No need for child_process.exec() etc. Pre and post scripts are respected
  too._'
categories:
  - 'npm'
keywords:
  - 'npm'
banner: './images/banner.jpg'
bannerCredit: ''
---

<!--
TODO: perchè non viene mostrato questo post?
TODO: link this post from Medium
TODO: set the canonical link on Medium, dev.to etc to point here
-->

You can read the post here,
[on Medium](https://medium.com/@NoriSte/launching-npm-run-programmatically-with-npm-run-f2a1b8a569a6)
or
[on dev.to](https://dev.to/noriste/launching-npm-run-programmatically-with-npm-run-3mmc).

---

# Launching "\$ npm run" programmatically with `npm.run()`

No need for child_process.exec() etc. Pre and post scripts are respected too.

## The problem of mine

While working on the
[cypress-wait-until](https://github.com/NoriSte/cypress-wait-until) library, I’d
like to upload the test videos on the Cypress Dashboard. Doing that is really
simple, I only had to update my package.json dedicated script:

```
  {
    "scripts": {
      // from
      "cy:run": "cypress run"

      // to
      "cy:run": "cypress run --record --key YOUR_SECRET_KEY"
    }
  }
```

But I had to face a big problem: the YOUR*SECRET_KEY environment variable was
going to be available just in the Travis build, not locally. And if you run it
on your local machine, without a defined YOUR_SECRET_KEY, the \_cypress run*
command failed.

There are a lot of solutions to the above problem (like _child_process.exec_)but
all of them come with a cost and some effects to be managed. More: I needed to
change the way I manage the package.json scripts too.

I’d like to have a **transparent solution** that allowed me to make the
YOUR_SECRET_KEY optional but without changing anything in my scripts management.

## Npm as a local dependency

While googling I found an interesting solution: installing Npm locally and
leveraging its APIs. How it works:

- first of all, install npm with

  `$ npm install --save-dev npm`

- then, create a .js file

  `$ touch index.js && open index.js`

- import npm

  ```javascript
  const npm = require('npm')
  ```

- let npm loading the current project

  ```javascript
  npm.load()
  ```

- pass a callback to the _npm.load()_ API and run the script of your

  ```javascript
  npm.load(() *=>* npm.run("SCRIPT_NAME"));
  ```

Some notes about the _npm.run()_ API:

- you cannot run it without calling _npm.load_ in advance. If you try to do that
  you get a "Error: Call npm.load(config, cb) before using this command." error

- the first parameter is the script name, if you need to pass some options you
  must pass an array of strings

  ```javascript
  npm.run('test param') // Error: missing script: test param

  npm.run('test', 'param') // "param" is passed to the "test" script
  ```

- [_pre_ and _post_ package.json scripts](https://docs.npmjs.com/misc/scripts)
  are launched too

I shared a
[npm-run-programmatically-example](https://github.com/NoriSte/npm-run-programmatically-example)
repository where you play with it, here a recorded gif of a terminal session of
the repository:

![The terminal session that shows the result of npm.run()](images/npm-run.gif)_You
can [watch the same video](https://asciinema.org/a/274563) on
[asciicinema](https://asciinema.org/) too._

## How this solution fitted my needs

I solved the original problem this way:

- I added one more _cy:run-uploading-videos_ script to be launched instead of
  _cy:run_

```json
{
  "scripts": {
    "cy:run-uploading-videos": "node cypress-run.js",
    "cy:run": "cypress run"
  }
}
```

- the cypress-run.js file looked like this

```javascript
const npm = require('npm')
npm.load(() => {
  const key = process.env.CYPRESS_RECORD_KEY
  const options = key ? ['--record', '--key', key] : []
  npm.run('cy:run', ...options)
})
```

So I could launch the usual _cy:run_ script locally and launching
_cy:run-uploading-videos_ on Travis 🎉 (without duplicating the _cypress run_
call that could have more parameters in the future).

## What could I do with npm.run()?

An idea of mine is [nprr](https://github.com/NoriSte/nprr), a tool that enhances
npm run with autocomplete. Have you ever felt the situation when you do not
remember the name of the script you want to run? So you open the package.json
file, look for the script name and then run it… Well,
[nprr](https://github.com/NoriSte/nprr) solves this problem! Watch it in action:

![Nprr in action, it enhances the standard "npm run" with autocomplete.](assets/nprr-demo.gif)_You
can [watch the same video](https://asciinema.org/a/274468) on
[asciicinema](https://asciinema.org/) too._

The possibilities are endless and if you leverage npm programmatically, please
leave a comment with your experiments/packages/utilities, etc. 😊
