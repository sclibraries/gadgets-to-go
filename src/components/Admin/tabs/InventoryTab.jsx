import {
  Row, Col, Card, CardBody, CardTitle, CardText, Button, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter,Table
} from 'reactstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function InventoryTab({ inventoryData, styles, baseUrl, token, refreshInventory, setLocalInventoryData, mapLocations }) {
  const [editableItem, setEditableItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageSrcs, setImageSrcs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState({});


  // const [newItem, setNewItem] = useState({
  //   title: '',
  //   description: '',
  //   folio_id: '',
  //   sort_order: '',
  //   image: null,
  // });

  


  const apiUrl = import.meta.env.VITE_API_URL

  // List of image formats to try
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif'];

  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);


  // Function to check if image exists for each format
  const checkImageFormat = async (folioId) => {
    for (let format of imageFormats) {
      const imageUrl = `https://libtools2.smith.edu/gadgets-to-go/backend/images/${folioId}.${format}`;
      try {
        const response = await axios.get(imageUrl);
        if (response.status === 200) {
          return imageUrl; // Return the first valid image URL
        }
      } catch (error) {
        // If image doesn't exist, continue to next format
        continue;
      }
    }
    return null; // Return null if no image is found
  };

  // UseEffect to load images for each item in the inventory
  useEffect(() => {
    const loadImages = async () => {
      const srcs = {};
      for (let item of inventoryData) {
        const imageUrl = await checkImageFormat(item.folio_id);
        srcs[item.id] = imageUrl;
      }
      setImageSrcs(srcs);
    };
    loadImages();
  }, [inventoryData]);

  // Handle input change for text fields
  const handleInputChange = (e, item) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [item.id]: { ...prevFormData[item.id], [name]: value }
    }));
  };

  // Update the inventory item
  const handleUpdate = async (item) => {
    const updateData = formData[item.id] || {};
  
    try {
      const form = new FormData();
      form.append('title', updateData.title || item.title);
      form.append('description', updateData.description || item.description);
      form.append('sort_order', updateData.sort_order || item.sort_order);
      form.append('timestamp', updateData.timestamp || item.timestamp);
      form.append('folio_id', updateData.folio_id || item.folio_id);
      form.append('aleph_id', updateData.aleph_id || item.aleph_id);
      form.append('owner', updateData.owner || item.owner);
  
      if (imageFile && imageFile[item.id]) {
        form.append('image', imageFile[item.id]);
      }
  
      // Optimistically update the local state
      const updatedInventoryData = inventoryData.map((invItem) => {
        if (invItem.id === item.id) {
          return { ...invItem, ...updateData };
        }
        return invItem;
      });
      setLocalInventoryData(updatedInventoryData);
  
      // Send PUT request to update the inventory item
      await axios.post(`${apiUrl}/inventory/update/${item.id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Re-check the image format after updating
      const imageUrl = await checkImageFormat(item.folio_id);
      setImageSrcs((prevSrcs) => ({
        ...prevSrcs,
        [item.id]: imageUrl, // Update the local image source
      }));
  
      toast.success('Item updated successfully!');
      refreshInventory();
    } catch (error) {
      console.error('Failed to update item', error);
      const errorMessage = error.response?.data?.message || 'Failed to update item.';
      toast.error(errorMessage);
    }
  };
  
  

    // Toggle modal visibility
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // // Handle modal input change for new item
    // const handleNewItemChange = (e) => {
    //   setNewItem({
    //     ...newItem,
    //     [e.target.name]: e.target.value,
    //   });
    // };
  
    // // Handle image change for new item in modal
    // const handleNewImageChange = (e) => {
    //   setNewItem({
    //     ...newItem,
    //     image: e.target.files[0],
    //   });
    // };
  

  // Delete the inventory item
  const handleDelete = async (item) => {
    try {
      await axios.delete(`${apiUrl}/inventory/delete/${item.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { folio_id: item.folio_id } // Send folio_id to handle image deletion
      });
      toast.success('Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item', error);
      toast.error('Failed to delete item.');
    }
    refreshInventory();
  };

    // Add new item through the modal
    // const handleAddItem = async () => {
    //   const formData = new FormData();
    //   formData.append('title', newItem.title);
    //   formData.append('folio_id', newItem.folio_id);
    //   formData.append('description', newItem.description);
    //   formData.append('owner', 'MHC'); // Adjust accordingly
    //   formData.append('sort_order', newItem.sort_order);
  
    //   if (newItem.image) {
    //     formData.append(
    //       'file',
    //       newItem.image,
    //       `${newItem.folio_id}.${newItem.image.type.split('/')[1]}`
    //     );
    //   }

    //   // Optimistically add the new item to local state
    //   const newInventoryData = [...inventoryData, { ...newItem, id: Date.now() }]; // Temporary ID until confirmed
    //   setLocalInventoryData(newInventoryData);
  
    //   try {
    //     await axios.post(`${baseUrl}/inventory/create`, formData, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     });
    //     alert('Item added successfully!');
    //     refreshInventory(); // Refresh inventory data
    //     toggleModal(); // Close modal
    //   } catch (error) {
    //     console.error('Error adding new item:', error);
    //   }
    // };


      // Search types
  const searchTypes = {
    title: 'Title',
    hrid: 'HRID',
    location: 'Location',
  };

  // List of effective location options
  const effectiveLocations = [
    { id: 'aa06e792-9891-4654-9153-fffa611edb6d', name: 'AC Multimedia Services Equipment' },
    { id: '7f436e65-7948-4e18-acc0-aab3707aabea', name: 'AC Fayerweather Equipment' },
    { id: 'dcfef97d-3340-4f48-a1bc-ac25fad65c6f', name: 'HC Media Services Equipment' },
    { id: '57148fe4-7cf3-47fd-9a3e-0d95db4c1497', name: 'MH Circulation Equipment' },
    { id: '13b5a7d0-aaaa-479a-8843-6025b2799014', name: 'SC Neilson Equipment' },
    { id: '32319fdd-5390-489e-98e7-a4c7c07aa1ea', name: 'AC Frost Equipment' },
    { id: 'b241fe21-2931-42e0-bd09-57c63cfca7eb', name: 'HC Equipment - Check out at InfoBar' },
    { id: 'df19e8af-ed36-4fa4-920d-fe41a22e6aa2', name: 'SC Art Equipment' },
    { id: '2e199273-5bd2-4012-82a3-388bc97ca729', name: 'MH Pratt Circulation Equipment' },
    { id: 'b0f269e0-1aa3-405e-a246-8876381f43df', name: 'UM Science Equipment' },
  ];
  

  // Handle search query submission
  const handleSearch = async () => {
    let queryUrl = `https://libtools2.smith.edu/folio/web/search/search-inventory?query=`;
    if (searchType === 'title') {
      queryUrl += `(title all "${searchQuery}")`;
    } else if (searchType === 'hrid') {
      queryUrl += `hrid=${searchQuery}`;
    } else if (searchType === 'location') {
      queryUrl += `(items.effectiveLocationId=="${location}")`;
    }

    try {
      const response = await axios.get(queryUrl);
      const data = response.data.data.instances || [];
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching inventory:', error);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchType('title');
    setLocation('');
  };

  const handleSelectItem = (item) => {
    setSelectedItemsData((prevData) => ({
      ...prevData,
      [item.id]: {
        ...prevData[item.id],
        item: item,
        selected: !prevData[item.id]?.selected, // Toggle selection
        description: prevData[item.id]?.description || '',
        image: prevData[item.id]?.image || null,
      },
    }));
  };
  
  const handleDescriptionChange = (e, item) => {
    const { value } = e.target;
    setSelectedItemsData((prevData) => ({
      ...prevData,
      [item.id]: {
        ...prevData[item.id],
        description: value,
      },
    }));
  };
  
  const handleImageChange = (e, item) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile((prevImageFile) => ({
        ...prevImageFile,
        [item.id]: file, // Store the selected image file
      }));
    }
  };

  const handleBatchImageChange = (e, item) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedItemsData((prevData) => ({
        ...prevData,
        [item.id]: {
          ...prevData[item.id],
          image: file,
        },
      }));
    }
  };

  // Handle batch upload of selected items
  const handleBatchUpload = async () => {
    for (let data of Object.values(selectedItemsData)) {
      if (data.selected) {
        const { item, description, image } = data;

        const formData = new FormData();
        formData.append('title', item.title);
        formData.append('folio_id', item.id);
        formData.append('description', description || '');
        formData.append('owner', mapLocations); 
        formData.append('sort_order', 0); // Adjust as needed
  
        if (image) {
          formData.append('image', image); // Remove [item.id]
        }
  
        // Check if the item already exists
        const existingItem = inventoryData.find((inv) => inv.folio_id === item.id);
        if (!existingItem) {
          try {
            await axios.post(`${baseUrl}/inventory/create`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            toast.success(`Item "${item.title}" added successfully!`);
          } catch (error) {
            toast.error(`Error adding item: ${error.response?.data?.message || error.message}`);
            console.error('Error adding item:', error);
          }
        } else {
          toast.error(`Item with FOLIO ID ${item.id} already exists.`);
        }
      }
    }
    refreshInventory();
  };
  

  return (
    <>
      <h2 className="mb-4">Current Inventory</h2>
      <Button color="info" onClick={toggleSearchModal}>Add Equipment</Button> {/* Button to open search modal */}

      <Row>
        {inventoryData.map((item) => (
          <Col key={item.id} md={4} className="mb-4">
            <Card className="h-100" style={{ backgroundColor: styles.backgroundColor }}>
              <CardBody>
                {editableItem === item.id ? (
                  <>
                    <FormGroup>
                      <Label for="title">Title</Label>
                      <Input
                        name="title"
                        defaultValue={item.title}
                        onChange={(e) => handleInputChange(e, item)}
                        style={{ color: styles.titleColor }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        defaultValue={item.description}
                        onChange={(e) => handleInputChange(e, item)}
                        style={{ color: styles.descriptionColor }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="sort_order">Sort Order</Label>
                      <Input
                        name="sort_order"
                        type="number"
                        defaultValue={item.sort_order}
                        onChange={(e) => handleInputChange(e, item)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="timestamp">Timestamp</Label>
                      <Input
                        name="timestamp"
                        type="datetime-local"
                        defaultValue={item.timestamp}
                        onChange={(e) => handleInputChange(e, item)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="folio_id">Folio ID</Label>
                      <Input
                        name="folio_id"
                        defaultValue={item.folio_id}
                        onChange={(e) => handleInputChange(e, item)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="aleph_id">Aleph ID</Label>
                      <Input
                        name="aleph_id"
                        defaultValue={item.aleph_id}
                        onChange={(e) => handleInputChange(e, item)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="owner">Owner</Label>
                      <Input
                        type="select"
                        name="owner"
                        defaultValue={item.owner}
                        onChange={(e) => handleInputChange(e, item)}
                      >
                        <option value="MHC">Mount Holyoke</option>
                        <option value="SMC">Smith College</option>
                        <option value="AMH">Amherst College</option>
                        <option value="HMC">Hampshire College</option>
                        <option value="UMA">UMass Amherst</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="image">Change Image (2mb size limit)</Label>
                      <Input
                        type="file"
                        onChange={(e) => handleImageChange(e, item)}
                      />
                      {/* Show current image */}
                      {imageSrcs[item.id] && (
                        <img
                          src={imageSrcs[item.id]}
                          alt={item.title}
                          style={{ width: '100%', marginTop: '10px' }}
                        />
                      )}
                    </FormGroup>
                    <Button color="success" onClick={() => handleUpdate(item)}>Save</Button>
                    <Button color="secondary" onClick={() => setEditableItem(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <CardTitle tag="h5" style={{ color: styles.titleColor }}>
                      {item.title}
                    </CardTitle>
                    <CardText style={{ color: styles.descriptionColor }}>
                      {item.description}
                    </CardText>
                    {/* Show current image */}
                    {imageSrcs[item.id] && (
                      <img
                        src={imageSrcs[item.id]}
                        alt={item.title}
                        style={{ width: '100%', marginTop: '10px' }}
                      />
                    )}
                    <Button color="primary" onClick={() => setEditableItem(item.id)}>Edit</Button>
                    <Button color="danger" onClick={() => handleDelete(item)}>Delete</Button>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
       {/* Modal for adding new item */}
       <Modal isOpen={isSearchModalOpen} toggle={toggleSearchModal} size="xl">
      <ModalHeader toggle={toggleSearchModal}>Search and Add Inventory</ModalHeader>
      <ModalBody>
        <Row>
          <Col md={8}>
            <FormGroup>
              <Label for="search">Search</Label>
              <Input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter title or HRID..."
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="searchType">Search Type</Label>
              <Input
                type="select"
                name="searchType"
                id="searchType"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="hrid">HRID</option>
                <option value="location">Location</option>
              </Input>
            </FormGroup>
            {searchType === 'location' && (
              <FormGroup>
                <Label for="location">Location</Label>
                <Input
                  type="select"
                  name="location"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {effectiveLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            )}
          </Col>
        </Row>
        <Button color="primary" onClick={handleSearch}>Search</Button>{' '}
        <Button color="secondary" onClick={handleClear}>Clear</Button>

        {/* Display Search Results */}
        {searchResults.length > 0 && (
          <Table hover>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Title</th>
                  <th>HRID</th>
                  <th>FOLIO ID</th>
                  <th>Description</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Input
                        type="checkbox"
                        onChange={() => handleSelectItem(item)}
                        checked={!!selectedItemsData[item.id]?.selected}
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.hrid}</td>
                    <td>{item.id}</td>
                    <td>
                      <Input
                        type="textarea"
                        value={selectedItemsData[item.id]?.description || ''}
                        onChange={(e) => handleDescriptionChange(e, item)}
                        disabled={!selectedItemsData[item.id]?.selected}
                      />
                    </td>
                    <td>
                    <Input
                      type="file"
                      onChange={(e) => handleBatchImageChange(e, item)}
                      disabled={!selectedItemsData[item.id]?.selected}
                    />
                    </td>
                  </tr>
                ))}
              </tbody>
          </Table>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleBatchUpload}>Add Selected Items</Button>
        <Button color="secondary" onClick={toggleSearchModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
    </>
  );
}

export default InventoryTab;


InventoryTab.propTypes = {
  inventoryData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      sort_order: PropTypes.number,
      timestamp: PropTypes.string,
      folio_id: PropTypes.string.isRequired,
      aleph_id: PropTypes.string,
      owner: PropTypes.string,
    })
  ).isRequired,
  styles: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    titleColor: PropTypes.string.isRequired,
    descriptionColor: PropTypes.string.isRequired,
  }).isRequired,
  baseUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  refreshInventory: PropTypes.func.isRequired,
  setLocalInventoryData: PropTypes.func.isRequired,
};
