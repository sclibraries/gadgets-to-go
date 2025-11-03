
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const LoginButton = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen);

  const handleLogin = () => {
    // Redirect the user to the authorize.php script for Shibboleth login
    window.location.href = 'https://libtools2.smith.edu/gadgets-to-go/backend/admin/authorize.php';
  };

  const handleLoginClick = () => {
    // Show info modal first
    setIsInfoModalOpen(true);
  };

  const proceedToLogin = () => {
    setIsInfoModalOpen(false);
    handleLogin();
  };

  return (
    <>
      <button onClick={handleLoginClick} className="btn btn-primary">
        Admin Login
      </button>

      {/* Information Modal */}
      <Modal isOpen={isInfoModalOpen} toggle={toggleInfoModal}>
        <ModalHeader toggle={toggleInfoModal}>Access Information</ModalHeader>
        <ModalBody>
          <p>
            <strong>Important:</strong> Only approved library staff have access to manage Gadgets to Go. 
            Please check with your library's Access Service department before trying to log in.
          </p>
          <p>
            If you are authorized library staff, click "Proceed to Login" to continue. 
            Otherwise, please contact your library's Access Services department for assistance.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={proceedToLogin}>
            Proceed to Login
          </Button>
          <Button color="secondary" onClick={toggleInfoModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LoginButton;
