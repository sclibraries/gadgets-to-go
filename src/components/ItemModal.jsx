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
  Table,
} from 'reactstrap';

const ItemModal = ({ isOpen, toggle, item }) => {
  const [itemData, setItemData] = useState(null);
  const baseUrl = 'https://libtools2.smith.edu/gadgets-to-go/backend/web/api';

  useEffect(() => {
    if (item && item.folio_id) {
      fetch(`${baseUrl}/inventory/get-folio?id=${item.folio_id}`)
        .then((response) => response.json())
        .then((data) => setItemData(data))
        .catch((error) => console.error('Error fetching item data:', error));
    }
  }, [item]);

  if (!itemData) {
    return null;
  }

  let { holding } = itemData;

  // Normalize holding to an array if it's not already one
  if (!Array.isArray(holding)) {
    holding = holding ? [holding] : [];
  }

  // Sort holdings so that 'Available' statuses come first
  holding.sort((a, b) => {
    const statusA = a.status.toLowerCase();
    const statusB = b.status.toLowerCase();

    if (statusA === 'available' && statusB !== 'available') {
      return -1;
    } else if (statusA !== 'available' && statusB === 'available') {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Item Details</ModalHeader>
      <ModalBody>
        <Card>
          <div className="d-flex">
            <img
              src={`${baseUrl}/inventory/get-image-data?id=${item.id}`}
              alt={item.title}
              className="img-thumbnail"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <CardBody>
              <CardTitle tag="h5">{item.title}</CardTitle>
              <CardText>{item.description}</CardText>
              {holding.length > 0 && (
                <>
                  <CardText>
                    <strong>Location:</strong> {holding[0].location}
                  </CardText>
                  <CardText>
                    <strong>System ID:</strong> {item.folio_id}
                  </CardText>
                  <CardText>
                    <strong>Loan Type:</strong> {holding[0].permanentLoanType}
                  </CardText>
                </>
              )}
            </CardBody>
          </div>
        </Card>
        {holding.length > 0 ? (
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
              {holding.map((record) => (
                <tr
                key={record.id}
                className={record.status.toLowerCase() !== 'available' ? 'table-danger' : ''}
              >
                  <td>{record.callNumber}</td>
                  <td>{record.location}</td>
                  <td>{record.permanentLoanType}</td>
                  <td>{record.status}</td>
                  <td>
                    {record.dueDate ? new Date(record.dueDate).toLocaleString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No holding data available.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
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
    permanentLoanType: PropTypes.string,
  }),
};

export default ItemModal;
