import React from 'react';
import deleteIcon from '../assets/delete.png';
import styles from '../styles/DeleteButton.module.css';

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onClick, 
  size = 16,
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.deleteButton} ${className}`}
      aria-label="Delete"
      style={{
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        display: 'inline',
        verticalAlign: 'middle',
      }}
    >
      <img
        src={deleteIcon}
        alt="Delete"
        style={{
          width: size,
          height: size,
          verticalAlign: 'middle',
          overflowClipMargin: 'content-box',
          overflow: 'clip',
          maxWidth: '100%',
          color: 'rgb(3, 139, 164)',
          boxSizing: 'border-box',
          fontFamily: 'Poppins',
          fontWeight: 300,
          fontSize: 14,
          lineHeight: '20px',
          borderBottomColor: 'rgb(3, 139, 164)',
          borderLeftColor: 'rgb(3, 139, 164)',
          borderRightColor: 'rgb(3, 139, 164)',
          borderTopColor: 'rgb(3, 139, 164)',
          margin: 0,
          padding: 0,
          display: 'inline',
        }}
      />
    </button>
  );
};

export default DeleteButton;