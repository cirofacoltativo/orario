import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Calendar, Users, Clipboard, LineChart, Settings, LayoutGrid } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-teal-700">MedScheduler</h1>
          <p className="text-gray-500 text-sm">UOC Ginecologia e Ostetricia</p>
        </div>
        
        <nav className="mt-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' : ''
              }`
            }
            end
          >
            <LayoutGrid className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/doctors" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' : ''
              }`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Medici
          </NavLink>
          
          <NavLink 
            to="/services" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' : ''
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Servizi
          </NavLink>
          
          <NavLink 
            to="/generate" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' : ''
              }`
            }
          >
            <Calendar className="w-5 h-5 mr-3" />
            Genera Orario
          </NavLink>
          
          <NavLink 
            to="/schedule" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' : ''
              }`
            }
          >
            <Clipboard className="w-5 h-5 mr-3" />
            Visualizza Orario
          </NavLink>
          
          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' : ''
              }`
            }
          >
            <LineChart className="w-5 h-5 mr-3" />
            Report
          </NavLink>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;