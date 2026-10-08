# AVELORA

AVELORA is a responsive TV-show discovery app built with React and Vite. It uses the TVMaze public API for show listings, search, and show details. Premium is a pricing showcase only; it does not process payments.

## Run locally

```sh
npm install
npm run dev
```

Run the project checks with `npm run lint` and `npm run build`.

## Main routes

- `/` — discover, search, and filter shows.
- `/movies` — compatibility route that redirects to the discovery page.
- `/movies/:id` — details for a TVMaze show.
- `/premium` — three showcase pricing plans.

## Theme behavior

The Navbar theme control switches directly between Light and Dark as a manual override. Theme settings also provide Auto, Light, and Dark modes and editable local-time start times. Auto is the default and uses a 06:00 light start and an 18:00 dark start. Theme mode and schedule are saved in `localStorage`; no operating-system theme preference is used.

## Project structure

- `src/main.jsx` — mounts React and the router.
- `src/App.jsx` — owns routes, persisted theme preferences, and local-time schedule switching.
- `src/index.css` — shared light/dark design tokens and page background.
- `src/Pages/Home.jsx` — loads shows, handles TVMaze search, and filters genres.
- `src/Components/SearchBar.jsx` — search input and genre controls.
- `src/Components/MovieCard.jsx` — linked show cards and ratings.
- `src/Pages/MovieDetails.jsx` — show details and loading/error states.
- `src/Pages/Premium.jsx` — pricing showcase.
- `src/Components/Navbar.jsx` — home navigation, theme toggle, theme settings, and search.
- `src/Components/Footer.jsx` — AVELORA footer and neutral platform links.
