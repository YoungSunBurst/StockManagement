
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ScrollView, ImageStyle} from 'react-native';
import { IMaterial } from '../models/Types';
import AddPage from './AddPage';
import { dummy } from '../Dummy';



interface IItemProps extends IMaterial{
  idx: number;
};

interface IItemState {
  // for test, this will be replaced redux props.
  count: number;
};

class ListItem extends Component<IItemProps, IItemState> {
  constructor(props: IItemProps) {
    super(props);
    this.state = {
      count: props.count,
    }
  }

  handleCountChange = ( change: number ) => {
    this.setState({ count: this.state.count + change});
  }

  render() {
    return (
      <View style={itemstyles.container}>
        <Image style={itemstyles.thumb as ImageStyle} source={{uri: this.props.image.base64}} />
        <Text>{this.props.name}</Text>
        <TouchableOpacity  onPress={() => this.handleCountChange(-1)} disabled={this.state.count < 1}>
            <Image source={require('../img/minus_button.png')} style={{width: 40, height: 40}}/>
        </TouchableOpacity>
        <Text>{this.state.count}</Text>
        <TouchableOpacity  onPress={() => this.handleCountChange(+1)} >
            <Image source={require('../img/plus_button.png')} style={{width: 40, height: 40}}/>
        </TouchableOpacity>
        <TouchableOpacity>
            <Image source={require('../img/info_button.png')} style={{width: 40, height: 40}}/>
        </TouchableOpacity>

      </View>
    );
  }

}

const itemstyles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    height: 80,
    // borderStyle: 'solid',
    borderColor: '#00000055',
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }, 
  thumb: {
    // borderStyle: 'solid',
    borderColor: '#11111111',
    borderWidth: 1,
    width: 60,
    height: 60,
  }
});

interface IProps {
  title: string;
  backToMain: () => void;
};

interface IState {
  listState: EnumListState;

};


enum EnumListState {
  main,
  addMaterial,
  showDetail,
}


export default class ItemListView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      listState: EnumListState.main,
    }
  }

  handleAddButton = () => {
    this.setState({ listState: EnumListState.addMaterial});
  }

  handlePopupCancel = () => {
    this.setState({ listState: EnumListState.main});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
            <TouchableOpacity style={styles.backToMain} onPress={ () => {this.props.backToMain()}} >
            <Image source={require('../img/back_button.png')} style={{width: 40, height: 40}}/>
          </TouchableOpacity>
          <Text style={styles.title}>{this.props.title}</Text>
          <TouchableOpacity style={styles.addButton} onPress={this.handleAddButton} >
            <Image source={require('../img/add_button.png')} style={{width: 40, height: 40}}/>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contents}>
        {dummy.map( (item, index) => <ListItem idx={index} name={item.name} image={item.image} count={item.count} key={index} /> )}
        </ScrollView>
        <View style={styles.footer}/>
        {
          this.state.listState === EnumListState.addMaterial && <AddPage cancel={this.handlePopupCancel}/>
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  titleBar: {
    // marginTop
    height: 100, 
    // flexDirection: 'column',
    alignSelf: 'stretch',
    // alignItems: 'center',
    // alignItems: 'flex-start'
    justifyContent: 'center'
  },
  backToMain: {
    position: 'absolute',
    left: 10,
    width: 40,
    height: 40,
  },
  title: {

    textAlign: "center",
  
  },
  addButton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    // marginRight: 10,
    // justifyContent: 'flex-end',
  },
  contents: {
    flex: 1,
    backgroundColor: '#DDDDDD',
  },
  footer: {
    height: 100,
    // flex:1,
    alignItems: 'flex-end'
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
