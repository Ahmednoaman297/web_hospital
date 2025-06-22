
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RobotInfoPage } from '@/components/RobotInfoPage';
import { Dashboard } from '@/components/Dashboard';

type AppState = 'login' | 'info' | 'dashboard';

export const HospitalRobotApp = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('login');
  const [user, setUser] = useState<string>('');

  const handleLogin = (username: string) => {
    setUser(username);
    setCurrentPage('info');
  };

  const handleProceedToControl = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser('');
    setCurrentPage('login');
  };

  const handleGoBackFromInfo = () => {
    setCurrentPage('login');
  };

  const handleGoBackFromDashboard = () => {
    setCurrentPage('info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {currentPage === 'login' && (
        <LoginForm onLogin={handleLogin} />
      )}
      
      {currentPage === 'info' && (
        <RobotInfoPage 
          user={user}
          onProceedToControl={handleProceedToControl}
          onLogout={handleLogout}
          onGoBack={handleGoBackFromInfo}
        />
      )}
      
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
          onGoBack={handleGoBackFromDashboard}
        />
      )}
    </div>
  );
};
