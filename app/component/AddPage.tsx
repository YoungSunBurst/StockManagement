import React from 'react';
import { Component } from 'react';
import { Animated, KeyboardAvoidingView, StyleSheet, View, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Dimensions, GestureResponderEvent, Image, Text, TextInput, Button, Alert, ScrollView, SafeAreaView } from 'react-native';
import Camera from './Camera';
import { IImage, IMaterial, IStore, IStores } from '../models/Types';
import { useMaterial } from '../models/Material';
import AutoCompleteInput from './AutoCompleteInput';

enum EnumPageState {
  main,
  camera,
}

// interface IProps extends IMaterial {
interface IProps {
  cancel: () => void;
  isEdited: boolean;
  editMaterial?: IMaterial;
  idx: number;
  // storeId?: string;
  stores?: IStores;
  addData?: (material: IMaterial, store?: string) => void;
  editData?: (idx: number, material: IMaterial, store?: string) => void;
}

interface IState {
  pageState: EnumPageState;
  capturedImage: IImage | undefined;
  name: string;
  price: number;
  prevName: string;
  store: string;
  description: string;
  mainPopupPosition: Animated.Value;
}

class AddPage extends Component<IProps, IState> {
  public static ADDPAGE_ANIMATEDTIME = 250;
  public static ADDPAGE_VERTICALMARGIN = 0;
  public static IMAGE_SIZE = Dimensions.get('window').width - 50;

  constructor(props: IProps) {
    super(props);
    this.state = {
      pageState: EnumPageState.main,
      capturedImage: undefined,
      name: '',
      price: 0,
      prevName: '',
      store: '',
      description: '',
      mainPopupPosition: new Animated.Value(Dimensions.get('window').height),
    };
  }

  static getDerivedStateFromProps(props: IProps, state: IState): Partial<IState> {
    if (props.isEdited && props.editMaterial.name !== state.prevName) {
      console.log(props.stores.hasOwnProperty(props.editMaterial.storeId));
      return {
        prevName: props.editMaterial.name,
        name: props.editMaterial.name,
        capturedImage: props.editMaterial.image,
        price: undefined !== props.editMaterial.price ? props.editMaterial.price : 0,
        store: props.stores.hasOwnProperty(props.editMaterial.storeId) === true ? props.stores[props.editMaterial.storeId].name : '',
      };
    }
    return null;
  }

  componentDidMount() {
    Animated.timing(
      this.state.mainPopupPosition,
      {
        toValue: AddPage.ADDPAGE_VERTICALMARGIN,
        duration: AddPage.ADDPAGE_ANIMATEDTIME,
      },
    ).start();
  }

  handleCameraButton = () => {
    this.setState({ pageState: EnumPageState.camera });
  }

  handleCameraCaptrue = (imageUri: string, width: number, height: number) => {
    this.setState({ pageState: EnumPageState.main, capturedImage: { base64: 'data:image/png;base64,' + imageUri, width: 200, height: 200 } });
  }

  handlePriceInput = (text: string) => {
    let newText = text.replace(/[^0-9]/g, '');
    if (newText === '') {
      if (this.state.price === 0) {
        this.forceUpdate();
      } else {
        this.setState({ price: 0 });
      }
    } else {
      this.setState({
        price: parseInt(newText, 10),
      });
    }
  }

  handleApply = () => {
    const { capturedImage, name, price, store } = this.state;
    if (undefined !== capturedImage && '' !== name) {
      if (false !== this.props.isEdited) {
        this.props.editData(this.props.idx, { image: capturedImage, name, price, count: this.props.editMaterial.count }, store);
      } else {
        this.props.addData({image: capturedImage, name, price, count: 0}, store);
      }
    } else {
      alert('need Image & name');
    }
  }

  onClose = () => {
    Animated.timing(
      this.state.mainPopupPosition,
      {
        toValue: Dimensions.get('window').height,
        duration: AddPage.ADDPAGE_ANIMATEDTIME,
      },
    ).start(() => { this.props.cancel(); });
  }

  handleCancel = () => {
    if ((false === this.props.isEdited && (this.state.capturedImage !== undefined || this.state.name !== '')) ||
      false !== this.props.isEdited && (this.state.capturedImage !== this.props.editMaterial.image || this.state.name !== this.props.editMaterial.name ||
        this.state.price !== this.props.editMaterial.price || this.state.description !== this.props.editMaterial.description)) {
      Alert.alert(
        'Are you sure you want to quit?',
        'Your changes will not be saved',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => this.onClose() },
        ],
        { cancelable: false },
      );
    } else {
      this.onClose();
    }
  }

  handleKeyboardHide = () => {
    Keyboard.dismiss();
  }

  render() {
    if (this.state.pageState === EnumPageState.main) {
      const bEnbleApply = this.state.name !== '' && this.state.capturedImage !== undefined;
      return (
        <KeyboardAvoidingView style={styles.avoidkeyWrapper} behavior="padding" enabled={true}>
          <Animated.View style={[styles.animateWrapper, { top: this.state.mainPopupPosition }]}>
            <ScrollView style={styles.scrollViewWrapper}>
              <View style={styles.titleBar}>
                <TouchableOpacity style={styles.backToMain} onPress={this.handleCancel} >
                  <Image source={require('../img/Close_btn.png')} style={{ width: 12, height: 13 }} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.static}>{this.state.name !== '' ? 'Name' : ''}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={(name) => this.setState({ name })}
                  value={this.state.name}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.static}>{this.state.price !== 0 ? 'Price' : ''}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  keyboardType="numeric"
                  onChangeText={(price) => this.handlePriceInput(price)}
                  value={this.state.price !== 0 ? this.state.price.toString() : ''}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.static}>{this.state.store !== '' ? 'store' : ''}</Text>
                <AutoCompleteInput
                  style={styles.input}
                  placeholder="store"
                  onChangeText={(original, value) => this.setState({ store: value })}
                  reservedWordList={Object.keys(this.props.stores).map((item) => this.props.stores[item].name)}
                  value={this.state.store}
                // value={this.state.price !== 0 ? this.state.price.toString() : ''}
                />
              </View>
              <View style={styles.inputContainer_des}>
                <Text style={styles.static}>{this.state.description !== '' || this.state.capturedImage !== undefined ? 'description' : ''}</Text>
                {
                  this.state.capturedImage !== undefined &&
                  <Image source={{ uri: this.state.capturedImage.base64 }} style={{ width: AddPage.IMAGE_SIZE, height: AddPage.IMAGE_SIZE }} />
                }
                <TextInput
                  style={styles.input}
                  placeholder="description"
                  multiline={true}
                  onChangeText={(description) => this.setState({ description })}
                  value={this.state.description}
                />
              </View>
            </ScrollView>
            <View style={styles.bottomBar}>
              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.bottomButton} onPress={this.handleCameraButton} >
                  <Image source={require('../img/camera_button.png')} style={{ width: 26, height: 23 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={this.handleKeyboardHide} >
                  <Image source={require('../img/keyboradHide_btn.png')} style={{ width: 18, height: 9}} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={[styles.confirm, !bEnbleApply && {backgroundColor: '#dddddd'}]} onPress={this.handleApply} disabled={!bEnbleApply} >
                <Image source={require('../img/Confirm_btn.png')} style={{ width: 19 }} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={styles.cameraContainer}>
          <Camera handleCameraCaptrue={this.handleCameraCaptrue} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  avoidkeyWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'rgba(24, 23, 67, 0.1  )',
  },
  cameraContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  camera: {
    margin: 20,
    borderColor: '#000000FF',
    borderWidth: 1,
  },
  animateWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  scrollViewWrapper: {
    flex: 1,
  },
  titleBar: {
    borderBottomColor: '#DBDBDB',
    borderBottomWidth: 2,
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToMain: {
    position: 'absolute',
    left: 15,
    width: 8,
    height: 14,
  },
  inputContainer: {
    paddingLeft: 25,
    paddingRight: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: 40,
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 1,
  },
  inputContainer_des: {
    paddingLeft: 25,
    paddingRight: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  static: {
    flex: 1,
    color: '#3D59B9',
    fontSize: 10,
  },
  input: {
    flex: 3,
  },
  bottomBar: {
    height: 112,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  bottomButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomButton: {
    width: 26,
    height: 26,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm: {
    flex: 1,
    backgroundColor: '#557BE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default useMaterial(AddPage);