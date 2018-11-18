import React from 'react';
import { Component } from 'react';
import { StyleSheet, View, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Dimensions, GestureResponderEvent, Image, Text, TextInput, Button } from 'react-native';
import Camera from './Camera';
import { IImage, IMaterial } from '../models/Types';
import { useMaterial } from '../models/Material';

enum EnumPageState {
  main,
  camera,
}

interface IProps extends IMaterial{
  cancel: () => void;
  addData: (capturedImage: IImage, name: string, price: number) => void;
  editData: (idx: number, material: IMaterial) => void;
  isEdited: boolean;
  idx: number;
};

interface IState {
  pageState: EnumPageState,
  capturedImage: IImage | undefined;
  name: string;
  price: number;
  prevName: string;
  // store?: ;
  // location?: string;

};

class AddPage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pageState: EnumPageState.main,
      capturedImage: undefined,
      name: '',
      price: 0,
      prevName: '',
    }
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.isEdited && props.name !== state.prevName) {
      return {
        prevName: props.name,
        name: props.name,
        capturedImage: props.image,
        price: undefined !== props.price ? props.price : 0
      };
    }
    return null;
  }

  handleCameraButton(){
    this.setState({pageState: EnumPageState.camera});
  }

  handleCameraCaptrue = ( imageUri: string, width: number, height: number ) => {
    this.setState({pageState: EnumPageState.main, capturedImage: {base64: 'data:image/png;base64,' + imageUri, width: 200, height:200}});
  }

  handlePriceInput = (text: string) => {
    let newText = text.replace(/[^0-9]/g, '');
    if( newText === '' ) {
      if ( this.state.price === 0 ) {
        this.forceUpdate();
      } else {
        this.setState({ price: 0});
      }
    } else {
      this.setState({
        price: parseInt(newText)
      });
    }
  }

  handleApply = () => {
    const {capturedImage, name, price} = this.state;
    if ( undefined !== capturedImage && '' !== name) {
      if ( false !== this.props.isEdited ) {
        this.props.editData( this.props.idx, { image: capturedImage, name, price, count: this.props.count});
      } else {
        this.props.addData(capturedImage, name, price);
      }
    } else {
      alert('need Image & name');
    }
    // this.props.cancel();
  }

  render() {
    if (this.state.pageState === EnumPageState.main) {
      return (
        <TouchableOpacity style={styles.container} onPress={() => this.props.cancel()}>
          <TouchableWithoutFeedback onPress={(e: GestureResponderEvent) => { Keyboard.dismiss(); e.stopPropagation() }}>
            <View style={styles.mainPopup}>
              <TouchableOpacity style={styles.camera} onPress={() => { this.handleCameraButton() }} >
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
                  keyboardType='numeric'
                  onChangeText={(price) => this.handlePriceInput(price)}
                  value={this.state.price !== 0 ? this.state.price.toString() : ''}
                />
              </View>
              <View style={styles.confirm}>
                <Button title="Apply" onPress={this.handleApply}/>
              </View>
              </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
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
    backgroundColor: '#00000080',
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

    top: 100,
    left: 30,
    right: 30,
    bottom: 100,
    // width: 150,
    // height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "#F5FCFF",
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
  static:{
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
  }

});

export default useMaterial(AddPage);