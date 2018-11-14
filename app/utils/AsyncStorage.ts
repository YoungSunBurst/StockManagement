import { AsyncStorage } from "react-native"

export const storeData = async (key: string, data: string, callback: (success: boolean) => any) => {
  try {
    await AsyncStorage.setItem(key, data);
    callback(true);
  } catch (error) {
    callback(false);
    // Error saving data
  }
}

export const retrieveData = async (key: string, callback: (success: boolean, value?: string) => any) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      console.log(value); 
      callback(true, value);
    } else {
      callback(false);
    }
   } catch (error) {
     callback(false);
     // Error retrieving data
   }
}