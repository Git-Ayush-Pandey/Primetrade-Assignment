import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-indigo-600">
              <BookOpen className="h-6 w-6 mr-2" />
              PrimeNotes
            </Link>
          </div>
          <div className="flex items-center">
            {token ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {user.role === 'admin' && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-2 uppercase">Admin</span>}
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
