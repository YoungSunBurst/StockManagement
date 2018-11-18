import { IMaterial, IImage } from "./Types";
import { retrieveData, storeData } from "../utils/AsyncStorage";
import React from 'react';
import { Component, createContext } from 'react';

interface IContextValue {
  materials: Array<IMaterial>
}

interface IContextAction {
  loadDataFromStorage?: ((complete: () => void) => void);
  saveDataToStorage?: (() => void);
  addData?: (capturedImage: IImage, name: string, price: number) => void;
  changeCount?: (idx: number, count: number) => void;
}

interface IContext {
  state: IContextValue;
  actions: IContextAction;
}

const initstate: IContext = {
  state: {materials: []},
  actions: {}
}

const Context = createContext<IContext>(initstate); // Context 를 만듭니다.

const { Provider, Consumer: MaterialConsumer } = Context; 

class MaterialProvider extends Component<{}, IContextValue> {
  // sprivate materials: Array<IMaterial>;
  // private static myInstance: MaterialManager;
  // public static getInstance() {
  //   return this.myInstance || (this.myInstance = new this());
  // }

  constructor(props: {}) {
    super(props)
    this.state = {materials: [] };
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
    changeCount: (idx: number, count: number) => {
      const newMaterial = this.state.materials.slice();
      newMaterial[idx].count = count;
      this.setState({materials: newMaterial});
    },
    initialize: ()  => {
      this.setState({materials: []});
      const callback = (success: boolean) => {
        console.log('initialize' + success);
        alert('initialize' + (false !== success) ? 'success' : 'fail');
      };
      storeData('MaterialList', '[]', callback);
    }
  }
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
    )
  }
}

function useMaterial(WrappedComponent: any) {
  return function useMaterial(props: any) {
    return (
      <MaterialConsumer>
        {
          ({ state, actions }) => (
            <WrappedComponent
              materials={state.materials}
              loadDataFromStorage={actions.loadDataFromStorage}
              saveDataToStorage={actions.saveDataToStorage}
              addData={actions.addData}
              changeCount={actions.changeCount}
              {...props}
            />
          )
        }
      </MaterialConsumer>
    )
  }
}

export {
  MaterialProvider,
  MaterialConsumer,
  useMaterial
};
