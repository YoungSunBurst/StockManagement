
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import Camera from './Camera';

// import BadInstagramCloneApp from './camera/camera';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

enum EnumAppState {
  main,
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
  
  handleCameraButton = () => {
    console.log('handleCameraButton');
    this.setState({mainState: EnumAppState.camera});
  }

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
            onPress={this.handleCameraButton}
            title="Camera test"
          />
        </View>
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
