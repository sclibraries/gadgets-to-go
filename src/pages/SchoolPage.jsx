// SchoolPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import useSchoolStore from '../store/schoolStore';
import ItemModal from '../components/ItemModal.jsx';
import LoginButton from '../components/StaffLogin.jsx';
import Skeleton from 'react-loading-skeleton'; // If you're using a skeleton loading package
import 'react-loading-skeleton/dist/skeleton.css'; // Optional styles
import PropTypes from 'prop-types';
function SchoolPage({ isPreview = false, customStyles = {}, customInventoryData = [] }) {
  const {
    layoutData,
    colorData,
    inventoryData,
    fetchLayoutData,
    fetchInventoryData,
    isLoading,
    baseUrl,
  } = useSchoolStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [availability, setAvailability] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { school } = useParams();

  // Fetch data only if not in preview mode
  useEffect(() => {
    if (!isPreview) {
      fetchLayoutData(school);
      fetchInventoryData(school);
    }
  }, [fetchLayoutData, fetchInventoryData, school, isPreview]);

  // Determine the effective data based on isPreview
  const effectiveInventoryData = isPreview ? customInventoryData : inventoryData;
  const effectiveColorData = isPreview ? customStyles.colorData : colorData;
  const effectiveLayoutData = isPreview ? customStyles.layoutData : layoutData;


  // Adjust getLayoutItem and getColorItem to use effective data
  const getLayoutItem = (name) =>
    effectiveLayoutData.find((item) => item.name === name)?.text || '';
  const getColorItem = (type) =>
    effectiveColorData.find((item) => item.type === type)?.color_hash || '';

  // Now, adjust the variables that use getLayoutItem and getColorItem
  const headerText = getLayoutItem('headerText');
  const footerText = getLayoutItem('footerText');
  const libraryName = getLayoutItem('libraryName');

  const backgroundColor = isLoading ? '#f0f0f0' : getColorItem('backgroundColor');
  const headerTextColor = isLoading ? '#ccc' : getColorItem('headerTextColor');
  const titleColor = isLoading ? '#ddd' : getColorItem('titleColor');
  const descriptionColor = isLoading ? '#ddd' : getColorItem('descriptionColor');
  const footerBackgroundColor = isLoading ? '#ddd' : getColorItem('footerBackgroundColor');

  // Adjust useEffect that handles URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const folio_id = params.get('folio_id');
    if (folio_id) {
      const item = effectiveInventoryData.find((item) => item.folio_id === folio_id);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [location.search, effectiveInventoryData]);

  const toggleModal = () => {
    setSelectedItem(null);
    if (!isPreview) {
      const params = new URLSearchParams(location.search);
      params.delete('folio_id');
      navigate({
        search: params.toString(),
      });
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    if (!isPreview) {
      const params = new URLSearchParams(location.search);
      params.set('folio_id', item.folio_id);
      navigate({
        search: params.toString(),
      });
    }
  };

  const fetchItemAvailability = async (item) => {
    try {
      const response = await fetch(`${baseUrl}/inventory/get-folio?id=${item.folio_id}`);
      const data = await response.json();
      let { holding } = data;

      if (!Array.isArray(holding)) {
        holding = holding ? [holding] : [];
      }

      const availableCount = holding.filter((h) => h.status === 'Available').length;
      setAvailability((prev) => ({
        ...prev,
        [item.folio_id]: {
          available: availableCount,
          total: holding.length,
        },
      }));
    } catch (error) {
      console.error('Error fetching item availability:', error);
    }
  };

  // Fetch availability data for effective inventory
  useEffect(() => {
    effectiveInventoryData.forEach((item) => fetchItemAvailability(item));
  }, [effectiveInventoryData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInventoryData = effectiveInventoryData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="page-container" style={{ backgroundColor }}>
        <div className="container-wrapper">
          {isLoading && !isPreview ? (
            <>
              <Skeleton height={50} width="50%" />
              <Skeleton height={30} width="70%" />
              <div className="masonry-grid">
                {[...Array(6)].map((_, index) => (
                  <div className="masonry-grid-item mb-3" key={index}>
                    <Skeleton height={150} width="100%" />
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={20} width="50%" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1
                className="display-2 text-center"
                style={{ color: headerTextColor }}
                dangerouslySetInnerHTML={{ __html: libraryName }}
              ></h1>
              <h3
                className="display-3 text-center"
                style={{ color: headerTextColor }}
                dangerouslySetInnerHTML={{ __html: headerText }}
              ></h3>
              <div className="search-box text-center">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>
              <br />
              <div className="masonry-grid">
                {filteredInventoryData.map((item) => (
                  <div className="masonry-grid-item mb-3" key={item.id}>
                    <img
                      src={`${baseUrl}/inventory/get-image-data?id=${item.id}`}
                      alt={item.title}
                    />
                    <div className="card-body mb-3" style={{ padding: '5px' }}>
                      <h5 className="card-title" style={{ color: titleColor }}>
                        {item.title}
                      </h5>
                      <p className="card-text" style={{ color: descriptionColor }}>
                        {item.description}
                      </p>
                      <hr />
                      {availability[item.folio_id] && (
                        <p className="card-text">
                          There{' '}
                          {availability[item.folio_id].available <= 1 ? 'is' : 'are'} currently{' '}
                          {availability[item.folio_id].available} of{' '}
                          {availability[item.folio_id].total}{' '}
                          {item.title.replace('.', '')} available
                        </p>
                      )}
                      <button className="btn btn-primary" onClick={() => handleCardClick(item)}>
                        View items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {selectedItem && (
          <ItemModal isOpen={!!selectedItem} toggle={toggleModal} item={selectedItem} />
        )}
      </div>
      <div className="footer" style={{ backgroundColor: footerBackgroundColor }}>
        <div dangerouslySetInnerHTML={{ __html: footerText }} />
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <LoginButton />
        </div>
      </div>
    </>
  );
}

export default SchoolPage;

SchoolPage.propTypes = {
  isPreview: PropTypes.bool,
  customStyles: PropTypes.shape({
    colorData: PropTypes.array.isRequired,
    layoutData: PropTypes.array.isRequired,
  }),
  customInventoryData: PropTypes.array,
};
