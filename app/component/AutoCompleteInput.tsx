import React from 'react';
import { Component } from 'react';
import { TextInput, StyleProp, TextStyle, NativeSyntheticEvent, TextInputSelectionChangeEventData, TextInputChangeEventData, TextInputKeyPressEventData } from 'react-native';

interface IProps {
  reservedWordList: Array<string>;
  style: StyleProp<TextStyle>;
  onChangeText: (text: string, reservedWord: string, selection?: ISelection) => void;
  placeholder: string;
  value: string;
  selection?: ISelection;
}

export interface ISelection {
  start: number;
  end: number;
}

interface IState {
  // value: string;
  selection?: ISelection;
}

export default class AutoCompleteInput extends Component<IProps, IState> {
  private inputRef:  React.RefObject<TextInput>;
  private enableAutoCompletion: boolean;

  constructor(props: IProps) {
    super(props);
    this.state = { selection: {start: 0, end: 0}};
    this.inputRef = React.createRef<TextInput>();
    this.enableAutoCompletion = true;
  }

  handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if ( e.nativeEvent.key === 'Backspace' && this.props.value !== '') {
      this.enableAutoCompletion = false;
    }
  }

  handleChangeText = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const { value, reservedWordList } = this.props;
    // const { selection } = this.state;

    const text = e.nativeEvent.text;

    if (text.length > 0 && false !== this.enableAutoCompletion) {
      for (let reservedWord of reservedWordList) {
        if (text.length === reservedWord.length) {
          this.setState({ selection: { start: text.length, end: text.length } });
          this.props.onChangeText(text, text);
          return;
        } else if (text.length < reservedWord.length) {
          let find = true;
          for (let i = 0; i < text.length; i++) {
            if (text[i] !== reservedWord[i]) {
              find = false;
              break;
            }
          }
          if (find === true) {
            let selection = { start: text.length, end: reservedWord.length };

            this.props.onChangeText(text, reservedWord, selection);
            // setTimeout(() => {
            // console.log(selection);

            this.setState({ selection });
            // this.inputRef.current.focus();

            // }, 1500);
            // this.inputRef.current.setNativeProps({ selection: { start: reservedWord.length , end: text.length  }});
            return;
          }
        }
      }
    }
    this.enableAutoCompletion = true;
    this.setState({ selection: {start: text.length, end: text.length}});
    this.props.onChangeText(text, text);
  }

  // handleSelectionChanged = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
  //   this.setState({selection: e.nativeEvent.selection});
  //   // console.log('handleSelectionChanged' + JSON.stringify(e.nativeEvent.selection));
  //   // this.inputRef.current.focus();
  // }

  // componentDidUpdate() {
  //   this.inputRef.current.
  // }

  render() {
    const { style, placeholder, value  } = this.props;
    const { selection } = this.state;
    const { handleChangeText, handleKeyPress } = this;
    console.log('render' + JSON.stringify(selection));

    return (
      <TextInput
        ref={this.inputRef}
        autoCapitalize={'none'}
        style={[style, {flex: 2}]}
        placeholder={placeholder}
        onChange={handleChangeText}
        value={value}
        selection={selection}
        multiline={true}
        onKeyPress={handleKeyPress}
        // onSelectionChange={handleSelectionChanged}
      />);
  }
}
