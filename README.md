# About this project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The task at hand was to build a Typescript-based React component that mimics the search bar found on https://www.sncf-connect.com/.
This is my very first project on the stack React, I learned a lot about this fabulous framwork, among them : useState, useEffect, FunctionComponent, JSX/TSX syntax, Cypress.
The code has been thinked to handle 4 types of displays :
- 0 -> Do not display
- 1 -> Display popular
- 2 -> Display autocomplete
- 3 -> Display no result found

## Features

- A very similar design of the sncf-connect searchbar
- Handmades svg icons
- A responsive design
- Handle slow connexion (could have to add some spinner where the data is loading)
- Handle long user input
- Fetch system that avoid useless api calls (e.g. duplicates data)
- Render tested with cypress


## Getting Started

First, run the development server:

```bash
npm run dev
```

## Deployed on Vercel

This app as been deployed to: https://sncf-searchbar.vercel.app/
