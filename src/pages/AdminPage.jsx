// AdminPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';
import useSchoolStore from '../store/schoolStore';
import Header from '../components/Admin/Header';
import '../AdminPage.css'; // Import custom CSS for additional styling

import useFetchInventory from '../hooks/useFetchInventory';
import useFetchStyles from '../hooks/useFetchStyles';
import useFetchLayoutData from '../hooks/useFetchLayoutData';
import InventoryTab from '../components/Admin/tabs/InventoryTab';
import AddItemTab from '../components/Admin/tabs/AddItemTab';
import EditStylesTab from '../components/Admin/tabs/EditStylesTab';
import SchoolPage from './SchoolPage';
import SaveChangesButton from '../components/Admin/SaveChangesButton'; // If you have a save button component
import useTokenValidation from '../hooks/useTokenValidation';

function AdminPage() {
  const { baseUrl } = useSchoolStore();
  const { isTokenExpired } = useTokenValidation();
  const locationAbbreviations = {
    amherst: 'AMH',
    hampshire: 'HMC',
    mtholyoke: 'MHC',
    smith: 'SMC',
    umass: 'UMA',
  };
  const { location } = useParams();
  const token = localStorage.getItem('authToken');
  const mapLocations = locationAbbreviations[location];

  const [activeTab, setActiveTab] = useState('inventory');

  const [originalStyles, setOriginalStyles] = useState({});
  const [originalLayoutData, setOriginalLayoutData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [localStyles, setLocalStyles] = useState({
    titleColor: '#000000',
    headerTextColor: '#000000',
    descriptionColor: '#333333',
    footer: '#f0f0f0',
    footerBackgroundColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  });



  const [localInventoryData, setLocalInventoryData] = useState([]);
  const [localLayoutData, setLocalLayoutData] = useState([
    { name: 'libraryName', text: '' },
    { name: 'headerText', text: '' },
    { name: 'footerText', text: '' },
  ]);

  // Fetch inventory, styles, and layout data using custom hooks
  const [inventoryData] = useFetchInventory(baseUrl, mapLocations, refreshTrigger);
  const [styles] = useFetchStyles(baseUrl, mapLocations, {});
  const [layoutData] = useFetchLayoutData(baseUrl, mapLocations);

    useEffect(() => {
    const token = localStorage.getItem('authToken');
        if (isTokenExpired(token)) {
        // Optionally, handle any UI updates here
        console.log('Token has expired, logging out...');
        }
  }, [isTokenExpired]);

  // Initialize local styles and inventory data with fetched data
  useEffect(() => {
    if (styles && Object.keys(styles).length > 0) {
      setLocalStyles(styles);
      setOriginalStyles(styles);
    }
  }, [styles]);

  useEffect(() => {
    if (layoutData && layoutData.length > 0) {
      setLocalLayoutData(layoutData);
      setOriginalLayoutData(layoutData);
    }
  }, [layoutData]);

  useEffect(() => {
    console.log('inventoryData changed:', inventoryData);

    if (inventoryData) {
      setLocalInventoryData(inventoryData);
    }
  }, [inventoryData]);

  useEffect(() => {
    if (layoutData.length > 0) {
      setLocalLayoutData(layoutData);
    }
  }, [layoutData]);

  // Handle style changes
  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setLocalStyles((prevStyles) => ({
      ...prevStyles,
      [name]: value,
    }));
  };

    // Handle layout data changes
    const handleLayoutChange = (name, value) => {
        setLocalLayoutData((prevLayoutData) =>
          prevLayoutData.map((item) =>
            item.name === name ? { ...item, text: value } : item
          )
        );
      };
    
      // Reset styles and layout data
      const handleResetStyles = () => {
        setLocalStyles(originalStyles);
        setLocalLayoutData(originalLayoutData);
      };


  // Function to refresh inventory data after adding a new item
  const refreshInventory = () => {
    setRefreshTrigger((prev) => prev + 1);
  };


  const localStylesArray = Object.keys(localStyles).map((key) => ({
    type: key,
    color_hash: localStyles[key],
  }));

  return (
    <div>
      <Header />
      <div className="d-flex">
        {/* Sidebar Navigation */}
        <Nav vertical pills className="bg-light p-3 sidebar">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'inventory' })}
              onClick={() => setActiveTab('inventory')}
              href="#"
            >
              Inventory
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'styles' })}
              onClick={() => setActiveTab('styles')}
              href="#"
            >
              Edit Styles
            </NavLink>
          </NavItem>
        </Nav>

        {/* Main Content */}
        <div className="flex-grow-1 content">
          <Container className="mt-4">
            {activeTab === 'inventory' && (
              <InventoryTab
                inventoryData={localInventoryData}
                styles={localStyles}
                baseUrl={baseUrl}
                token={token}
                refreshInventory={refreshInventory}
                setLocalInventoryData={setLocalInventoryData}
              />
            )}

            {activeTab === 'add-item' && (
              <AddItemTab
                baseUrl={baseUrl}
                mapLocations={mapLocations}
                token={token}
                onItemAdded={refreshInventory}
                setLocalInventoryData={setLocalInventoryData}
                localInventoryData={localInventoryData}
              />
            )}

            {activeTab === 'styles' && (
            <>    
            <EditStylesTab
                styles={localStyles}
                handleStyleChange={handleStyleChange}
                handleResetStyles={handleResetStyles}
                baseUrl={baseUrl}
                mapLocations={mapLocations}
                token={token}
                layoutData={localLayoutData}
                handleLayoutChange={handleLayoutChange}
            />
                          {/* Live Preview */}
            <h2 className="mb-4">Live Preview</h2>
            <div className="live-preview">
            <SchoolPage
                    isPreview={true}
                    customStyles={{ colorData: localStylesArray, layoutData: localLayoutData }}
                    customInventoryData={localInventoryData}
                />
            </div>

            {/* Save Changes Button */}
            <div className="mt-3">
              <SaveChangesButton
                localStyles={localStyles}
                baseUrl={baseUrl}
                token={token}
                mapLocations={mapLocations}
                localInventoryData={localInventoryData}
              />
            </div>
            </>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
