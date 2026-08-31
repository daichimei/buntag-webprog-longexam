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

// Dashboard Structure
import ProtectedRoute from './components/ProtectedRoute';
import DashLayout from './layouts/DashLayout';
import DashboardPage from './pages/DashboardPages/DashboardPage';
import DashOrdersPage from './pages/DashboardPages/DashOrdersPage';
import DashProductListPage from './pages/DashboardPages/DashProductListPage';
import DashReviewsPage from './pages/DashboardPages/DashReviewsPage';
import ReportsPage from './pages/DashboardPages/ReportsPage';
import UsersPage from './pages/DashboardPages/UsersPage';

// Customer Pages
import CartPage from './pages/CustomerPages/CartPage';
import MyOrdersPage from './pages/CustomerPages/MyOrdersPage';

// Shared Pages
import ProfilePage from './pages/ProfilePage';

import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
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
      {
        path: 'cart',
        element: (
          <ProtectedRoute roles={['customer']}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute roles={['customer']}>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      }
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute roles={['admin', 'supplier']}>
        <DashLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <DashProductListPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'orders',
        element: <DashOrdersPage />,
      },
      {
        path: 'reviews',
        element: <DashReviewsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        ),
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
