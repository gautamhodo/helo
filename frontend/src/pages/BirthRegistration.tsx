import React, { useState, useEffect } from 'react';
import '../styles/page.css';
import '../styles/form.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Input from '../components/Input';
import DropInput from '../components/DropInput';
import AddInput from '../components/AddInput';
import DateInput from '../components/DateInput';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

interface PageProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const Popup = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="popup-overlay">
      <div className="popup-content">
          <p>{message}</p>
          <button onClick={onClose} className="btn-with-gradient">Close</button>
      </div>
  </div>
);

const BirthRegistration: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  // State for form fields
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    birthHour: '',
    birthMinute: '',
    birthSecond: '',
    gender: '',
    placeOfBirth: '',
    locality: '',
    modeOfBirth: '',
    parity: '',
    birthWeight: '',
    fatherName: '',
    motherName: '',
    parentAddress: '',
    permanentAddress: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      fetch(`/db.json`)
        .then(res => res.json())
        .then(data => {
          const rec = (data.birthRecords || []).find((r: any) => String(r.id) === id);
          if (rec) setForm(rec);
        });
    }
  }, [location.search]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleRegisterBirth = async () => {
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth',
      'gender', 'placeOfBirth', 'locality', 'modeOfBirth', 'parity', 'birthWeight',
      'fatherName', 'motherName', 'parentAddress', 'permanentAddress'
    ];
    const isFormValid = requiredFields.every(field => (form as any)[field].trim() !== '');

    if (!isFormValid) {
      setPopupMessage('Please fill all required fields before registering.');
      setShowPopup(true);
      setShowDownload(false);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      if (id) {
        // Edit mode: PUT
        await fetch(`http://localhost:3000/birthRecords/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setPopupMessage('Birth record updated successfully!');
      } else {
        // POST to json-server
        const response = await fetch('http://localhost:3000/birthRecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        setLastRegistered({ ...form, id: data.id });
        setPopupMessage('Birth registered successfully!');
      }
      setIsLoading(false);
      setShowPopup(true);
      setShowDownload(true);
    } catch (error) {
      setIsLoading(false);
      setPopupMessage('Failed to register birth. Please try again.');
      setShowPopup(true);
      setShowDownload(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setTimeout(async () => {
      const input = document.getElementById('certificate-pdf-view');
      if (input) {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${lastRegistered.firstName || 'Birth'}_Certificate.pdf`);
      }
    }, 100);
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Birth Registration" subtitle="Register a new birth and generate certificate" />
        <form className="birth-registration-form">
          <div className="form-section">
            <h3>Child Information</h3>
            <div className="form-row">
              <div className="form-col">
                <Input label="First Name" value={form.firstName} onChange={handleChange('firstName')} placeholder="Enter first name" />
              </div>
              <div className="form-col">
                <Input label="Middle Name" value={form.middleName} onChange={handleChange('middleName')} placeholder="Enter middle name" />
              </div>
              <div className="form-col">
                <Input label="Last Name" value={form.lastName} onChange={handleChange('lastName')} placeholder="Enter last name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <DateInput label="Date of Birth" value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} />
              </div>
              <div className="form-col">
                <Input label="Hour" value={form.birthHour} onChange={handleChange('birthHour')} placeholder="Hour" type="number" />
              </div>
              <div className="form-col">
                <Input label="Minute" value={form.birthMinute} onChange={handleChange('birthMinute')} placeholder="Min" type="number" />
              </div>
              <div className="form-col">
                <Input label="Second" value={form.birthSecond} onChange={handleChange('birthSecond')} placeholder="Sec" type="number" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <DropInput label="Gender" value={form.gender} onChange={handleChange('gender')} options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]} />
              </div>
              <div className="form-col">
                <Input label="Place of Birth" value={form.placeOfBirth} onChange={handleChange('placeOfBirth')} placeholder="Enter place of birth" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <DropInput label="Locality" value={form.locality} onChange={handleChange('locality')} options={[
                  { label: 'Corporation', value: 'corporation' },
                  { label: 'Panchayath', value: 'panchayath' },
                  { label: 'Other', value: 'other' },
                ]} />
              </div>
              <div className="form-col">
                <DropInput label="Mode of Birth" value={form.modeOfBirth} onChange={handleChange('modeOfBirth')} options={[
                  { label: 'Natural', value: 'natural' },
                  { label: 'Cesarean', value: 'cesarean' },
                ]} />
              </div>
              <div className="form-col">
                <DropInput label="Parity" value={form.parity} onChange={handleChange('parity')} options={[
                  { label: 'Single Child', value: 'single' },
                  { label: 'Twins', value: 'twins' },
                  { label: 'Triplets', value: 'triplets' },
                  { label: 'Other', value: 'other' },
                ]} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <Input label="Birth Weight (kg)" value={form.birthWeight} onChange={handleChange('birthWeight')} placeholder="Enter birth weight in kg" type="number" />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Parent Details</h3>
            <div className="form-row">
              <div className="form-col">
                <Input label="Father's Name" value={form.fatherName} onChange={handleChange('fatherName')} placeholder="Enter father's name" />
              </div>
              <div className="form-col">
                <Input label="Mother's Name" value={form.motherName} onChange={handleChange('motherName')} placeholder="Enter mother's name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <AddInput label="Parent Address" value={form.parentAddress} onChange={handleChange('parentAddress')} placeholder="Enter parent address" />
              </div>
              <div className="form-col">
                <AddInput label="Permanent Address" value={form.permanentAddress} onChange={handleChange('permanentAddress')} placeholder="Enter permanent address" />
              </div>
            </div>
          </div>
          <div className="form-row" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={handleRegisterBirth} className="btn-with-gradient" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : 'Register Birth'}
            </button>
          </div>
        </form>
        {showPopup && (
          <div>
            <Popup message={popupMessage} onClose={() => { setShowPopup(false); setShowDownload(false); navigate('/birth-records'); }} />
            {showDownload && lastRegistered && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="btn-with-gradient" onClick={handleDownloadCertificate}>Download Certificate</button>
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                  <div className="certificate-container" id="certificate-pdf-view">
                    <div className="certificate-header">
                      <div className="certificate-title">REGISTRATION DEPARTMENT</div>
                      <div className="certificate-subtitle">Govt. of Kerala</div>
                      <div style={{ fontWeight: 500, color: '#2d4a6a', marginTop: '0.2rem' }}>
                        (Export of Online Token Registration)
                      </div>
                    </div>
                    <table className="certificate-table">
                      <tbody>
                        <tr>
                          <th>Name of Child</th>
                          <td>{lastRegistered.firstName} {lastRegistered.middleName} {lastRegistered.lastName}</td>
                          <th>Date of Birth</th>
                          <td>{lastRegistered.dateOfBirth}</td>
                        </tr>
                        <tr>
                          <th>Gender</th>
                          <td>{lastRegistered.gender}</td>
                          <th>Place of Birth</th>
                          <td>{lastRegistered.placeOfBirth}</td>
                        </tr>
                        <tr>
                          <th>Father's Name</th>
                          <td>{lastRegistered.fatherName}</td>
                          <th>Mother's Name</th>
                          <td>{lastRegistered.motherName}</td>
                        </tr>
                        <tr>
                          <th>Parent Address</th>
                          <td colSpan={3}>{lastRegistered.parentAddress}</td>
                        </tr>
                        <tr>
                          <th>Permanent Address</th>
                          <td colSpan={3}>{lastRegistered.permanentAddress}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="certificate-footer">
                      <div>Generated on: {new Date().toLocaleDateString()}</div>
                      <div>Signature: ____________________</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </PageContainer>
      <Footer />
    </>
  );
};

export default BirthRegistration;

