// SimpleModal.tsx
import { ReactNode } from 'react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SimpleModal = ({ isOpen, onClose, children }: SimpleModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
        <div className='flex justify-center'>
          <button onClick={onClose} className="bg-red-500 text-white px-2 rounded-xl hover:bg-red-600 transition duration-300 ease-in-out transform">Close</button>
        </div> 
        {children}
      </div>
    </div>
  );
};

export default SimpleModal;
