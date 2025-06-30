import React, { useState } from 'react';
import '../styles/page.css';
import '../styles/Certificate.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import { Eye, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PageProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const mockBirthCertificates = [
  {
    tokenNo: 'BR-2024-001',
    name: 'John Doe',
    dateOfBirth: '2024-01-15',
    fatherName: 'Richard Doe',
    motherName: 'Jane Doe',
  },
  {
    tokenNo: 'BR-2024-002',
    name: 'Alice Smith',
    dateOfBirth: '2024-02-10',
    fatherName: 'Robert Smith',
    motherName: 'Mary Smith',
  },
];

const mockDeathCertificates = [
  {
    tokenNo: 'DR-2024-001',
    name: 'Jane Smith',
    dateOfDeath: '2024-03-10',
    causeOfDeath: 'Natural Causes',
  },
  {
    tokenNo: 'DR-2024-002',
    name: 'Michael Brown',
    dateOfDeath: '2024-04-05',
    causeOfDeath: 'Accident',
  },
];

const Certificates: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [type, setType] = useState<'birth' | 'death'>('birth');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  const handleView = (cert: any) => {
    setSelectedCert(cert);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCert(null);
  };

  const handleDownload = async (cert: any) => {
    setSelectedCert(cert);
    setTimeout(async () => {
      const input = document.getElementById('certificate-pdf-view');
      if (input) {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${cert.tokenNo}.pdf`);
      }
    }, 100);
    setTimeout(() => {
      setSelectedCert(null);
    }, 500);
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Certificates" subtitle="View and manage all certificates" />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <button
            className={`btn-with-gradient${type === 'birth' ? '' : ' outline'}`}
            style={{ marginRight: '1rem' }}
            onClick={() => setType('birth')}
          >
            Birth Certificate
          </button>
          <button
            className={`btn-with-gradient${type === 'death' ? '' : ' outline'}`}
            onClick={() => setType('death')}
          >
            Death Certificate
          </button>
        </div>
        <div className="certificate-list-container">
          {type === 'birth' ? (
            <ul className="certificate-list">
              {mockBirthCertificates.map((cert) => (
                <li key={cert.tokenNo} className="certificate-list-item">
                  <div>
                    <strong>{cert.name}</strong> (Token: {cert.tokenNo})<br />
                    DOB: {cert.dateOfBirth} | Father: {cert.fatherName} | Mother: {cert.motherName}
                  </div>
                  <div className="certificate-list-actions">
                    <button title="View" onClick={() => handleView(cert)}><Eye size={20} /></button>
                    <button title="Download" onClick={() => handleDownload(cert)}><Download size={20} /></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="certificate-list">
              {mockDeathCertificates.map((cert) => (
                <li key={cert.tokenNo} className="certificate-list-item">
                  <div>
                    <strong>{cert.name}</strong> (Token: {cert.tokenNo})<br />
                    DOD: {cert.dateOfDeath} | Cause: {cert.causeOfDeath}
                  </div>
                  <div className="certificate-list-actions">
                    <button title="View" onClick={() => handleView(cert)}><Eye size={20} /></button>
                    <button title="Download" onClick={() => handleDownload(cert)}><Download size={20} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {modalOpen && selectedCert && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex={-1}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
                      <th>Token No.</th>
                      <td>{selectedCert.tokenNo}</td>
                      <th>Year</th>
                      <td>2024</td>
                    </tr>
                    <tr>
                      <th>Sub Register Office</th>
                      <td>Chalakudy</td>
                      <th>Place</th>
                      <td>Chalakudy</td>
                    </tr>
                  </tbody>
                </table>
                <div className="certificate-section-title">Personal Details</div>
                <table className="certificate-table">
                  <tbody>
                    {type === 'birth' ? (
                      <>
                        <tr>
                          <th>Name of Child</th>
                          <td>{selectedCert.name}</td>
                          <th>Father's Name</th>
                          <td>{selectedCert.fatherName}</td>
                        </tr>
                        <tr>
                          <th>Mother's Name</th>
                          <td>{selectedCert.motherName}</td>
                          <th>Date of Birth</th>
                          <td>{selectedCert.dateOfBirth}</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <th>Name of Deceased</th>
                          <td>{selectedCert.name}</td>
                          <th>Date of Death</th>
                          <td>{selectedCert.dateOfDeath}</td>
                        </tr>
                        <tr>
                          <th>Cause of Death</th>
                          <td>{selectedCert.causeOfDeath}</td>
                          <th>Place of Death</th>
                          <td>Chalakudy</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <div className="certificate-footer">
                  <div>Generated on: {new Date().toLocaleDateString()}</div>
                  <div>Signature: ____________________</div>
                </div>
              </div>
            </div>
            <button onClick={handleCloseModal} style={{ position: 'fixed', top: 30, right: 30, zIndex: 1001, background: '#fff', border: '1px solid #ccc', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer' }}>×</button>
          </div>
        )}
      </PageContainer>
      <Footer />
    </>
  );
};

export default Certificates;
