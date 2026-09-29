import React from "react";

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileOverlay: React.FC<MobileOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-30 bg-gray-950/40 md:hidden pt-16"
    />
  );
};
