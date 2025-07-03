import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import BirthRegistration from './pages/BirthRegistration.tsx';
import DeathRegistration from './pages/DeathRegistration.tsx';
import BirthRecords from './pages/BirthRecords.tsx';
import Certificates from './pages/Certificates.tsx';
import DeathRecords from './pages/DeathRecords.tsx';
import Profile from './pages/Profile.tsx';

import SideBar from './components/SideBar';
import Page from './pages/Page.tsx';
import Table from './pages/Table.tsx';
// Define the props interface for components that receive sidebar props
// interface SidebarProps {
//   sidebarCollapsed: boolean;
//   toggleSidebar: () => void;
// }

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarCollapsed(!sidebarCollapsed);
  };  // const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // const toggleSidebar = (): void => {
  //   setSidebarCollapsed(!sidebarCollapsed);
  // };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw',backgroundColor:'#d9e0e7' }}>
        {/* Horizontal Top Nav Bar */}
        <TopNavBar />

        {/* Main content with Sidebar + Page content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* <SideBar collapsed={sidebarCollapsed} /> */}
          <SideBar collapsed={sidebarCollapsed}/>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            
            <Routes>
              <Route path="/" element={<Page sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
              <Route path="/birth-registration" element={<BirthRegistration sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
              <Route path="/death-registration" element={<DeathRegistration sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
              <Route path="/birth-records" element={<BirthRecords sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
              <Route path="/death-records" element={<DeathRecords sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
              <Route path="/certificates" element={<Certificates sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
              <Route path="/a" element={<Table/>} />
              <Route path="/profile/:type/:id" element={<Profile />} />
             
            </Routes>

          </div>
          
        </div>


      </div>

    </Router> 
    
  );
};

export default App; 