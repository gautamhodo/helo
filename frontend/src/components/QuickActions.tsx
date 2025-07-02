import React, { useState } from "react";
import { FileText, ScrollText, Users, Award } from "lucide-react";
import "../styles/QuickActions.css";
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onQuickAction?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const navigate = useNavigate();
  const [showRecordTypeDialog, setShowRecordTypeDialog] = useState<boolean>(false);

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
      case 'view-records':
        navigate('/view-records');
        break;
      default:
        break;
    }
  };

  const handleDialogClose = () => {
    setShowRecordTypeDialog(false);
  };

  return (
    <div className="quick-actions-card">
      <div className="quick-actions-header">
        <span className="quick-actions-title">Quick Actions</span>
        <span className="quick-actions-subtitle">Common Birth and Death Registration Tasks</span>
      </div>
      <div className="quick-actions-grid">
        <button 
          onClick={() => handleQuickAction("birth-registration")}
          className="quick-action-btn"
        >
          <FileText className="quick-action-btn-icon" />
          <span className="quick-action-btn-text">New Birth Registration</span>
        </button>
        <button 
          onClick={() => handleQuickAction("death-registration")}
          className="quick-action-btn"
        >
          <ScrollText className="quick-action-btn-icon" />
          <span className="quick-action-btn-text">New Death Registration</span>
        </button>
        <button 
          onClick={() => setShowRecordTypeDialog(true)}
          className="quick-action-btn"
        >
          <Users className="quick-action-btn-icon" />
          <span className="quick-action-btn-text">View Records</span>
        </button>
        <button 
          onClick={() => handleQuickAction("certificates")}
          className="quick-action-btn"
        >
          <Award className="quick-action-btn-icon" />
          <span className="quick-action-btn-text">Certificates</span>
        </button>
      </div>
      {showRecordTypeDialog && (
        <div className="quick-action-modal-overlay">
          <div className="quick-action-modal">
            <button
              onClick={handleDialogClose}
              className="quick-action-modal-close"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="quick-action-modal-title">Select Record Type</h3>
            <div className="quick-action-modal-options">
              <button
                onClick={() => {
                  handleDialogClose();
                  navigate('/birth-records');
                }}
                className="quick-action-modal-option"
              >
                <FileText className="quick-action-modal-icon" /> Birth Records
              </button>
              <button
                onClick={() => {
                  handleDialogClose();
                  navigate('/death-records');
                }}
                className="quick-action-modal-option"
              >
                <ScrollText className="quick-action-modal-icon" /> Death Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;