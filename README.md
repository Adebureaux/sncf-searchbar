# About this project

This project is a Next.js application created with create-next-app. The goal of this project was to develop a React component using TypeScript that replicates the search bar from https://www.sncf-connect.com/. This was my first project using React, and it provided me with a lot of valuable experience with important concepts such as useState, useEffect, useRef, FunctionComponent, JSX/TSX syntax, and Cypress.

The code was designed to handle four different display scenarios:

0: Do not display
1: Display popular
2: Display autocomplete
3: Display no result found

The features of this project include a search bar that closely resembles the one found on the sncf-connect website, custom-made SVG icons, responsive design, handling of slow connections (with the possibility of adding a spinner during data loading), handling of long user input, and a fetch system that avoids unnecessary API calls by eliminating duplicate data. The render was also tested with Cypress.

## Features

- A practically identical design of the sncf-connect searchbar
- Handmades svg icons
- A responsive design
- Handle slow connexion (could have to add some spinner where the data is loading)
- Handle long user input
- Fetch system that avoid useless api calls (e.g. duplicates data)
- Render tested with cypress
- Deployed at https://sncf-searchbar.vercel.app/

## Getting Started

To get started with this project, simply run the development server using :
```bash
npm run dev
```

## Deployed on Vercel

This application has been deployed on Vercel and can be accessed at https://sncf-searchbar.vercel.app/.
