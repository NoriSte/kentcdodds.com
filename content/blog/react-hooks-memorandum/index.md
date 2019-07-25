---
slug: 'react-hooks-memorandum'
title: 'React Hooks Memorandum'
date: '2019-02-11'
author: 'Stefano Magni'
description: '_Selected and useful React Hooks related links._'
categories:
  - 'react'
keywords:
  - 'react-hooks'
  - 'memorandum'
banner: './images/banner.png'
bannerCredit: ''
---

<!--
TODO: link this post from Medium
TODO: set the cacnonical link on Medium to point here
-->

You can read the post here or
[on Medium](https://medium.com/@NoriSte/react-hooks-memorandum-bf1c2758a672).

---

# React Hooks Memorandum

React hooks have officially landed, take a look and leverage them ASAP, they
worth.

Last update: July 2019

This post is a memorandum of the most important aspects linked to the official
site, **it’s not a detailed explanation** about them **nor a comparison with the
classic React solutions**, it’s just a memorandum (I always need to make one
while studying). I take for granted that you have already read the
[official docs](https://reactjs.org/docs/hooks-intro.html) and this post could
be useful to send you to the most important parts of them.

I will keep it updated in the future with any link I retain usefully (common
issues, recommendations etc.).

## React Hooks info

• First of all: with Hooks, you can extract stateful logic from a component so
it can be tested independently and reused. Hooks allow you to reuse stateful
logic without changing your component hierarchy.
([link](https://reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components))

• You can think of useEffect Hook as _componentDidMount_, _componentDidUpdate_,
and _componentWillUnmount_ combined
([link](https://reactjs.org/docs/hooks-effect.html))

• You can **think** so but don’t forget that it isn’t
([link](https://blog.kentcdodds.com/react-hooks-whats-going-to-happen-to-my-tests-df4c2b4d67b7))

• The majority of effects don’t need to happen synchronously (and if you need it
to be you can use _useLayoutEffect_)
([link](https://reactjs.org/docs/hooks-effect.html#detailed-explanation))

## React Hooks rules

• Hooks don’t work inside classes
([link](https://reactjs.org/docs/hooks-overview.html#but-what-is-a-hook))

• Only Call Hooks at the Top Level! Don’t call Hooks inside loops, conditions,
or nested functions
([link](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level))

• You can use hooks just inside functional components (or custom hooks), not
from other plain JS functions
([link](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-from-react-functions))

• Hooks are based on call order so: put conditions inside hooks, don’t use hooks
conditionally
([link](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level))

## Common React Hooks use

• **useState**: Unlike _this.setState_ in a class, updating a state variable
always replaces it instead of merging it (that’s why you could choose to use
more ‘useState’ calls)
([link](https://reactjs.org/docs/hooks-state.html#tip-using-multiple-state-variables))

• **useState**: it is possible to get the previous props or state
([link](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state))

• **useEffect**:\** \*\*you can pass *useEffect\* a function to clean up it
([link](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup))

• **useEffect**: you can tell React to skip applying an effect if certain values
haven’t changed between re-renders. To do so, pass an array as an optional
second argument to useEffect
([link](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects))

• **useEffect**: If you want to run an effect and clean it up only once (on
mount and unmount), you can pass an empty array ([]) as a second argument
([link](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects))

• **useEffect, lazy initial state**: if the initial state is the result of an
expensive computation, you may provide a function instead, which will be
executed only on the initial render
([link](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state))

• **custom hooks**: a custom Hook is a JavaScript function whose name starts
with ”use” and that may call other Hooks
([link](https://reactjs.org/docs/hooks-overview.html#-building-your-own-hooks))

• **useReducer**
([link](https://reactjs.org/docs/hooks-reference.html#usereducer)): lazy
initialization
([link](https://reactjs.org/docs/hooks-reference.html#lazy-initialization))

• **useCallback** and **useMemo**: use them for memoization-related features
([link](https://reactjs.org/docs/hooks-reference.html#usecallback) and
[link](https://reactjs.org/docs/hooks-reference.html#usememo))

• **useRef** ([link](https://reactjs.org/docs/hooks-reference.html#useref))

• **useLayoutEffect** (remember that blocks the visual updates)
([link](https://reactjs.org/docs/hooks-reference.html#uselayouteffect))

## Notable posts

• Should I useState or useReducer?
([link](https://kentcdodds.com/blog/should-i-usestate-or-usereducer))

## Common issues/questions

• Why should I prefer to use Hooks instead of Classes?
([link](https://stackoverflow.com/a/54741742/700707))

• Infinite loop when used with Redux to use an effect just once
([link to the issue](https://stackoverflow.com/questions/54632520/how-to-fetch-data-by-existing-redux-action-with-hooks/54634439)
and to
[the docs](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects))

• Is there something like instance variables?
([link](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables))

• What are the React Hooks tradeoffs?
([link](https://twitter.com/acemarke/status/1149000836200181760))

And I end up the post with a recommendation from the React team themselves:
**try to resist adding abstraction too early
😊**([link](https://reactjs.org/docs/hooks-custom.html#useyourimagination)).
