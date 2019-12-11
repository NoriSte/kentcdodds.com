---
slug: 'software-tests-as-a-documentation-tool'
title: 'Software tests as a documentation tool'
date: '2019-12-06'
author: 'Stefano Magni'
description: '_Why tests are perfect to tell a story of your code._'
categories:
  - 'testing'
keywords:
  - 'testing'
  - 'documentation'
  - 'handover'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Ron Dyar](https://unsplash.com/@prolabprints) on
  [Unsplash](https://unsplash.com)'
---

<!--
TODO: link this post from Medium
TODO: set the canonical link on Medium, dev.to etc to point here
https://medium.com/@NoriSte/software-tests-as-a-documentation-tool-e1c463bad1be
https://dev.to/noriste/software-tests-as-a-documentation-tool-36pl
https://www.linkedin.com/pulse/software-tests-documentation-tool-stefano-magni
-->

I'm working on a big
[UI Testing Best Practices](https://github.com/NoriSte/ui-testing-best-practices)
project on GitHub, I share this post to spread it and have direct
feedback.<br /> You can read the post here, [on Medium](TODO:) or
[on dev.to](TODO:).

---

Documenting is generally hard, it requires precise and meticulous work and it
requires that all the members of the team understand and value writing good
documentation. Documenting is selfless work and for selfless, I mean that it is
dedicated to **other developers and the future we**.

I have ever been convinced that testing methodologies are a great way not only
to be sure that we code what the project needs, not only to grant we do not
introduce regressions but to document the code and the user flows too (please,
remember who is writing is a front-end developer). And recently my
test-as-documentation idea received one more confirmation: **I moved to a new
company** and I had very little time to **tell a new developer what I did**
until now.

## Handover the project to a new developer

First of all, take a look at:

- the architecture of the back-office I was working on, developed with React and
  tested with both Cypress and Jest

![The architecture of the [Conio](https://business.conio.com/) Backoffice.](https://cdn-images-1.medium.com/max/2000/1*kDwTeJkTGVELHvmeDlPnvw.jpeg)_The
architecture of the [Conio](https://business.conio.com/) Backoffice._

- a video of some of the user flows

<center><iframe width="100%" height="315" src="https://www.youtube.com/embed/lNEMKeTYEPI?rel=0" frameborder="0" allowfullscreen></iframe></center>

- a screenshot of some of the Jest tests

![Some integration tests of the [Conio](https://business.conio.com/) Backoffice. Please note that, at the time, I broke a golden testing rule: no tests should share the state.](https://cdn-images-1.medium.com/max/3180/1*xS5TOsDU_Q9RGNn4L-zdWQ.png)_Some
integration tests of the [Conio](https://business.conio.com/) Backoffice. Please
note that, at the time, I broke a golden testing rule: no tests should share the
state._

The steps of telling what –and how– the project does were:

- telling some tech details about the project and the whole architecture

- asking the new developer to explore the Storybook stories

- asking the new developer to **run and watch the Cypress tests**

- asking the new developer to **run and read the output of the Jest tests**

- asking the new developer to read the code of the tests

- measuring the new developer understanding of the project asking him to change
  and test some flows

The handover went so well that I decided to write this post 😊. The new
developer (a quite smart one, I have to admit, hi Lorenzo 👋) showed me to know
pretty well the user flows and to **be able to change big parts of the project
with confidence** (and the related tests too). Nevertheless, he was able to
implement new user flows and test them the same way I did with all the rest of
the project.

## The good and the bad parts

Well, even if I am pretty satisfied with this experience, I must admit that
something was not perfect. I am not speaking about the process itself or the
idea of using the tests as a documentation tool, but the way I wrote the tests.
There were some details that misled the comprehension of the developer that
should read my tests. Let’s examine a quick list of the pros and cons of the
tests I wrote:

### What was good with my tests:

- Testing everything from the UI perspective with Cypress: for a front-end flow,
  the **UI speaks more than everything**

- Having a well-compiled Storybook: writing stories in **Storybook is already
  testing**! It is visual testing that can be easily frozen with a plugin like
  Storyshots

- Straightforward tests code: the code of the tests must be super simple. Simple
  to be read, condition-free, with a low-abstraction level, with a good level of
  logging, etc. Always remember that **the tests must reduce the cognitive load
  of reading and understanding the code**, hence their complexity should be an
  order of magnitude lower compared to the code to be understood

- Sharing some step “ids” between the code and the tests: if a user flow is
  quite long, it could be useful to share some “steps” between the code and the
  code of the tests (mines were comments like “/** #1 \*/”, “/** #2 \*/”, etc.)

- Having more low-level tests for parts of the code (like some sagas, as shown
  in the above screenshot) that could be hard to be understood (and hence hard
  to be updated or refactored to a simpler version)

### What was bad with my tests:

- Some test descriptions were not perfect: good **storytelling skills are pretty
  important** while writing the description of the tests

- Not leveraging **Gherkins** to write the tests themselves: I was not so
  experienced at the beginning and I decide to not consider writing BDD-style
  tests with Gherkins.
  [Take a look](https://cucumber.io/docs/gherkin/reference/) at it to understand
  the storytelling advantages

- Sharing some fixtures between different tests: the fixtures are the static
  version of the responses of the server, the idea of recycling them when they
  are identical has nothing wrong, but I should have cared more about their
  names. Using a “registration-success.json” fixture for both the registration
  and the login flows (it is just an example, I did this mistake in more complex
  cases) leave some doubts to the new developer. This is the kind of things that
  are **frozen in the memory of the developer who wrote the code** (why you can
  use the same fixture for two different cases?), a really bad thing from the
  company perspective

In the end, writing tests allows you to:

- have well-descriptive documentation: the description of the tests are always
  written from the user perspective, not from the developer one

- have easy handover

- avoid relying on the historical memory of some employees (you, for example)

- document some choices that could sound “strange”, or simply complex, when
  reading the code, but perfectly reasonable from the user perspective

not to cite the obvious testing advantages like working regression-free,
leveraging some automated and fast tools, etc. 😊
