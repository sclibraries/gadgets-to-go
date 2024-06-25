import create from 'zustand';

const useMtHolyokeStore = create((set) => ({
  layoutData: [],
  colorData: [],
  inventoryData: [],
  fetchLayoutData: async () => {
    try {
      const location = 'MHC';
      const layoutResponse = await fetch(`https://libtools.smith.edu/development/gadgets_to_go/backend/web/label/get-data?location=${location}`);
      const layoutJson = await layoutResponse.json();
      const colorResponse = await fetch(`https://libtools.smith.edu/development/gadgets_to_go/backend/web/styling/get-data?location=${location}`);
      const colorJson = await colorResponse.json();
      set({
        layoutData: layoutJson.data || [],
        colorData: colorJson.data || [],
      });
    } catch (error) {
      console.error('Error fetching Mt Holyoke layout data:', error);
    }
  },
  fetchInventoryData: async () => {
    try {
      const owner = 'MHC';
      const response = await fetch(`https://libtools.smith.edu/development/gadgets_to_go/backend/web/inventory/location-data?owner=${owner}`);
      const json = await response.json();
      set({
        inventoryData: json.data || [],
      });
    } catch (error) {
      console.error('Error fetching Mt Holyoke inventory data:', error);
    }
  },
}));

export default useMtHolyokeStore;