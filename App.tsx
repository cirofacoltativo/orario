import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext';

// Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import ScheduleGeneratorPage from './pages/ScheduleGeneratorPage';
import ScheduleViewerPage from './pages/ScheduleViewerPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster position="top-right" closeButton richColors />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/generate" element={<ScheduleGeneratorPage />} />
            <Route path="/schedule" element={<ScheduleViewerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;