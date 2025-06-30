import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/page.css';
import '../styles/form.css';
import '../styles/RecordsTable.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Table from '../components/Table';

interface PageProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const mockDeathRecords = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfDeath: '2023-03-10',
    gender: 'Female',
    causeOfDeath: 'Natural Causes',
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfDeath: '2023-04-05',
    gender: 'Male',
    causeOfDeath: 'Accident',
  },
];

const DeathRecords: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [records, setRecords] = useState(mockDeathRecords);

  const handleEdit = (id: number) => {
    // Placeholder for edit logic
    console.log('Edit record:', id);
  };

  const handleDelete = (id: number) => {
    // Placeholder for delete logic
    setRecords(records.filter(record => record.id !== id));
    console.log('Delete record:', id);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Death Records');
    XLSX.writeFile(workbook, 'DeathRecords.xlsx');
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'dateOfDeath', header: 'Date of Death' },
    { key: 'gender', header: 'Gender' },
    { key: 'causeOfDeath', header: 'Cause of Death' },
    { key: 'actions', header: 'Actions' },
  ];

  // Prepare data with actions as a React element
  const tableData = records.map((record) => ({
    ...record,
    actions: (
      <div className="action-buttons">
        <button onClick={() => handleEdit(record.id)} className="edit-btn">Edit</button>
        <button onClick={() => handleDelete(record.id)} className="delete-btn">Delete</button>
      </div>
    ),
  }));

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Death Records" subtitle="View and manage all death records" />

        <div className="records-table-container">
          <div className="records-table-header">
            <h3>All Death Registrations</h3>
            <button onClick={handleExportExcel} className="btn-with-gradient">
              Export to Excel
            </button>
          </div>
          <Table columns={columns} data={tableData} />
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default DeathRecords;
