import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// HomePage Structure
import Layout from './layouts/Layout';
import AboutPage from './pages/LandingPages/AboutPage';
import HomePage from './pages/LandingPages/HomePage';
import ProductListPage from './pages/LandingPages/ProductListPage';
import ProductPage from './pages/LandingPages/ProductPage';

// Auth Pages Structure
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <AuthLayout />,   // Use AuthLayout for the root
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <SignInPage />,   // Default page is Sign In
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      }
    ],
  },
  {
    path: '/shop',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:name',
        element: <ProductPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
