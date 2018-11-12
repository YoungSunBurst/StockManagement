
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import Camera from './Camera';
import ItemListView from './List';

// import BadInstagramCloneApp from './camera/camera';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

enum EnumAppState {
  main,
  material,
  camera,
};

interface ICaputuredImage {
  uri: string;
  width: number;
  height: number;
}

interface IProps {
};

interface IState {
  mainState: EnumAppState;
  capturedImage: ICaputuredImage | undefined;
};

export default class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mainState: EnumAppState.main,
      capturedImage: undefined,
    }
  }  

  handleButton = (state: EnumAppState) => {
    console.log('handleCameraButton' + state);
    this.setState({mainState: state});
  }

  handleReturnMain = () => {
    this.setState({mainState: EnumAppState.main});
  }

  // handleCameraButton = () => {
  //   console.log('handleCameraButton');
  //   this.setState({mainState: EnumAppState.camera});
  // }

  handleCameraCaptrue = ( imageUri: string ) => {
    this.setState({mainState: EnumAppState.main, capturedImage: {uri: imageUri, width: 200, height:200}});
  }

  render() {
    if (this.state.mainState === EnumAppState.main) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Stock Management</Text>
          { this.state.capturedImage !== undefined && 
          <Image source={{uri: this.state.capturedImage.uri}} style={{width: 200, height: 200}} />
          }
          <Button
            onPress={ () => this.handleButton(EnumAppState.material)}
            title="Material"
          />
          <Button
            onPress={() => this.handleButton(EnumAppState.camera)}
            title="Camera test"
          />
        </View>
      );
    } else if (this.state.mainState === EnumAppState.material){
      return (
        <ItemListView title={'Material'} backToMain={this.handleReturnMain}/>
      );
    } else {
      return (
      <Camera handleCameraCaptrue={this.handleCameraCaptrue}/>
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    alignItems: 'center'
  },
  button: {
    alignItems: 'center'
  },
  // welcome: {
  //   fontSize: 20,
  //   textAlign: 'center',
  //   margin: 10,
  // },
  // instructions: {
  //   textAlign: 'center',
  //   color: '#333333',
  //   marginBottom: 5,
  // },
});
