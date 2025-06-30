import React, { useEffect, useState } from 'react';
import '../styles/page.css';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import RecentActivities from '../components/RecentActivities';
import QuickActions from '../components/QuickActions';

// import Searchbar from '../components/Searchbar';
// import Table from '../components/Table';
// import vehicleData from '../../db.json';

interface Claim {
  claimAmount?: string | number;
}

interface Vehicle {
  insurance?: boolean;
  claims?: Claim[];
}

interface Stats {
  totalVehicles: number;
  totalInsurances: number;
  totalClaims: number;
  totalClaimAmount: number;
  insuranceCoverage: string;
}


interface PageProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}



const Page: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0,
    totalInsurances: 0,
    totalClaims: 0,
    totalClaimAmount: 0,
    insuranceCoverage: '0%',
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setStats({
      totalVehicles: 1250,
      totalInsurances: 890,
      totalClaims: 2140,
      totalClaimAmount: 1250,
      insuranceCoverage: '85%',
    });
  }, []);

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />

    {/* <div className="page-container"> */}
    <PageContainer>
    <SectionHeading title="Dashboard" subtitle="Overview of registration system statistics" />
      <div className="dashboard-summary-cards">
        {[
          { title: 'Total Birth Count', subtitle: stats.totalVehicles.toString() },
          { title: 'Total Death Count', subtitle: stats.totalInsurances.toString() },
          { title: 'Total Records', subtitle: stats.totalClaims.toString() },
          { title: 'Certificates Available', subtitle: `${stats.totalClaimAmount}` },
        ].map((card, index) => (
          <Cards key={index} title={card.title} subtitle={card.subtitle} />
        ))}
      </div>
      
      {/* Container for Recent Activities and Quick Actions side by side */}
      <div className="dashboard-components-container">
        <RecentActivities/>
        <QuickActions/>
      </div>

      </PageContainer>
      {/* <Searchbar /> */}
      {/* <Table /> */}
    {/* </div> */}
    <Footer/>
    </>
  );
};

export default Page;
