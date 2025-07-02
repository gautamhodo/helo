import React, { useState, useEffect } from 'react';
import '../styles/page.css';
import '../styles/Certificate.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import { Printer } from 'lucide-react';
import Searchbar from '../components/Searchbar';

interface PageProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const Certificates: React.FC<PageProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [type, setType] = useState<'birth' | 'death'>('birth');
  const [printCert, setPrintCert] = useState<any>(null);
  const [birthCertificates, setBirthCertificates] = useState<any[]>([]);
  const [deathCertificates, setDeathCertificates] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const handlePrint = (cert: any) => {
    setPrintCert(cert);
    setTimeout(() => {
      window.print();
      setPrintCert(null);
    }, 200);
  };

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        setBirthCertificates(data.birthRecords || []);
        setDeathCertificates(data.deathRecords || []);
      });
  }, []);

  const filteredBirthCertificates = birthCertificates.filter(cert =>
    Object.values(cert).join(' ').toLowerCase().includes(search.toLowerCase())
  );
  const filteredDeathCertificates = deathCertificates.filter(cert =>
    Object.values(cert).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Certificates" subtitle="View and manage all certificates" />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', gap: '1rem', alignItems: 'center' }}>
          <Searchbar value={search} onChange={e => setSearch(e.target.value)} />
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
              {filteredBirthCertificates.map((cert) => (
                <li key={cert.tokenNo} className="certificate-list-item">
                  <div>
                    <strong>{cert.name}</strong> (Token: {cert.tokenNo})<br />
                    DOB: {cert.dateOfBirth} | Father: {cert.fatherName} | Mother: {cert.motherName}
                  </div>
                  <div className="certificate-list-actions">
                    <button title="Print" onClick={() => handlePrint(cert)}><Printer size={20} /></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="certificate-list">
              {filteredDeathCertificates.map((cert) => (
                <li key={cert.tokenNo} className="certificate-list-item">
                  <div>
                    <strong>{cert.name}</strong> (Token: {cert.tokenNo})<br />
                    DOD: {cert.dateOfDeath} | Cause: {cert.causeOfDeath}
                  </div>
                  <div className="certificate-list-actions">
                    <button title="Print" onClick={() => handlePrint(cert)}><Printer size={20} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {printCert && (
          <div className="print-certificate-only">
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
                    <td>{printCert.tokenNo}</td>
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
                        <td>{printCert.name}</td>
                        <th>Father's Name</th>
                        <td>{printCert.fatherName}</td>
                      </tr>
                      <tr>
                        <th>Mother's Name</th>
                        <td>{printCert.motherName}</td>
                        <th>Date of Birth</th>
                        <td>{printCert.dateOfBirth}</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <th>Name of Deceased</th>
                        <td>{printCert.name}</td>
                        <th>Date of Death</th>
                        <td>{printCert.dateOfDeath}</td>
                      </tr>
                      <tr>
                        <th>Cause of Death</th>
                        <td>{printCert.causeOfDeath}</td>
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
        )}
      </PageContainer>
      <Footer />
    </>
  );
};

export default Certificates;
