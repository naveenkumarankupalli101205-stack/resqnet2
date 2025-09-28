import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeLanding from './pages/home-landing';
import VictimDashboard from './pages/victim-dashboard';
import LoginRegister from './pages/login-register';
import VolunteerDashboard from './pages/volunteer-dashboard';
import AlertHistory from './pages/alert-history';
import UserProfile from './pages/user-profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AlertHistory />} />
        <Route path="/home-landing" element={<HomeLanding />} />
        <Route path="/victim-dashboard" element={<VictimDashboard />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/alert-history" element={<AlertHistory />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
