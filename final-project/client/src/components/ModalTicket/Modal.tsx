import './Modal.css';

type propType = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const Modal: React.FC<propType> = ({ open, onClose, children }) => {
  return (
    <div
      className='modal'
      style={{
        transition: 'background-color 0.3s,opacity 0.3s',
        backgroundColor: open ? ' rgba(0, 0, 0, 0.5)' : 'transparent',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        className='modal-container'
        style={{
          transform: open ? 'scale(1)' : 'scale(1,1)',
          opacity: open ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
        }}
      >
        <button className='x-btn' onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
