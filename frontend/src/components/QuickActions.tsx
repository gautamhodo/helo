import React, { useState } from "react";
import { FileText, ScrollText, Users, Award } from "lucide-react";
import "../styles/QuickActions.css";
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onQuickAction?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const [showRecordTypeDialog, setShowRecordTypeDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
    switch(action) {
      case 'birth-registration':
        navigate('/birth-registration');
        break;
      case 'death-registration':
        navigate('/death-registration');
        break;
      case 'certificates':
        navigate('/certificates');
        break;
      case 'birth-records':
        navigate('/birth-records');
        break;
      case 'death-records':
        navigate('/death-records');
        break;
      default:
        break;
    }
  };

  const handleDialogClose = () => {
    setShowRecordTypeDialog(false);
  };

  const handleViewRecords = () => {
    setShowRecordTypeDialog(true);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Quick Actions</h5>
      </div>
      <div className="card-body">
        <div className="quick-actions-grid">
          <button 
            onClick={() => handleQuickAction("birth-registration")}
            className="quick-action-button birth-registration"
          >
            <FileText className="quick-action-icon" />
            <span className="quick-action-text">New Birth Registration</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction("death-registration")}
            className="quick-action-button death-registration"
          >
            <ScrollText className="quick-action-icon" />
            <span className="quick-action-text">New Death Registration</span>
          </button>
          
          <button 
            onClick={handleViewRecords}
            className="quick-action-button"
          >
            <Users className="quick-action-icon" />
            <span className="quick-action-text">View Records</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction("certificates")}
            className="quick-action-button accent"
          >
            <Award className="quick-action-icon" />
            <span className="quick-action-text">Generate Certificate</span>
          </button>
        </div>

        {/* Modal for Record Type Selection */}
        {showRecordTypeDialog && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content quick-action-dialog-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Record Type</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleDialogClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted">
                    Choose which type of records you want to view
                  </p>
                  <div className="quick-action-dialog-grid">
                    <button
                      onClick={() => {
                        handleDialogClose();
                        handleQuickAction("birth-records");
                      }}
                      className="quick-action-dialog-button"
                    >
                      <FileText className="quick-action-dialog-icon" />
                      <span>Birth Records</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDialogClose();
                        handleQuickAction("death-records");
                      }}
                      className="quick-action-dialog-button"
                    >
                      <ScrollText className="quick-action-dialog-icon" />
                      <span>Death Records</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" onClick={handleDialogClose}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;