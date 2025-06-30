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

const mockBirthRecords = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2023-01-15',
    gender: 'Male',
    placeOfBirth: 'City Hospital',
    fatherName: 'Richard Doe',
    motherName: 'Jane Doe',
  },
  {
    id: 2,
    firstName: 'Peter',
    lastName: 'Jones',
    dateOfBirth: '2023-02-20',
    gender: 'Male',
    placeOfBirth: 'Community Clinic',
    fatherName: 'Robert Jones',
    motherName: 'Mary Jones',
  },
];

const BirthRecords: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [records, setRecords] = useState(mockBirthRecords);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Birth Records');
    XLSX.writeFile(workbook, 'BirthRecords.xlsx');
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'dateOfBirth', header: 'Date of Birth' },
    { key: 'gender', header: 'Gender' },
    { key: 'placeOfBirth', header: 'Place of Birth' },
    { key: 'fatherName', header: "Father's Name" },
    { key: 'motherName', header: "Mother's Name" },
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
        <SectionHeading title="Birth Records" subtitle="View and manage all birth records" />

        <div className="records-table-container">
          <div className="records-table-header">
            <h3>All Birth Registrations</h3>
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

export default BirthRecords;
