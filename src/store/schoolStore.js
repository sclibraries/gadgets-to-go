import { create } from 'zustand';

const baseUrl = 'https://libtools2.smith.edu/gadgets-to-go/backend/web/api';


const schoolCodeMapping = {
  amherst: 'AMH',
  hampshire: 'HMC',
  mtholyoke: 'MHC',
  smith: 'SMC',
  umass: 'UMA'
};

const schoolDefaults = {
  amh: {
    libraryName: 'Amherst College',
    headerText: 'Amherst Gadgets-to-Go',
    footerText: ''
  },
  hmc: {
    libraryName: 'Hampshire College',
    headerText: 'Hampshire Gadgets-to-Go',
    footerText: ''
  },
  mhc: {
    libraryName: 'Mount Holyoke College',
    headerText: 'Mount Holyoke Gadgets-to-Go',
    footerText: ''
  },
  smc: {
    libraryName: 'Smith College',
    headerText: 'Gadgets-To-Go',
    footerText: ''
  },
  uma: {
    libraryName: 'University of Massachusetts',
    headerText: 'UMass Gadgets-to-Go',
    footerText: ''
  },
};


const useSchoolStore = create((set) => ({
  layoutData: [],
  colorData: [],
  inventoryData: [],
  baseUrl,
  isLoading: false,
  fetchLayoutData: async (school) => {
    try {
      set({ isLoading: true }); // Set loading state to true
      const code = schoolCodeMapping[school];
      const layoutResponse = await fetch(`${baseUrl}/label?location=${code}`);
      const layoutJson = await layoutResponse.json();

      const schoolDefaultData = schoolDefaults[code.toLowerCase()];
      const defaultLayoutData = [
        { name: 'libraryName', text: schoolDefaultData.libraryName },
        { name: 'headerText', text: schoolDefaultData.headerText },
        { name: 'footerText', text: schoolDefaultData.footerText },
      ];

      const mergedLayoutData = defaultLayoutData.map((defaultItem) => {
        const fetchedItem = layoutJson.find(item => item.name === defaultItem.name);
        return fetchedItem || defaultItem;
      });

      const colorResponse = await fetch(`${baseUrl}/styling/get-data?location=${code}`);
      const colorJson = await colorResponse.json();

      set({
        layoutData: mergedLayoutData || [],
        colorData: colorJson || [],
        isLoading: false, // Set loading state to false when done
      });
    } catch (error) {
      console.error('Error fetching layout data:', error);
      set({ isLoading: false }); // Ensure loading state is reset on error
    }
  },
  fetchInventoryData: async (school) => {
    try {
      set({ isLoading: true });
      const code = schoolCodeMapping[school.toLowerCase()];
      const response = await fetch(`${baseUrl}/inventory/location-data?owner=${code}`);
      const json = await response.json();
      set({
        inventoryData: json || [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      set({ isLoading: false });
    }
  },
  setLocalStyles: (styles) => set({ localStyles: styles }),
  setLocalLayoutData: (layoutData) => set({ localLayoutData: layoutData }),
  setLocalInventoryData: (inventoryData) => set({ localInventoryData: inventoryData }),
}));

export default useSchoolStore;
