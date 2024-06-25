import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Table
} from 'reactstrap';

const ItemModal = ({ isOpen, toggle, item }) => {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    if (item && item.folio_id) {
      fetch(`https://libtools.smith.edu/development/gadgets_to_go/backend/web/inventory/get-folio?id=${item.folio_id}`)
        .then(response => response.json())
        .then(data => setItemData(data.data))
        .catch(error => console.error('Error fetching item data:', error));
    }
  }, [item]);

  if (!itemData) {
    return null;
  }

  const { holding } = itemData;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Item Details</ModalHeader>
      <ModalBody>
        <Card>
          <div className="d-flex">
            <img
              src={`https://libtools.smith.edu/development/gadgets_to_go/backend/web/inventory/get-image-data?id=${item.id}`}
              alt={item.title}
              className="img-thumbnail"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <CardBody>
              <CardTitle tag="h5">{item.title}</CardTitle>
              <CardText>{item.description}</CardText>
              <CardText><strong>Location:</strong> {holding[0].location}</CardText>
              <CardText><strong>System ID:</strong> {item.folio_id}</CardText>
              <CardText><strong>Loan Type:</strong> {holding[0].permanentLoanType}</CardText>
            </CardBody>
          </div>
        </Card>
        <Table className="mt-3">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Location</th>
              <th>Loan Type</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {holding.map(record => (
              <tr key={record.id}>
                <td>{record.callNumber}</td>
                <td>{record.location}</td>
                <td>{record.permanentLoanType}</td>
                <td>{record.status}</td>
                <td>{record.dueDate ? new Date(record.dueDate).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

ItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    folio_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    permanentLoanType: PropTypes.string
  })
};

export default ItemModal;