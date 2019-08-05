---
slug: 'the-concept-of-monitoring-tests'
title: 'The concept of “Monitoring Tests”'
date: '2019-07-30'
author: 'Stefano Magni'
description:
  '_Small E2E tests that check little (but crucial) technical details._'
categories:
  - 'testing'
keywords:
  - 'testing'
  - 'monitoring'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Rainer Bleek](https://unsplash.com/@brain1966?utm_source=unsplash)
  on [Unsplash](https://unsplash.com)'
---

<!--
TODO: link this post from Medium
TODO: set the canonical link on Medium, dev.to etc to point here
-->

I'm working on a big
[UI Testing Best Practices](https://github.com/NoriSte/ui-testing-best-practices)
project on GitHub, I share this post to spread it and have direct
feedback.<br /> You can read the post here,
[on Medium](https://medium.com/@NoriSte/the-concept-of-monitoring-tests-d7cb5af514e5)
or [on dev.to](https://dev.to/noriste/the-concept-of-monitoring-tests-4l5j).

---

I’m working on a big
[UI Testing Best Practices](https://github.com/NoriSte/ui-testing-best-practices)
project on GitHub, I share this post to spread it and have direct feedback.

---

Some months ago I worked on the [business.conio.com](https://business.conio.com)
site, based on [Gatsby](https://www.gatsbyjs.org). Apart from
[sharing some plugins](https://github.com/NoriSte/all-my-contributions#for-gatsby)
I wrote, I wanted to improve the website performances as much as we could.
Luckily, Gatsby stands out by self when speaking about performance but you know,
it’s never enough.

I pushed the [Conio](https://conio.com/it/)’s DevOps (Hi
[Alessandro](https://www.linkedin.com/in/frossialessandro/) 👋) to leverage as
much as he can the AWS/S3 capabilities to provide
[Brotli](https://www.wikiwand.com/en/Brotli)-compressed and forever-cached
static assets to the website users. The result was a super-performant product
but the road was not so easy because due to the bucket configuration, sometimes
the **Brotli compression was broken**.

The error was subtle because the site uses a bunch of JavaScript features. The
website **seemed** to work but if the compression was not set correctly, the
contact form would have not worked. The symptom of the error was just an error
printed in the console.

This kind of error is easily identifiable with an E2E test that checks if the
form works or not (from the user’s perspective, obviously) but I could not rely
on a test like this because the test suite was quite slow. After all, every E2E
test is slow. More: the DevOps needed frequent feedbacks, he changed the S3
configuration a lot of times and **receiving feedback in seconds** instead of
minutes could be nice.

Since the check was pretty simple and I hate to test things manually, I wrote a
simple test to keep the Brotli compression checked. I used
[Cypress](https://www.cypress.io) and I wrote a test like the following one

```javascript
// extract the main JS file from the source code of the page. I removed the regex matching part
const getMainJsUrl = pageSource => '/app-<example-hash>.js'

context(
  'The Brotli-compressed assets should be served with the correct content encoding',
  () => {
    const test = url => {
      cy.request(url)
        .its('body')
        .then(getMainJsUrl) // retrieves the app.js URL
        .then(appUrl =>
          cy
            .request({url: url + appUrl, headers: {'Accept-Encoding': 'br'}})
            .its('headers.content-encoding')
            .should('equal', 'br'),
        )
    }

    it('staging', () => test(urls.staging))
    it('production', () => test(urls.production))
  },
)
```

Once written, I could provide a dedicated script that launched only this test
(excluding all the standard E2E tests). Et voilà: I could keep monitored the
Brotli compression with a super-fast test!

What about cache management? We faced some troubles with it too, I added some
dedicated tests

```javascript
const shouldNotBeCached = (xhr) => cy.wrap(xhr)
  .its("headers.cache-control")
  .should("equal", "public,max-age=0,must-revalidate")

const shouldBeCached = (xhr) => cy.wrap(xhr)
  .its("headers.cache-control")
  .should("equal", "public,max-age=31536000,immutable")

context('Site monitoring', () => {
  context('The HTML should not be cached', () => {
    const test = url =>
      cy.request(url)
        .then(shouldNotBeCached)

    it("staging", () => test(urls.staging))
    it("production", () => test(urls.production))
  })

  context('The static assets should be cached', () => {
    const test = url =>
      cy.request(url)
        .its("body")
        .then(getMainJsUrl)
        .then(appUrl => url+appUrl)
        .then(cy.request)
        .then(shouldBeCached)

    it('staging', () => test(urls.staging))
    it('production', () => test(urls.production))
  })
}
```

I love these little tests because, in a few seconds, they keep checked something
crucial for the user experience. I can sleep well, we are **protected** from
these problems **forever**.

## What else Monitoring Tests could check?

It’s way too much easy to make a big mess with a Gatsby configuration (with a
lot of conditions and customizations for the different environments). The first,
crucial, things to keep monitored are the easiest ones: the _robots.txt_ and
_sitemap.xml_ files.

The _robots.txt_ file must disallow the staging site crawling and allow the
production one:

```javascript
context(
  'The robots.txt file should disallow the crawling of the staging site and allow the production one',
  () => {
    const test = (url, content) =>
      cy
        .request(`${url}/robots.txt`)
        .its('body')
        .should('contain', content)

    it('staging', () => test(urls.staging, 'Disallow: /'))
    it('production', () => test(urls.production, 'Allow: /'))
  },
)
```

while the sitemap.xml file, like the static assets, must not be cached:

```javascript
context('The sitemap.xml should not be cached', () => {
  const test = url => cy.request(`${url}/sitemap.xml`).then(shouldNotBeCached)

  it('staging', () => test(urls.staging))
  it('production', () => test(urls.production))
})
```

I wrote one more Monitoring Test because of an error that appeared because of a
wrong build process: sometimes all the pages, except for the home page,
contained the same content of the 404 page. The test is the following:

```javascript
context(
  'An internal page should not contain the same content of the 404 page',
  () => {
    const pageNotFoundContent = 'Page not found'
    const test = url => {
      cy.request(`${url}/not-found-page`)
        .its('body')
        .should('contain', pageNotFoundContent)
      cy.request(`${url}/about`)
        .its('body')
        .should('not.contain', pageNotFoundContent)
    }

    it('staging', () => test(urls.staging))
    it('production', () => test(urls.production))
  },
)
```

## Running them

I wrote the tests with [Cypress](https://www.cypress.io) and running them-only
is super-easy if you name the file _xxx.**monitoring**.test.js:_

```bash
cypress run — spec \"cypress/integration/**/*.**monitoring**.*\"
```

## Why keeping them separated from the standard E2E tests?

Well, because:

- monitoring tests are not written from the user perspective, E2E tests are. But
  with E2E tests I could have a “the contact form should work” failing test
  while, with monitoring tests, I could have a “brotli compression should work”
  failing test (more and more useful). I always prefer user-oriented tests but,
  when something fails frequently, I want to keep it checked
- monitoring tests are inexpensive, E2E tests are not: E2E tests are super-slow,
  they can congest your pipeline queue and, based on how you implemented them,
  they can affect your analytics. That’s why I usually do not run them against
  the production environment but only against the staging one. The monitoring
  tests are run against both environments without cons

You can find all the tests in
[this gist](https://gist.github.com/NoriSte/b35187f9f14684cd83e0389e1cbcc495) of
mine.
