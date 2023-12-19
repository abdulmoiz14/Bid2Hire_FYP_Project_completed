import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ThemeProvider from './Dashboard/theme';
// import SignUp from './pages/SignUp';
// import SignIn from './pages/SignIn';
// import Home from './pages/Home';
// import LaborSignUp from "./pages/LaborSignUp";
// import BidForm from './pages/BidForm';
// import DashboardLayout from './Dashboard/layouts/dashboard';
// import BlogPage from './Dashboard/pages/BlogPage.js';
// import UserPage from './Dashboard/pages/UserPage';
// import ProductsPage from './Dashboard/pages/ProductsPage';
// import DashboardAppPage from './Dashboard/pages/DashboardAppPage';
import DashboardRouter from './Dashboard/routes.js';
// import { StyledChart } from './Dashboard/components/chart';
// import ScrollToTop from './Dashboard/components/scroll-to-top';
function App() {
  return (
    <React.Fragment>
        {/* <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/proSignup" element={<LaborSignUp />} />
          <Route path="/bidForm" element={<BidForm />} />
        </Routes> */}
          {/* Dashboard routes */}
          {/* <Route
            path="/dashboard/*"
            element={ */}
            <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider>
                {/* Include ScrollToTop and StyledChart here if needed */}
                {/* <ScrollToTop />
                <StyledChart />  */}
                {/* <DashboardLayout>
                  <Route path="app" element={<DashboardAppPage />} />
                  <Route path="user" element={<UserPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="blog" element={<BlogPage />} />
                </DashboardLayout> */}
                <DashboardRouter />
              </ThemeProvider>
              </BrowserRouter>
              </HelmetProvider>
            {/* } */}
          {/* /> */}

          {/* Default route */}
          {/* <Route path="*" element={<Navigate to="/dashboard/app" replace />} /> */}
    </React.Fragment>
  );
}

export default App;
