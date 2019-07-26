---
slug: 'await-dont-sleep-your-e2e-tests'
title: 'Await, do not make your E2E tests sleep ⏳'
date: '2019-07-25'
author: 'Stefano Magni'
description:
  '_Sleeping: the worst practice in E2E testing and the concept of Determinist
  Events._'
categories:
  - 'testing'
keywords:
  - 'testing'
  - 'e2e-testing'
  - 'ui-testing'
  - 'performance'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Joe Roberts](https://unsplash.com/@iamjoeroberts) on
  [Unsplash](https://unsplash.com)'
---

<!--
TODO: link this post from Medium
TODO: set the cacnonical link on Medium to point here
-->

I'm working on a big
[UI Testing Best Practices](https://github.com/NoriSte/ui-testing-best-practices)
project on GitHub, I share this post to spread it and have direct
feedback.<br /> You can read the post here or
[on Medium](https://medium.com/@NoriSte/await-do-not-sleep-your-e2e-tests-df67e051b409).

---

When testing your UI, you define a sort of key points the app must pass through.
Reaching these key points is an asynchronous process because, almost 100% of the
times, your UI does not update synchronously. Those key points are called
**deterministic events**, as known as something that you know that must
happen.<br /> It depends on the events you define and how your UI reaches them
but, usually, there are some "long" waitings, like XHR requests, and some faster
ones, like re-render updates.

The solution to the asynchronous updates seems handy: **sleeping/pausing the
test** for a bunch of milliseconds, tenths of a second, or even seconds. It can
make your test working because it gives the app the time to update itself and
moving to the next deterministic event to be tested.

Consider that, except for specific and known waitings (like when you use
`setInterval` or `setTimeout`), **it's totally unpredictable** how much the
sleeping time should be because it could depend on:

- the network state (for XHR requests)
- the total amount of available machine resources (CPU, RAM, etc.)
  - a CI pipeline can limit them for example
  - other apps can consume them on your local machine too
- the concurrence of other resource-consuming updates (canvas, etc.)
- a bunch of unpredictable game players like Service Workers, cache management
  etc. that can make the UI update process faster or slower

Every fixed delay leads your test to be more brittle and **increasing its
duration**. You are going to find a balance between false negatives—when the
test fails because of a too low sleeping time—and exaggerate test
duration.<br /> What about waiting just the right amount of time? The amount of
time that makes the test as fast as possible!

Waitings fall in four main categories

- **[page Load waitings](#page-load-waitings)**: the first waiting to manage
  while testing your app, waiting for an event that allows you to understand
  that the page is interactive
- **[content waitings](#content-waitings)**: waiting for DOM element that
  matches a selector
- **[XHR request waitings](#xhr-request-waitings)**: waiting for an XHR request
  start or the corresponding response received
- **[custom waitings](#custom-waitings)**: waiting for everything strictly
  related to the app that does not fall into the above categories

Every UI testing tool manages waitings in different ways, sometimes
automatically and sometimes manually. Below you can find some examples of
implementing the listed waitings.

<h3 id="page-load-waitings">Page load waitings</h3>

Every E2E testing tool manages the page load waiting in a different way (in
terms of what is waited before considering the page loaded).

**Cypress**

```javascript
cy.visit('http://localhost:3000')
```

**Puppeteer**

```javascript
await page.goto('http://localhost:3000')
```

**Selenium**

```javascript
driver.get('http://localhost:3000')
driver.wait(function() {
  return driver
    .executeScript('return document.readyState')
    .then(function(readyState) {
      return readyState === 'complete'
    })
})
```

**TestCafé**

```javascript
fixture`Page load`.page`http://localhost:3000`
```

<h3 id="content-waitings">Content waitings</h3>

Take a look at the following examples to see how waiting for a DOM element could
be implemented in the available tools.

**Cypress**

- waiting for an element:

```javascript
// it waits up to 4 seconds by default
cy.get('#form-feedback')
// the timeout can be customized
cy.get('#form-feedback', {timeout: 5000})
```

- waiting for an element with specific content

```javascript
cy.get('#form-feedback').contains('Success')
```

<br />

**Puppeteer**

- waiting for an element:

```javascript
// it waits up to 30 seconds by default
await page.waitForSelector('#form-feedback')
// the timeout can be customized
await page.waitForSelector('#form-feedback', {timeout: 5000})
```

- waiting for an element with specific content

```javascript
await page.waitForFunction(
  selector => {
    const el = document.querySelector(selector)
    return el && el.innerText === 'Success'
  },
  {},
  '#form-feedback',
)
```

<br />

**Selenium<sup> <a href="#footnote2">2</a></sup>**

- waiting for an element:

```javascript
driver.wait(until.elementLocated(By.id('#form-feedback')), 4000)
```

- waiting for an element with specific content

```javascript
const el = driver.wait(until.elementLocated(By.id('#form-feedback')), 4000)
wait.until(ExpectedConditions.textToBePresentInElement(el, 'Success'))
```

<br />

**TestCafé<sup> <a href="#footnote2">2</a></sup>**

- waiting for an element:

```javascript
// it waits up to 10 seconds by default
await Selector('#form-feedback')
// the timeout can be customized
await Selector('#form-feedback').with({timeout: 4000})
```

- waiting for an element with specific content

```javascript
await Selector('#form-feedback').withText('Success')
```

<br />

**DOM Testing Library**<sup> <a href="#footnote1">1</a></sup>

- waiting for an element:

```javascript
await waitForElement(() => getByTestId('form-feedback'))
```

- waiting for an element with specific content

```javascript
const container = await waitForElement(() => getByTestId('form-feedback'))
await waitForElement(() => getByText('Success'), {container})
```

<h3 id="xhr-request-waitings">XHR request waitings</h3>

**Cypress**

- waiting for an XHR request/response

```javascript
cy.server()
cy.route('http://dummy.restapiexample.com/api/v1/employees').as('employees')
cy.wait('@employees')
  .then(xhr => xhr.response.body)
  .then(body => {
    /* ... */
  })
```

<br />

**Puppeteer**

- waiting for an XHR request

```javascript
await page.waitForRequest('http://dummy.restapiexample.com/api/v1/employees')
```

- waiting for an XHR response

```javascript
const response = await page.waitForResponse(
  'http://dummy.restapiexample.com/api/v1/employees',
)
const body = response.json()
```

<br />
Even if it's a really important point, at the time of writing (July, 2019) it seems that waiting for XHR requests and responses is not so
common. With exceptions for Cypress and Puppeteer, other tools/frameworks force you to look for
something in the DOM that reflects the XHR result instead of looking for the XHR request itself. You can read more about th topic:

- Selenium WebDriver:
  [5 Ways to Test AJAX Calls in Selenium WebDriver](https://www.blazemeter.com/blog/five-ways-to-test-ajax-calls-with-selenium-webdriver)
- TestCafé:
  [Wait Mechanism for XHR and Fetch Requests](https://devexpress.github.io/testcafe/documentation/test-api/built-in-waiting-mechanisms.html#wait-mechanism-for-xhr-and-fetch-requests)
- DOM Testing Library:
  [await API](https://testing-library.com/docs/dom-testing-library/api-async#wait)

<h3 id="custom-waitings">Custom waitings</h3>

The various UI testing tools/frameworks have built-in solutions to perform a lot
of checks, but let's concentrate on writing a custom waiting. Since UI testing
is 100% asynchronous, a custom waiting should face recursive promises, a concept
not so handy to manage at the beginning.

Luckily, there are some handy solutions and plugins to help us with that.
Consider if we want to wait until a global variable (`foo`) is assigned with a
particular value (`bar`): below you are going to find some examples.

### Code Examples

**Cypress**

Thanks to the
[cypress-wait-until plugin](https://github.com/NoriSte/cypress-wait-until) you
can do:

```javascript
cy.waitUntil(() => cy.window().then(win => win.foo === 'bar'))
```

<br />

**Puppeteer**

```javascript
await page.waitForFunction('window.foo === "bar"')
```

<br />

**Selenium<sup> <a href="#footnote2">2</a></sup>**

```javascript
browser.executeAsyncScript(`
  window.setTimeout(function(){
    if(window.foo === "bar") {
      arguments[arguments.length - 1]();
    }
  }, 300);
`)
```

<br />

**TestCafé<sup> <a href="#footnote2">2</a></sup>**

```javascript
const waiting = ClientFunction(() => window.foo === 'bar')
await t.expect(waiting()).ok({timeout: 5000})
```

<br />

**DOM Testing Library<sup> <a href="#footnote1">1</a></sup>**

```javascript
await wait(() => global.foo === 'bar')
```

<br />
<a id="footnote1">1</a>: unlike Cypress, Puppeteer, etc. DOM Testing Library is quite a different tool, that's why the examples are not available for every single part.
<br /><br />
<a id="footnote2">2</a>: if there are better solutions or plugins to do the same, please let me know! I know Cypress, Puppeteer, and DOM Testing Library pretty well, but I can not say the same for Selenium and TestCafé.
