import React from 'react';
import { MaterialProvider, MaterialConsumer, useMaterial } from '../models/Material';

import renderer from 'react-test-renderer';
import { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('AutoCompelteInput Component', () => {
  // beforeEach( () => {
  // });
  // let value: string = '';
  // const handleChange = (original: string, reservedWord: string, selection?: ISelection) => {
  //   value = reservedWord;
  // };
  const material: ReactWrapper = mount(
    <MaterialProvider/>,
  );
  const instance: any = material.instance();

  beforeEach( () => {
    instance.setStroageNames({materials: 'testMaterail', stores: 'testStore'});
  });

  it ( 'add Test', () => {
    instance.actions.initialize();
    instance.actions.addData({ name: 'name0', image: {base64: '', width: 0, height: 0},  count: 0 }, 'store0');
    let state: any = material.state();
    expect( Object.keys(state.stores).length ).toBe(1);
    expect( state.materials.length ).toBe(1);
    expect( state.materials[0].name ).toBe('name0');
  });

  it ( 'delete Test', () => {
    instance.actions.addData({ name: 'name1', image: {base64: '', width: 0, height: 0},  count: 0 }, 'store1');
    let state: any = material.state();
    let length = state.materials.length;
    instance.actions.deleteItem( length - 1 );
    state = material.state();
    expect( state.materials.length ).toBe( length - 1 );
  });

  // it ( 'enzyme test' , () => {
  //   const wrapper: ReactWrapper = mount(
  //     <MaterialProvider>

  //     </MaterialProvider>
  //   );

  //   const testInput: any = wrapper.find('TextInput').first();
  //   // console.log('text input' , testInput);

  //   testInput.props().onChangeText('123');
  //   expect(value).toEqual('123');

  //   testInput.props().onChangeText('res');
  //   expect(value).toEqual('reserved');

  //   let state: any = wrapper.state();
  //   expect(state.selection).toEqual({start: 3, end: 8});
  // });

});
