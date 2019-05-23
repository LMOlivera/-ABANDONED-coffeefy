Coffeefy
=================
We often argue at work about who's turn is to make coffee. With this app, that won't happen anymore!

### What you can do
You create an account in which you will store your coworkers' name, and everyday that person has to confirm he/she made coffee
so the next day another one is in charge of making it.

Technology used
------------
- Node.
  - Express (and Express-Session).
  - Pug.
  - Mongoose (with MLab).
  - Helmet.
- Github.
- FontAwesome.

Project strucutre
------------
- models:
  - Account.js
- public:
  - css: Folder which contains CSS files. Working on mergin all CSS' files.
  - js: Folder which contains JS files. Working on merging all JS' files.
- routes:
  - api.js
  - login-signup.js
  - main.js
- views:
  - login-signup.pug
  - main.pug
  - makers.pug
  - settings.pug
  - signup-success.pug
  - welcome.pug
- package.json
- routes.js
- server.js

Resources
-----------
- [Colormind](http://colormind.io/bootstrap/): Color palette generator powered by IA.
- [Express.js best practices](https://www.tutorialspoint.com/expressjs/expressjs_best_practices.htm): Folder structure.
- [Glitch](https://glitch.com/): Online playground for node applications (this application is hosted there too!).
- [Landing Page UX](https://uxplanet.org/the-ux-behind-designing-landing-pages-that-convert-b302ef745c74): Behind the design of landing pages.
- [Article](https://medium.freecodecamp.org/a-step-by-step-guide-to-making-pure-css-tooltips-3d5a3e237346): Make tooltips using only CSS.