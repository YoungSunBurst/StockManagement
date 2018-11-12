export interface IImage {
  base64: string;
  width: number;
  height: number;
}

export interface IStore {
  id: number;
  name: string;
  location?: string;
  businessCard?: IImage;
  receiptList: Array<IImage>;
}

export interface IMaterial {
  name: string;
  image: IImage;
  count: number;
  price?: number;
  storeId?: number;
}