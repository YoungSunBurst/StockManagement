import { IMaterial, IImage, IStore } from './Types';
import { retrieveData, storeData } from '../utils/AsyncStorage';
import React from 'react';
import { Component, createContext } from 'react';

interface IContextValue {
  materials: Array<IMaterial>;
  stores: Array<IStore>;
}

interface IContextAction {
  loadDataFromStorage?: ((complete: () => void) => void);
  saveDataToStorage?: (() => void);
  addData?: (capturedImage: IImage, name: string, price: number) => void;
  editData?: (idx: number, material: IMaterial) => void;
  changeCount?: (idx: number, count: number) => void;
  deleteItem?: (idx: number) => void;
}

interface IContext {
  state: IContextValue;
  actions: IContextAction;
}

const initstate: IContext = {
  state: {materials: [], stores: []},
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
    this.state = {materials: [], stores: [] };
  }

  actions = {
    // loadDataFromStorage: (setData: (data: Array<IMaterial>) => void) => {
    loadDataFromStorage: ( complete: () => void) => {
      const callback = (success: boolean, value?: string) => {
        if (false !== success && value !== undefined) {
          this.setState({ materials: JSON.parse(value)});
          // this.materials = JSON.parse(value);
          // setData(this.materials);
        } else {
          this.setState({ materials: []});
          // setData([]);
        }
        complete();
      };
      retrieveData('MaterialList', callback);
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
    },
    addData: (capturedImage: IImage, name: string, price: number) => {
      const newMaterial = this.state.materials.slice();
      newMaterial.push({image: capturedImage, name: name, price: price, count: 0});
      this.setState({materials: newMaterial});
    },
    editData : (idx: number, material: IMaterial) => {
      const newMaterial = this.state.materials.slice();
      newMaterial[idx] = material;
      this.setState({materials: newMaterial});
    },
    deleteItem: (idx: number) => {
      const newMaterial = this.state.materials.slice();
      newMaterial.splice(idx, 1);
      this.setState({materials: newMaterial});
    },
    changeCount: (idx: number, count: number) => {
      const newMaterial = this.state.materials.slice();
      newMaterial[idx].count = count;
      this.setState({materials: newMaterial});
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
      storeData('StoreList', '[]', callback);
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

function useMaterial(WrappedComponent: any) {
  return function useMaterialFunc(props: any) {
    return (
      <MaterialConsumer>
        {
          ({ state, actions }) => (
            <WrappedComponent
              materials={state.materials}
              stores={state.stores}
              loadDataFromStorage={actions.loadDataFromStorage}
              saveDataToStorage={actions.saveDataToStorage}
              addData={actions.addData}
              editData={actions.editData}
              changeCount={actions.changeCount}
              deleteItem={actions.deleteItem}
              {...props}
            />
          )
        }
      </MaterialConsumer>
    );
  };
}

export {
  MaterialProvider,
  MaterialConsumer,
  useMaterial,
};
