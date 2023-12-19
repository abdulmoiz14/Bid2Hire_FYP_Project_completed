import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
// import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Home from '../pages/Home';
import LaborSignUp from '../pages/LaborSignUp';
import BidForm from '../pages/BidForm';
import UserBidding from './pages/UserBidding';
import FlatLabor from './pages/FlatLabor';
import OngoingUser from './pages/ongoingUser';
import OngoingLabor from './pages/OngoingLabor';
// ----------------------------------------------------------------------

export default function DashboardRouter() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/signup" />,
    },
    {
      path: "/signup",
      element : <SignUp />
    },
    {
      path: "/signin",
      element : <SignIn />
    },
    {
      path: "/home",
      element : <Home />
    },
    {
      path: "/proSignup",
      element : <LaborSignUp />
    },
    {
      path: "/bidForm",
      element : <BidForm />
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <UserBidding /> },
        { path: 'ongoingJobs', element: <OngoingUser /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <DashboardAppPage /> },
        { path: '*', element: <Navigate to="/dashboard/app" /> },
      ],
    },
    {
      path: '/dashboard-labor',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard-labor/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'ongoingJobs', element: <OngoingLabor /> },
        { path: 'flatLabor', element: <FlatLabor /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard-labor/app" />, index: true },
        { path: '404', element: <DashboardAppPage /> },
        { path: '*', element: <Navigate to="/dashboard-labor/app" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/signup" replace />,
    },
  ]);

  return routes;
}
