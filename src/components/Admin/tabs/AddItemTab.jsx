import { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

function AddItemTab({ baseUrl, mapLocations, token, onItemAdded }) {
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    folio_id: '',
    sort_order: '',
    image: null,
  });

  const handleNewItemChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewItem({
      ...newItem,
      image: e.target.files[0],
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newItem.title);
    formData.append('folio_id', newItem.folio_id);
    formData.append('description', newItem.description);
    formData.append('owner', mapLocations);
    formData.append('sort_order', newItem.sort_order);
    if (newItem.image) {
      formData.append(
        'file',
        newItem.image,
        `${newItem.folio_id}.${newItem.image.type.split('/')[1]}`
      );
    }

    try {
      await axios.post(`${baseUrl}/inventory/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Item added successfully!');
      setNewItem({
        title: '',
        folio_id: '',
        description: '',
        sort_order: '',
        image: null,
      });
      onItemAdded(); // Refresh inventory data
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  return (
    <>
      <h2 className="mb-4">Add New Item</h2>
      <Form onSubmit={handleAddItem}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={newItem.title}
                onChange={handleNewItemChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="folio_id">FOLIO ID</Label>
              <Input
                type="text"
                name="folio_id"
                id="folio_id"
                value={newItem.folio_id}
                onChange={handleNewItemChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                rows="3"
                value={newItem.description}
                onChange={handleNewItemChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="sort_order">Sort Order</Label>
              <Input
                type="number"
                name="sort_order"
                id="sort_order"
                value={newItem.sort_order}
                onChange={handleNewItemChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="file">Upload Image</Label>
              <Input
                type="file"
                name="file"
                id="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <Button color="primary" type="submit">
              Add Item
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddItemTab;

AddItemTab.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    mapLocations: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    onItemAdded: PropTypes.func.isRequired,
    };
    
