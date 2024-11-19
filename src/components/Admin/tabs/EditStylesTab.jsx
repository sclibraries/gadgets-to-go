import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
} from 'reactstrap';
import axios from 'axios';
//prop import
import PropTypes from 'prop-types';

function EditStylesTab({
  styles,
  handleStyleChange,
  handleResetStyles,
  baseUrl,
  mapLocations,
  token,
  layoutData,
  handleLayoutChange,
}) {
  const handleSaveStyles = async () => {
    const stylesArray = Object.keys(styles).map((key) => ({
      type: key,
      color_hash: styles[key],
      location: mapLocations,
    }));

    try {
      await axios.post(`${baseUrl}/styling/update-style`, stylesArray, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
      // await axios.post(`${baseUrl}/styling/update?token=${token}`, stylesArray);
      alert('Styles saved successfully!');
    } catch (error) {
      console.error('Error saving styles:', error);
      alert('Failed to save styles.');
    }
  };

  const handleSaveLayout = async () => {
    const layoutArray = layoutData.map((item) => ({
      name: item.name,
      text: item.text,
      location: mapLocations,
    }));

    try {
      await axios.put(`${baseUrl}/label/update`, layoutArray, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Layout data saved successfully!');
    } catch (error) {
      console.error('Error saving layout data:', error);
      alert('Failed to save layout data.');
    }
  };

  const handleSaveAll = async () => {
    await handleSaveStyles();
    await handleSaveLayout();
  };

  const getLayoutItem = (name) => layoutData.find((item) => item.name === name)?.text || '';


  return (
    <>
      <h2 className="mb-4">Edit Page Styles</h2>
      <Form>
        <Row>
        <Col md={12}>
            <FormGroup>
              <Label for="libraryName">Library Name</Label>
              <Input
                type="text"
                name="libraryName"
                id="libraryName"
                value={getLayoutItem('libraryName')}
                onChange={(e) => handleLayoutChange('libraryName', e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="headerText">Header Text</Label>
              <Input
                type="textarea"
                name="headerText"
                id="headerText"
                value={getLayoutItem('headerText')}
                onChange={(e) => handleLayoutChange('headerText', e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="footerText">Footer Text</Label>
              <Input
                type="textarea"
                name="footerText"
                id="footerText"
                value={getLayoutItem('footerText')}
                onChange={(e) => handleLayoutChange('footerText', e.target.value)}
              />
              <small className="form-text text-muted">
                You can enter plain text or HTML.
              </small>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="titleColor">Title Color</Label>
              <Input
                type="color"
                name="titleColor"
                id="titleColor"
                value={styles.titleColor}
                onChange={handleStyleChange}
              />
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="descriptionColor">Description Color</Label>
              <Input
                type="color"
                name="descriptionColor"
                id="descriptionColor"
                value={styles.descriptionColor}
                onChange={handleStyleChange}
              />
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="backgroundColor">Background Color</Label>
              <Input
                type="color"
                name="backgroundColor"
                id="backgroundColor"
                value={styles.backgroundColor}
                onChange={handleStyleChange}
              />
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="footer">Footer Text Color</Label>
              <Input
                type="color"
                name="footer"
                id="footer"
                value={styles.footer}
                onChange={handleStyleChange}
              />
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="footerBackgroundColor">Footer Background Color</Label>
              <Input
                type="color"
                name="footerBackgroundColor"
                id="footerBackgroundColor"
                value={styles.footerBackgroundColor}
                onChange={handleStyleChange}
              />
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="headerTextColor">Header Text Color</Label>
              <Input
                type="color"
                name="headerTextColor"
                id="headerTextColor"
                value={styles.headerTextColor}
                onChange={handleStyleChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <div className="mt-3">
        <Button color="primary" onClick={handleSaveAll} className="me-2">
          Save Changes
        </Button>
        <Button color="secondary" onClick={handleResetStyles}>
          Reset Styles
        </Button>
      </div>
    </>
  );
}

export default EditStylesTab;

EditStylesTab.propTypes = {
  styles: PropTypes.object.isRequired,
  handleStyleChange: PropTypes.func.isRequired,
  handleResetStyles: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
  mapLocations: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  layoutData: PropTypes.array.isRequired,
  handleLayoutChange: PropTypes.func.isRequired,
};
