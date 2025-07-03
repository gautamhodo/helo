import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../styles/page.css';
import '../styles/form.css';
import '../styles/RecordsTable.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Table from '../components/Table';
// import { Pencil, Trash } from 'lucide-react';
import EditButton from '../components/EditButton';
import DeleteButton from '../components/DeleteButton';
import { useNavigate } from 'react-router-dom';
import Searchbar from '../components/Searchbar';

interface PageProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const BirthRecords: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(data => setRecords(data.birthRecords || []));
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/birth-registration?id=${id}`);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSave = (id: number) => {
    setRecords(records.map(r => r.id === id ? { ...editForm, id } : r));
    setEditId(null);
    setEditForm({});
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/birthRecords/${id}`, { method: 'DELETE' });
      setRecords(records.filter(record => record.id !== id));
    } catch (err) {
      alert('Failed to delete record.');
    }
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

  const filteredRecords = records.filter(record =>
    Object.values(record).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Birth Records" subtitle="View and manage all birth records" />

        <div className="records-table-container">
          <div className="records-table-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', paddingLeft: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleExportExcel} className="btn-with-gradient">
                Export to Excel
              </button>
            </div>
            <div style={{ minWidth: 250 }}>
              <Searchbar value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <Table columns={columns} data={filteredRecords.map((record) => ({
            ...record,
            actions: (
              <div className="action-buttons">
                {editId === record.id ? (
                  <>
                    <button onClick={() => handleSave(record.id)} className="edit-btn">Save</button>
                    <button onClick={() => { setEditId(null); setEditForm({}); }} className="delete-btn">Cancel</button>
                  </>
                ) : (
                  <>
                    <EditButton onClick={() => handleEdit(record.id)} />
                    <DeleteButton onClick={() => handleDelete(record.id)} size={18} className="delete-btn" />
                  </>
                )}
              </div>
            ),
            id: record.id,
            firstName: editId === record.id ? <input value={editForm.firstName || ''} onChange={e => handleEditChange('firstName', e.target.value)} /> : record.firstName,
            lastName: editId === record.id ? <input value={editForm.lastName || ''} onChange={e => handleEditChange('lastName', e.target.value)} /> : record.lastName,
            dateOfBirth: editId === record.id ? <input value={editForm.dateOfBirth || ''} onChange={e => handleEditChange('dateOfBirth', e.target.value)} /> : record.dateOfBirth,
            gender: editId === record.id ? <input value={editForm.gender || ''} onChange={e => handleEditChange('gender', e.target.value)} /> : record.gender,
            placeOfBirth: editId === record.id ? <input value={editForm.placeOfBirth || ''} onChange={e => handleEditChange('placeOfBirth', e.target.value)} /> : record.placeOfBirth,
            fatherName: editId === record.id ? <input value={editForm.fatherName || ''} onChange={e => handleEditChange('fatherName', e.target.value)} /> : record.fatherName,
            motherName: editId === record.id ? <input value={editForm.motherName || ''} onChange={e => handleEditChange('motherName', e.target.value)} /> : record.motherName,
          }))} />
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default BirthRecords;
