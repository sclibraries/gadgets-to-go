import { useState, useEffect } from 'react';

function useFetchStyles(baseUrl, mapLocations, initialStyles) {
  const [styles, setStyles] = useState(initialStyles);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/styling/get-data?location=${mapLocations}`
        );
        const data = await response.json();

        const fetchedStyles = {};
        data.forEach((item) => {
          fetchedStyles[item.type] = item.color_hash;
        });

        setStyles((prevStyles) => ({
          ...prevStyles,
          ...fetchedStyles,
        }));
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    };
    fetchStyles();
  }, [baseUrl, mapLocations]);


  return [styles, setStyles];
}

export default useFetchStyles;
