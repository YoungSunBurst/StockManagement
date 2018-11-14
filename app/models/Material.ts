import { IMaterial } from "./Types";
import { retrieveData, storeData } from "../utils/AsyncStorage";

class MaterialManager {
  private materials: Array<IMaterial>;
  private static myInstance: MaterialManager;
  
  public static getInstance() {
    return this.myInstance || (this.myInstance = new this());
  }

  constructor() {
    this.materials = [];
  }

  /**
   * 
   */
  public loadDataFromStorage = ( setData: ( data: Array<IMaterial>) => void ) => {
    const callback = (success: boolean, value?: string) => {
      if ( false !== success && value !== undefined) {
        this.materials = JSON.parse(value);
        setData( this.materials );
      } else {
        setData( [] );
      }
    };
    retrieveData('MaterialList', callback);
  }

  public saveDataFromStorage = () => {
    const callback = (success: boolean) => {
      // if ( false !== success ) {
        console.log( success);

      // } else {
      //   setData( [] );
      // }
    };
    storeData('MaterialList', JSON.stringify(this.materials), callback );
  }

}

