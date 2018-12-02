import { AsyncStorage } from 'react-native';

export const storeData = async (key: string, data: string): Promise<boolean>  => {
  await AsyncStorage.setItem(key, data);
  try {
    return true;
  } catch (error) {
    return false;
    // Error saving data
  }  // return new Promise((resolve, reject) => {
  //   try {
  //     return true;
  //   } catch (error) {
  //     return false;
  //     // Error saving data
  //   }
  // });
};

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
};

export const retrieveDatas = async (keys: Array<string>, callback: (success: Array<boolean>, value?: Array<string>) => any) => {
  try {
    let values: Array<string> = [];
    let success: Array<boolean> = [];
    for ( let key of keys) {
      const value = await AsyncStorage.getItem(key);
      values.push(value);
      success.push( values[values.length - 1] !== null);
    }
    callback(success, values);
    // if (values.indexOf(null) === -1) {
    //   // We have data!!
    //   // console.log(value);
    //   callback(true, values);
    // } else {
    //   callback(false);
    // }
   } catch (error) {
     // callback(false);
     // Error retrieving data
   }
};