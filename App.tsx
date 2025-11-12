import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Saving from './components/Saving';
import Loan from './components/Loan';
import Ikimina from './components/Ikimina';
import Auth from './components/auth/Auth';
import LandingPage from './components/LandingPage';
import { Page } from './types';

const App: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  // Check for persisted login on initial load
  useEffect(() => {
    const userShouldBeRemembered = localStorage.getItem('rememberUser') === 'true';
    if (userShouldBeRemembered) {
      setIsAuthenticated(true);
      setShowLandingPage(false);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const renderPage = () => {
    switch (currentPage) {
      case Page.Saving:
        return <Saving />;
      case Page.Loan:
        return <Loan />;
      case Page.Ikimina:
        return <Ikimina />;
      case Page.Dashboard:
      default:
        return <Dashboard setActivePage={setCurrentPage} />;
    }
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('rememberUser');
    setIsAuthenticated(false);
    setShowLandingPage(true); // Go back to landing page after logout
    setCurrentPage(Page.Dashboard); // Reset to default page
  }

  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-transparent font-sans flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-grow p-4 pb-24">
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;