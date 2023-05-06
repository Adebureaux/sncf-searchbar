# About this project

This project is a Next.js application created with create-next-app. The goal of this project was to develop a React component using TypeScript that replicates the search bar from https://www.sncf-connect.com/. This was my first project using React, and it provided me with a lot of valuable experience with important concepts such as useState, useEffect, useRef, FunctionComponent, JSX/TSX syntax, and Cypress.

## Features

- A practically identical design of the sncf-connect searchbar
- Handmades svg icons
- A responsive design
- Handling of slow connections (with the possibility of adding a spinner during data loading)
- Handle long user input
- Fetches that avoid useless api calls (e.g. duplicates data)
- Render tested with cypress
- Deployed at https://sncf-searchbar.vercel.app/

## Getting Started

To get started with this project, simply run the development server using :
```bash
npm run dev
```

## Deployed on Vercel

This application has been deployed on Vercel and can be accessed at https://sncf-searchbar.vercel.app/.
