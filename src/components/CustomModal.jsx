import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const CustomModal = ({
  isOpen,
  toggle,
  title,
  bodyContent,
  footerButtons,
  size = 'md', // Default size, can be customized to 'lg' or 'sm'
}) => (
  <Modal isOpen={isOpen} toggle={toggle} size={size}>
    <ModalHeader toggle={toggle}>{title}</ModalHeader>
    <ModalBody>{bodyContent}</ModalBody>
    <ModalFooter>
      {footerButtons.map((button, index) => (
        <Button key={index} color={button.color} onClick={button.onClick}>
          {button.label}
        </Button>
      ))}
    </ModalFooter>
  </Modal>
);

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  bodyContent: PropTypes.node.isRequired, // Node to allow any JSX content
  footerButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  size: PropTypes.string, // 'lg', 'md', 'sm'
};

export default CustomModal;
