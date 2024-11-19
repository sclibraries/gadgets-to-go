// useFetchInventory.js
import { useState, useEffect } from 'react';
import axios from 'axios';
function useFetchInventory(baseUrl, mapLocations, refreshTrigger) {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const time = new Date().getTime();
        const response = await axios.get(`${baseUrl}/inventory/location-data?owner=${mapLocations}&time=${time}`);
        setInventoryData(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory data', error);
      }
    };
    fetchInventoryData();
  }, [baseUrl, mapLocations, refreshTrigger]);

  return [inventoryData];
}

export default useFetchInventory;
