# Change Log – Express version

* **Project restructure (v1.0.0)**
  * Migrated static site into a Node/Express project.  Added a `package.json` with Express dependency and a simple start script.
  * Added `server/index.js` to serve static files from the `public/` directory and expose basic API endpoints (`/api/schedule`, `/api/pricing`) that read from JSON files.
  * Moved HTML, CSS, JS and image assets into a `public/` directory to mirror typical web project conventions.
  * Added `data/schedule.json` and `data/pricing.json` to hold content separate from the templates; these can be used by the front end or extended for additional API routes.
  * The Google Analytics snippet remains embedded directly in each HTML page’s `<head>`.
