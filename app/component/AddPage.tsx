import React from 'react';
import { Component } from 'react';
import { Animated, StyleSheet, View, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Dimensions, GestureResponderEvent, Image, Text, TextInput, Button, Alert } from 'react-native';
import Camera from './Camera';
import { IImage, IMaterial, IStore, IStores } from '../models/Types';
import { useMaterial } from '../models/Material';
import AutoCompleteInput from './AutoCompleteInput';

enum EnumPageState {
  main,
  camera,
}

interface IProps extends IMaterial {
  cancel: () => void;
  isEdited: boolean;
  idx: number;
  // storeId?: string;
  stores?: IStores;
  addData?: (capturedImage: IImage, name: string, price: number, store?: string) => void;
  editData?: (idx: number, material: IMaterial, store?: string) => void;
}

interface IState {
  pageState: EnumPageState;
  capturedImage: IImage | undefined;
  name: string;
  price: number;
  prevName: string;
  store: string;
  mainPopupPosition: Animated.Value;
}

class AddPage extends Component<IProps, IState> {
  public static ADDPAGE_ANIMATEDTIME = 500;
  public static ADDPAGE_VERTICALMARGIN = 100;

  constructor(props: IProps) {
    super(props);
    this.state = {
      pageState: EnumPageState.main,
      capturedImage: undefined,
      name: '',
      price: 0,
      prevName: '',
      store: '',
      mainPopupPosition: new Animated.Value(Dimensions.get('window').height),
    };
  }

  static getDerivedStateFromProps(props: IProps, state: IState): Partial<IState> {
    if (props.isEdited && props.name !== state.prevName) {
      console.log(props.stores.hasOwnProperty(props.storeId));
      return {
        prevName: props.name,
        name: props.name,
        capturedImage: props.image,
        price: undefined !== props.price ? props.price : 0,
        store: props.stores.hasOwnProperty(props.storeId) === true ? props.stores[props.storeId].name : '',
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

  handleCameraButton() {
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
        this.props.editData(this.props.idx, { image: capturedImage, name, price, count: this.props.count }, store);
      } else {
        this.props.addData(capturedImage, name, price, store);
      }
    } else {
      alert('need Image & name');
    }
    // this.props.cancel();
  }

  onClose = () => {
    Animated.timing(
      this.state.mainPopupPosition,
      {
        toValue: Dimensions.get('window').height,
        duration: AddPage.ADDPAGE_ANIMATEDTIME,
      },
    ).start( () => { this.props.cancel(); });
  }

  handleCancel = () => {
    if ((false === this.props.isEdited && (this.state.capturedImage !== undefined || this.state.name !== '')) ||
      false !== this.props.isEdited && (this.state.capturedImage !== this.props.image || this.state.name !== this.props.name ||
        this.state.price !== this.props.price)) {
      Alert.alert(
        'Are you sure you want to quit?',
        'Your changes will not be saved',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => this.onClose },
        ],
        { cancelable: false },
      );
    } else {
      this.onClose();
    }
  }

  render() {
    if (this.state.pageState === EnumPageState.main) {
      return (
        <TouchableWithoutFeedback  onPress={this.handleCancel}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={(e: GestureResponderEvent) => { Keyboard.dismiss(); e.stopPropagation(); }}>
              <Animated.View style={[styles.mainPopup, { top: this.state.mainPopupPosition }]}>
                <TouchableOpacity style={styles.camera} onPress={() => { this.handleCameraButton(); }} >
                  {this.state.capturedImage !== undefined ?
                    <Image source={{ uri: this.state.capturedImage.base64 }} style={{ width: 100, height: 100 }} /> :
                    <Image source={require('../img/camera_button.png')} style={{ width: 100, height: 100 }} />
                  }
                </TouchableOpacity>
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
                    onChangeText={(text, value) => this.setState({ store: value })}
                    reservedWordList={Object.keys(this.props.stores).map((item) => this.props.stores[item].name)}
                    value={this.state.store}
                  // value={this.state.price !== 0 ? this.state.price.toString() : ''}
                  />
                </View>
                <View style={styles.confirm}>
                  <Button title="Apply" onPress={this.handleApply} />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  container: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // alignSelf: 'stretch',
    // flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 20,
    backgroundColor: 'rgba(24, 23, 67, 0.2)',
  },
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mainPopup: {
    position: 'absolute',
    // top: Dimensions.get('window').height, // to 100 ( state.mainpopupposition)
    left: 0,
    right: 0,
    height: Dimensions.get('window').height - AddPage.ADDPAGE_VERTICALMARGIN * 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  camera: {
    margin: 20,
    borderColor: '#000000FF',
    borderWidth: 1,
  },
  inputContainer: {
    margin: 10,
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    height: 40,
    width: 100,
  },
  static: {
    flex: 1,
    color: '#3D59B9',
    fontSize: 10,
  },
  input: {
    flex: 3,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  confirm: {
    position: 'absolute',
    bottom: 10,
    borderColor: '#000000FF',
    borderWidth: 1,
    width: 100,
    height: 40,
  },
});

export default useMaterial(AddPage);