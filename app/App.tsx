
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import Camera from './component/Camera';
import ItemListView from './component/List';
import { MaterialProvider } from './models/Material';

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
  private materialInstance: React.RefObject<MaterialProvider>;


  constructor(props: IProps) {
    super(props);
    this.state = {
      mainState: EnumAppState.main,
      capturedImage: undefined,
    }
    this.materialInstance = React.createRef();
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

  handleCameraCaptrue = ( imageUri: string , width: number, height: number) => {
    this.setState({mainState: EnumAppState.main, capturedImage: {uri:  'data:image/png;base64,' + imageUri, width: width, height:height}});
  }

  handleInitialize = () => {
    if( this.materialInstance.current !== null ) {
      this.materialInstance.current.actions.initialize();
    }
  }

  render() {
    if (this.state.mainState === EnumAppState.main) {
      return (
        <MaterialProvider ref={this.materialInstance}>
          <View style={styles.container}>
            <Text style={styles.title}>Stock Management</Text>
            {this.state.capturedImage !== undefined && 
              <Image source={{ uri: this.state.capturedImage.uri }} style={{ width: 200, height: 200 }} />
            }
            <Button
              onPress={() => this.handleButton(EnumAppState.material)}
              title="Material"
            />
            <Button
              onPress={() => this.handleButton(EnumAppState.camera)}
              title="Camera test"
            />
            <Button
              onPress={this.handleInitialize}
              title="Initialize Storage"
            />
          </View>
        </MaterialProvider>
      );
    } else if (this.state.mainState === EnumAppState.material) {
      return (
        <MaterialProvider>
          <ItemListView title={'Material'} backToMain={this.handleReturnMain} />
        </MaterialProvider>
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
