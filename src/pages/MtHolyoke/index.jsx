import { useEffect, useState } from 'react';
import useMtHolyokeStore from '../../store/mtholyokeStore';
import ItemModal from '../../components/ItemModal';
import { useNavigate, useLocation } from 'react-router-dom';

function MtHolyoke() {
    const { layoutData, colorData, inventoryData, fetchLayoutData, fetchInventoryData } = useMtHolyokeStore();
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      fetchLayoutData();
      fetchInventoryData();
    }, [fetchLayoutData, fetchInventoryData]);
  
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const folio_id = params.get('folio_id');
      if (folio_id) {
        const item = inventoryData.find(item => item.folio_id === folio_id);
        if (item) {
          setSelectedItem(item);
        }
      }
    }, [location.search, inventoryData]);
  
    const getLayoutItem = (name) => layoutData.find(item => item.name === name)?.text || 'Default Text';
    const getColorItem = (type) => colorData.find(item => item.type === type)?.color_hash || '#000';
  
    const headerText = getLayoutItem('headerText');
    const footerText = getLayoutItem('footerText');
    const libraryName = getLayoutItem('libraryName');
  
    const titleColor = getColorItem('titleColor');
    const headerTextColor = getColorItem('headerTextColor');
    const descriptionColor = getColorItem('descriptionColor');
    const footerColor = getColorItem('footer');
    const footerBackgroundColor = getColorItem('footerBackgroundColor');
    const backgroundColor = getColorItem('backgroundColor');
  
    const toggleModal = () => {
      setSelectedItem(null);
      const params = new URLSearchParams(location.search);
      params.delete('folio_id');
      navigate({
        search: params.toString()
      });
    };
  
    const handleCardClick = (item) => {
      setSelectedItem(item);
      const params = new URLSearchParams(location.search);
      params.set('folio_id', item.folio_id);
      navigate({
        search: params.toString()
      });
    };
  
    return (
      <div className="page-container" style={{ backgroundColor }}>
        <div className="container-wrapper">
          <h1 className="display-2 text-center" style={{ color: headerTextColor }}>{headerText}</h1>
          <h3 className="display-3 text-center" >{libraryName}</h3>
          <div className="masonry-grid">
            {inventoryData.map(item => (
              <div className="masonry-grid-item" key={item.id} onClick={() => handleCardClick(item)}>
                <img
                  src={`https://libtools.smith.edu/development/gadgets_to_go/backend/web/inventory/get-image-data?id=${item.id}`}
                  alt={item.title}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ color: titleColor }}>{item.title}</h5>
                  <p className="card-text" style={{ color: descriptionColor }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: footerColor, backgroundColor: footerBackgroundColor }} dangerouslySetInnerHTML={{ __html: footerText }} />
        {selectedItem && (
          <ItemModal isOpen={!!selectedItem} toggle={toggleModal} item={selectedItem} />
        )}
      </div>
    );
  }
  
  export default MtHolyoke;