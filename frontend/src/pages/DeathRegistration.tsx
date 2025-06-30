import React, { useState } from 'react';
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

const DeathRegistration: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    idProof: '',
    idProofOther: '',
    gender: '',
    permanentAddress: '',
    causeOfDeath: '',
    causeOfDeathOther: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<any>(null);
  const [printView, setPrintView] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handlePrint = () => {
    setPrintView(true);
    setTimeout(() => {
    window.print();
      setPrintView(false);
    }, 200);
  };

  const handleRegisterDeath = () => {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'idProof', 'gender', 'permanentAddress', 'causeOfDeath'];
    let isFormValid = requiredFields.every(field => (form as any)[field].trim() !== '');

    if (form.idProof === 'other' && form.idProofOther.trim() === '') {
      isFormValid = false;
    }
    if (form.causeOfDeath === 'other' && form.causeOfDeathOther.trim() === '') {
      isFormValid = false;
    }

    if (!isFormValid) {
      setPopupMessage('Please fill all required fields before registering.');
      setShowPopup(true);
      setShowDownload(false);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPopupMessage('Death registered successfully!');
      setShowPopup(true);
      setShowDownload(true);
      setLastRegistered({ ...form });
    }, 1500);
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
        pdf.save(`${lastRegistered.firstName || 'Death'}_Certificate.pdf`);
      }
    }, 100);
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Death Registration" subtitle="Register a new death and generate certificate" />
        <form className="death-registration-form">
          <div className="form-section">
            <h3>Deceased Details</h3>
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
            </div>
            <div className="form-row">
              <div className="form-col">
                <DropInput label="ID Proof" value={form.idProof} onChange={handleChange('idProof')} options={[
                  { label: 'Aadhaar', value: 'aadhaar' },
                  { label: 'Pan Card', value: 'pan' },
                  { label: 'Driving Licence', value: 'driving' },
                  { label: 'Other', value: 'other' },
                ]} />
              </div>
              {form.idProof === 'other' && (
                <div className="form-col">
                  <Input label="Specify Other ID Proof" value={form.idProofOther} onChange={handleChange('idProofOther')} placeholder="Enter other ID proof" />
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="form-col">
                <DropInput label="Gender" value={form.gender} onChange={handleChange('gender')} options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <AddInput label="Permanent Address" value={form.permanentAddress} onChange={handleChange('permanentAddress')} placeholder="Enter permanent address" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <DropInput label="Cause of Death" value={form.causeOfDeath} onChange={handleChange('causeOfDeath')} options={[
                  { label: 'Natural', value: 'natural' },
                  { label: 'Accident', value: 'accident' },
                  { label: 'Suicide', value: 'suicide' },
                  { label: 'Pending Investigation', value: 'pending' },
                  { label: 'Other', value: 'other' },
                ]} />
              </div>
              {form.causeOfDeath === 'other' && (
                <div className="form-col">
                  <Input label="Specify Other Cause" value={form.causeOfDeathOther} onChange={handleChange('causeOfDeathOther')} placeholder="Enter other cause" />
                </div>
              )}
            </div>
          </div>
          <div className="form-row" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={handleRegisterDeath} className="btn-with-gradient" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : 'Register Death'}
            </button>
          </div>
        </form>
        {showPopup && (
          <div>
            <Popup message={popupMessage} onClose={() => { setShowPopup(false); setShowDownload(false); }} />
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
                          <th>Name of Deceased</th>
                          <td>{lastRegistered.firstName} {lastRegistered.middleName} {lastRegistered.lastName}</td>
                          <th>Date of Death</th>
                          <td>{lastRegistered.dateOfBirth}</td>
                        </tr>
                        <tr>
                          <th>Gender</th>
                          <td>{lastRegistered.gender}</td>
                          <th>Permanent Address</th>
                          <td>{lastRegistered.permanentAddress}</td>
                        </tr>
                        <tr>
                          <th>Cause of Death</th>
                          <td colSpan={3}>{lastRegistered.causeOfDeath === 'other' ? lastRegistered.causeOfDeathOther : lastRegistered.causeOfDeath}</td>
                        </tr>
                        <tr>
                          <th>ID Proof</th>
                          <td colSpan={3}>{lastRegistered.idProof === 'other' ? lastRegistered.idProofOther : lastRegistered.idProof}</td>
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
        {printView && (
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
                    <th>Name of Deceased</th>
                    <td>{form.firstName} {form.middleName} {form.lastName}</td>
                    <th>Date of Death</th>
                    <td>{form.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>{form.gender}</td>
                    <th>Permanent Address</th>
                    <td>{form.permanentAddress}</td>
                  </tr>
                  <tr>
                    <th>Cause of Death</th>
                    <td colSpan={3}>{form.causeOfDeath === 'other' ? form.causeOfDeathOther : form.causeOfDeath}</td>
                  </tr>
                  <tr>
                    <th>ID Proof</th>
                    <td colSpan={3}>{form.idProof === 'other' ? form.idProofOther : form.idProof}</td>
                  </tr>
                </tbody>
              </table>
              <div className="certificate-footer">
                <div>Generated on: {new Date().toLocaleDateString()}</div>
                <div>Signature: ____________________</div>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
      <Footer />
    </>
  );
};

export default DeathRegistration;
