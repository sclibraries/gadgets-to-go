// useFetchLayoutData.js

import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetchLayoutData(baseUrl, mapLocations) {
  const [layoutData, setLayoutData] = useState([]);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        // const response = await fetch(`${baseUrl}/label?location=${mapLocations}`);
        const response = await axios.get(`${baseUrl}/label?location=${mapLocations}`);
        const data = response.data;

        // If you have default layout data to merge, you can handle it here
        // For example:
        // const defaultLayoutData = [
        //   { name: 'libraryName', text: 'Default Library Name' },
        //   { name: 'headerText', text: 'Default Header Text' },
        //   // ...other default layout items
        // ];
        //
        // const mergedLayoutData = defaultLayoutData.map((defaultItem) => {
        //   const fetchedItem = data.find(item => item.name === defaultItem.name);
        //   return fetchedItem || defaultItem;
        // });
        //
        // setLayoutData(mergedLayoutData);

        // If you don't need to merge with defaults, simply set the fetched data
        setLayoutData(data);
      } catch (error) {
        console.error('Error fetching layout data:', error);
      }
    };
    fetchLayout();
  }, [baseUrl, mapLocations]);

  return [layoutData, setLayoutData];
}

export default useFetchLayoutData;
