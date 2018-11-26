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
  addData?: (capturedImage: IImage, name: string, price: number, store?: string) => void;
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

const Context = createContext<IContext>(initstate); // Context 를 만듭니다.

const { Provider, Consumer: MaterialConsumer } = Context;

class MaterialProvider extends Component<{}, IContextValue> {
  // sprivate materials: Array<IMaterial>;
  // private static myInstance: MaterialManager;
  // public static getInstance() {
  //   return this.myInstance || (this.myInstance = new this());
  // }

  constructor(props: {}) {
    super(props);
    this.state = {materials: [], stores: {} };
  }

  pushStore = (name: string): string => {
    const { stores } = this.state;
    // if ( stores. ) {
    //   const id = ShortId.generate();
    //   this.setState({stores: [{id, name}]});
    //   return id;
    // } else {
    //   const idx = stores.findIndex((store) => store.name === name);
    //   if (idx === -1) {
    //     const id = ShortId.generate();
    //     const newStores = stores.slice();
    //     newStores.push({id, name});
    //     this.setState({stores: newStores});
    //     return id;
    //   } else {
    //     return stores[idx].id;
    //   }
    // }
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
        } else if ( success[1] === false) {
          this.setState({ materials: JSON.parse(value[0]), stores: {}});
        } else {
          this.setState({ materials: [], stores: {}});
          // setData([]);
        }
        complete();
      };
      retrieveDatas(['MaterialList', 'StoreMap'], callback);
    },
    saveDataToStorage: () => {
      const callback = (success: boolean) => {
        // if ( false !== success ) {
        console.log(success);

        // } else {
        //   setData( [] );
        // }
      };
      storeData('MaterialList', JSON.stringify(this.state.materials), callback);
      storeData('StoreMap', JSON.stringify(this.state.stores), callback);
    },
    addData: (capturedImage: IImage, name: string, price: number, store?: string) => {
      if (this.state.materials !== undefined) {
        const newMaterial = this.state.materials.slice();
        let storeId  = undefined;
        if ( store !== '') {
          storeId = this.pushStore(store);
        }
        newMaterial.push({ image: capturedImage, name, price, count: 0, storeId });
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
      storeData('MaterialList', '[]', callback);
      storeData('StoreMap', '{}', callback);
    },
  };
  render() {
    const { state, actions } = this;
    // Provider 내에서 사용할 값은, "value" 라고 부릅니다.
    // 현재 컴포넌트의 state 와 actions 객체를 넣은 객체를 만들어서,
    // Provider 의 value 값으로 사용하겠습니다.
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
  // return function useMaterialComponent(props: any) {
  //   return (
  //     <MaterialConsumer>
  //       {
  //         ({ state, actions }) => (
  //           <WrappedComponent
  //           {...state}
  //           {...actions}
  //             // materials={state.materials}
  //             // stores={state.stores}
  //             // loadDataFromStorage={actions.loadDataFromStorage}
  //             // saveDataToStorage={actions.saveDataToStorage}
  //             // addData={actions.addData}
  //             // editData={actions.editData}
  //             // changeCount={actions.changeCount}
  //             // deleteItem={actions.deleteItem}
  //             {...props}
  //           />
  //         )
  //       }
  //     </MaterialConsumer>
  //   );
  // };
// }

export {
  MaterialProvider,
  MaterialConsumer,
  useMaterial,
};
