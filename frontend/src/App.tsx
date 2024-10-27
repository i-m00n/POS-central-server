import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import RightNavbar from './components/RightNavbar';
import TokenExpiryHandler from './components/tokenExpiryHandler';
import { Outlet, useNavigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Set token expiration time (e.g., 3600 seconds or fetch actual expiration from login response)
  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/'); 
  };

  const handleLogout = () => {
    alert("بالرجاء اعادة ادخال البيانات")
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-bg-color min-h-screen flex flex-col">
      <TokenExpiryHandler onLogout={handleLogout} />
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <RightNavbar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 h-fit flex justify-center p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
