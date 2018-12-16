import { IMaterial, IImage, IStore, IStores } from './Types';
import { retrieveData, storeData, retrieveDatas } from '../utils/AsyncStorage';
import React from 'react';
import { Component, createContext } from 'react';
import ShortId from 'shortid';

interface IContextValue {
  materials?: Array<IMaterial>;
  stores?: IStores;
}

interface IContextAction {
  loadDataFromStorage?: ((complete: () => void) => void);
  saveDataToStorage?: (() => void);
  addData?: (material: IMaterial, store?: string) => void;
  editData?: (idx: number, material: IMaterial) => void;
  changeCount?: (idx: number, count: number) => void;
  deleteItem?: (idx: number) => void;
}

interface IContext {
  state: IContextValue;
  actions: IContextAction;
}

const initstate: IContext = {
  state: {materials: [], stores: {}},
  actions: {},
};

interface IStorageNames {
    materials: string;
    stores: string;
}

const Context = createContext<IContext>(initstate); // Context 를 만듭니다.

const { Provider, Consumer: MaterialConsumer } = Context;

class MaterialProvider extends Component<{}, IContextValue> {
  private stroageNames: IStorageNames;

  constructor(props: {}) {
    super(props);
    this.state = {materials: [], stores: {} };
    this.stroageNames = { materials: 'MaterialList', stores: 'StoreMap' };
  }

  setStroageNames = ( names: IStorageNames ) => {
    this.stroageNames = {...names};
  }

  pushStore = (name: string): string => {
    const { stores } = this.state;
    const idx = Object.keys(stores).findIndex( (key, index ) => {
      return stores[key].name === name;
    });
    if (idx !== -1 ) {
      return Object.keys(stores)[idx];
    } else {
      const id = ShortId.generate();
      // stores[id] = {name};
      this.setState({ stores: {...stores, [id]: {name}}});
      return id;
    }
  }

  actions = {
    // loadDataFromStorage: (setData: (data: Array<IMaterial>) => void) => {
    loadDataFromStorage: ( complete: () => void) => {
      const callback = (success: Array<boolean>, value?: Array<string>) => {
        if (-1 === success.indexOf(false) && value !== undefined) {
          this.setState({ materials: JSON.parse(value[0]), stores:  JSON.parse(value[1])});
          // this.materials = JSON.parse(value);
          // setData(this.materials);
        } else if ( success[0] === false && success[1] === false) {
          this.setState({ materials: JSON.parse(value[0]), stores: {}});
        } else {
          this.setState({ materials: [], stores: {}});
          // setData([]);
        }
        complete();
      };
      retrieveDatas([this.stroageNames.materials, this.stroageNames.stores], callback);
    },
    saveDataToStorage: () => {
      const callback = (dataName: string, success: boolean) => {
        console.log(dataName, success);
      };
      storeData(this.stroageNames.materials, JSON.stringify(this.state.materials)).then( (success) => callback('MaterialList', success) );
      storeData(this.stroageNames.stores, JSON.stringify(this.state.stores)).then( (success) => callback('StoreMap', success) );
    },
    addData: (material: IMaterial, store?: string) => {
      if (this.state.materials !== undefined) {
        const newMaterial = this.state.materials.slice();
        let storeId  = undefined;
        if ( store !== '') {
          storeId = this.pushStore(store);
        }
        newMaterial.push({ ...material, count: 0, storeId });
        this.setState({ materials: newMaterial });
        this.actions.saveDataToStorage();
      }
    },
    editData: (idx: number, material: IMaterial, store?: string) => {
      if (this.state.materials !== undefined) {
        const newMaterial = this.state.materials.slice();
        let storeId  = undefined;
        if ( store !== '') {
          storeId = this.pushStore(store);
        }
        material.storeId = storeId;
        newMaterial[idx] = material;
        this.setState({ materials: newMaterial });
        this.actions.saveDataToStorage();
      }
    },
    deleteItem: (idx: number) => {
      if (this.state.materials !== undefined) {
        const newMaterial = this.state.materials.slice();
        newMaterial.splice(idx, 1);
        this.setState({ materials: newMaterial });
        this.actions.saveDataToStorage();
      }
    },
    changeCount: (idx: number, count: number) => {
      if (this.state.materials !== undefined) {
        const newMaterial = this.state.materials.slice();
        newMaterial[idx].count = count;
        this.setState({ materials: newMaterial });
        this.actions.saveDataToStorage();
      }
    },
    initialize: ()  => {
      this.setState({materials: []});
      let successCount: number = 0;
      let isSuccess: boolean = true;
      const callback = (success: boolean) => {
        console.log('initialize' + success);
        successCount++;
        isSuccess = success && isSuccess;
        if ( successCount > 1 ) {
          alert('initialize' + (false !== isSuccess) ? 'success' : 'fail');
        }
      };
      storeData(this.stroageNames.materials, '[]').then( (success) => callback(success));
      storeData(this.stroageNames.stores, '{}').then((success) => callback(success));
    },
  };
  render() {
    const { state, actions } = this;
    const value = { state, actions };
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    );
  }
}

interface IWrappedProps extends IContextValue, IContextAction {
}

function useMaterial<T extends IWrappedProps, U>(WrappedComponent: React.ComponentType<T>) {
  return class extends React.Component<T> {
    render() {
      return (
        <MaterialConsumer>
          {
            ({ state, actions }) => (
              <WrappedComponent {...state} {...actions} {...this.props} />
            )
          }
        </MaterialConsumer>
      );
    }
  };
}

export {
  MaterialProvider,
  MaterialConsumer,
  useMaterial,
};
