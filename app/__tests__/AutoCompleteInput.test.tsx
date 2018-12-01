import React from 'react';
import AutoCompleteInput, { ISelection } from '../component/AutoCompleteInput';

import renderer from 'react-test-renderer';
import { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TextInput } from 'react-native';

describe('AutoCompelteInput Component', () => {
  let value: string = '';
  const handleChange = (original: string, reservedWord: string, selection?: ISelection) => {
    value = reservedWord;
  };
  it('snapshot test', () => {
    const tree = renderer.create(<AutoCompleteInput reservedWordList={[]} value={value} onChangeText={handleChange}/>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it ( 'enzyme test' , () => {
    const wrapper: ReactWrapper = mount(
      <AutoCompleteInput reservedWordList={['reserved']} value={value} onChangeText={handleChange} />,
    );

    const testInput: any = wrapper.find('TextInput').first();
    // console.log('text input' , testInput);

    testInput.props().onChangeText('123');
    expect(value).toEqual('123');

    testInput.props().onChangeText('res');
    expect(value).toEqual('reserved');

    let state: any = wrapper.state();
    expect(state.selection).toEqual({start: 3, end: 8});
  });

});
