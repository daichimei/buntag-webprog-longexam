MY ANSWER
Bulldogs Exchange — Long Exam 1 (Frontend–Backend Integration)

1. Frontend connected to real backend APIs. Every page that used to read from mock data / local component state (ProductListPage, DashProductListPage, DashOrdersPage, DashReviewsPage, UsersPage, CartPage,MyOrdersPage, dashboard stat cards, etc) now calls
the corresponding Express REST endpoint through an Axios service module in src/services/. Each service attaches the JWT from localStorage to outgoing requests via an Axios.
2. JWT Authentication and Session Handling Register and Login issue a signed JWT containing id email and role with a one hour expiry from userController.js The token and user info are stored client side and read by AuthContext on app load soa refresh keeps the session Logout clears the stored token and user ending the session verifyToken middleware rejects requests with a missing invalid or expired token returning 401 used on every protected routess.
3. Role Based Access Control or RBAC Server side checkRole admin supplier checkRole admin and selfOrAdmin middleware write endpoints to create update delete products manage users confirm orders and more.
4. Customer features Register and Login Browse products search by name or description filter by category View product reviews Add to cart place and track orders ongoing Create and view reviews View and edit profile change password.
5. Admin facing features Login Create view and edit products DashProductListPage Confirm orders mark orders ready for claiming DashOrdersPage Edit and view reviews DashReviewsPage Manage users view edit set active inactive UsersPage
6. Input Validation and Error Handling Authentication errors missing invalid expired JWT return 401 from verifyToken Authorization errors wrong role or a supplier trying to touch another supplier product return 403 from checkRole or ownership checks in the controllers meanwhile validation errors Mongoose schema validation required fields runValidators true on updates return 400 with a descriptive message. Server errors unexpected failures return 500 with the error message always inside a consistent success message data response shape and on the client API errors are now surfaced to the user via a Snackbar or Alert previously some pages only logged errors to the console which made failures look like the UI was silently doing nothing see Known Issues Fixed below.


Seed scripts (`seedAdmin.js`, `seedUsers.js`, `seedProducts.js`) to populate an initial admin account and sample catalog data for demonstration



# CTWEBPGL Web Programming - Long Exam 1

This repository contains a React frontend built with Vite, React Router, and Tailwind CSS.

The current project is **BulldogEx Shop**, a low-fidelity e-commerce wireframe for campus products. It includes a full-width hero banner, product catalog cards, product detail pages, store information pages, shared layouts, and authentication screens.

## Tech Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS 4
- ESLint

## Main Features

- Full-width e-commerce hero section with background image overlay
- Product listing page with reusable product cards
- Product detail page with price, category, stock, description, and action buttons
- Store-focused home, about, footer, and not found pages
- Authentication pages for sign in and sign up
- Shared layout, navbar, footer, and button components

## Fork and Clone Instructions

Fork the original repository first on GitHub. This creates your own copy of the repository under your GitHub account.

After the repository is forked, clone your forked repository to your local device:

1. Go to the root folder where you want to save the project.
2. Open that folder in **VS Code**.
3. Open the **VS Code Terminal**.
4. Run `git clone` using the URL of your forked repository:

```bash
git clone <forked-repository-url>
```

Example:

```bash
git clone https://github.com/your-username/surname-long-exam.git
```

After cloning the forked repository, go inside the cloned project folder:

```bash
cd surname-long-exam
```

## Project Setup

Install dependencies inside the client app:

```bash
cd surname-client
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Push to GitHub Using Git Bash

Open **Git Bash** or **VS Code Terminal**, then go to the project root folder:

Example
```bash
cd /c/Users/ACER/Desktop/cy.dev/cy.dev.reactjs/course-material/webprog/long-exam1
```

Check the files before committing:

```bash
git status
```

If this folder is not yet a Git repository, initialize it:

```bash
git init
```

Stage, commit, and push the project:

```bash
git add .
git commit -m "initial long-exam1"
git push origin main
```

For future updates after editing files:

```bash
git status
git add .
git commit -m "enhanced long-exam1"
git push
```

## Current Routes

- `/` - Home page
- `/about` - About page
- `/products` - Product list page
- `/products/:name` - Single product page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

## Key Files

- `src/assets/product-content.js` - product data used by the catalog and product pages
- `src/components/ProductCard.jsx` - reusable product card component
- `src/components/ProductList.jsx` - product grid component
- `src/pages/LandingPages/ProductListPage.jsx` - product catalog page
- `src/pages/LandingPages/ProductPage.jsx` - single product detail page
- `src/pages/LandingPages/HomePage.jsx` - landing page with full-width hero banner

## Current File Structure

```text
long-exam1/
├── README.md
└── robles-client/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── assets/
        │   ├── hero.png
        │   ├── product-content.js
        │   ├── react.svg
        │   ├── vite.svg
        │   ├── img/
        │   │   ├── nu_bulldogex_banner.jpg
        │   │   └── nubdexchange_logo.png
        │   └── styles/
        │       └── index.css
        ├── components/
        │   ├── Button.jsx
        │   ├── Footer.jsx
        │   ├── NavBar.jsx
        │   ├── ProductCard.jsx
        │   └── ProductList.jsx
        ├── layouts/
        │   ├── AuthLayout.jsx
        │   └── Layout.jsx
        └── pages/
            ├── NotFoundPage.jsx
            ├── AuthPages/
            │   ├── SignInPage.jsx
            │   └── SignUpPage.jsx
            └── LandingPages/
                ├── AboutPage.jsx
                ├── ProductListPage.jsx
                ├── ProductPage.jsx
                └── HomePage.jsx
```

## Notes

- `node_modules/` and `dist/` are not included in the structure above because they are generated folders.
- The application uses `Layout.jsx` for public pages and `AuthLayout.jsx` for authentication pages.
- Product routes use the product `name` value from `product-content.js` as the URL slug.

## Enhancement Instructions
- Enhancement 1: Develop an original product catalog with appropriate product names, descriptions, prices, categories, and images.
- Enhancement 2: Create a customized footer and notfoundpage that aligns with the website theme and ensure that all links function correctly.
- Enhancement 3: Provide accessible navigation links for both Sign In and Sign Up pages.
- Enhancement 4: Improve the overall visual design through consistent colors, typography, spacing, and imagery without changing the existing component order or page structure.
- Enhancement 5: Research and apply a custom font to the web application using an appropriate implementation method.


