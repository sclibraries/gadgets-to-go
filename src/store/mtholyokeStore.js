import { create } from 'zustand';
const baseUrl = 'https://libtools2.smith.edu/gadgets-to-go/backend/web/api';
const useMtHolyokeStore = create((set) => ({
  layoutData: [],
  colorData: [],
  inventoryData: [],
  fetchLayoutData: async () => {
    try {
      const location = 'MHC';
      const layoutResponse = await fetch(`${baseUrl}/label/get-data?location=${location}`);
      const layoutJson = await layoutResponse.json();
      const colorResponse = await fetch(`${baseUrl}/styling/get-data?location=${location}`);
      const colorJson = await colorResponse.json();
      set({
        layoutData: layoutJson|| [],
        colorData: colorJson || [],
      });
    } catch (error) {
      console.error('Error fetching Mt Holyoke layout data:', error);
    }
  },
  fetchInventoryData: async () => {
    try {
      const owner = 'MHC';
      console.log('owner', owner);
      const response = await fetch(`${baseUrl}/inventory/location-data?owner=${owner}`);
      const json = await response.json();
      set({
        inventoryData: json || [],
      });
    } catch (error) {
      console.error('Error fetching Mt Holyoke inventory data:', error);
    }
  },
}));

export default useMtHolyokeStore;