import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

export const secureStore = {
  getItem: async (key: string) => {
    try {
      return await getItemAsync(key);
    } catch (error) {
      console.error('Error getting item from secure store: ', error);
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await setItemAsync(key, value);
    } catch (error) {
      console.error('Error setting item in secure store: ', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item from secure store: ', error);
    }
  },
};
