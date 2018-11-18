
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle, GestureResponderEvent} from 'react-native';
import { IMaterial } from '../models/Types';
import { useMaterial } from '../models/Material';
import Swipeout, { SwipeoutButtonProperties } from 'react-native-swipeout';

interface IProps extends IMaterial{
  idx: number;
  changeCount: (idx: number, count: number) => void;
  setParentScrollEnable: (enable: boolean) => void;
  deleteItem: (idx: number) => void;
  onEditItem: (idx: number) => void;
};

interface IState {
  // for test, this will be replaced redux props.
  // count: number;
};

class ListItem extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      // count: props.count,
    }
  }

  handleCountChange = ( change: number ) => {
    // this.setState({ count: this.state.count + change});
    let newCount = this.props.count + change;
    this.props.changeCount(this.props.idx, newCount);
  }

  // handelTouchMove = (e: GestureResponderEvent) => {
  //   if( e.nativeEvent.locationX - e.nativeEvent.changedTouches[0].locationX) {
  //     console.log(e.nativeEvent);
  //   }
  // }

  handleDeleteItem = () => {
    this.props.deleteItem(this.props.idx);
  }

  handleEditItem = () => {
    this.props.onEditItem(this.props.idx);
  }

  swipeoutBtns: Array<SwipeoutButtonProperties> = [
    {
      text: 'Edit',
      // type: 'secondary',
      onPress: this.handleEditItem,
    }, {
      text: 'Delete',
      backgroundColor: '#E40000',
      type: 'delete',
      onPress: this.handleDeleteItem,
    }
  ]

  render() {
    return (
      <Swipeout right={this.swipeoutBtns} autoClose={true} scroll={(scrollEnabled: boolean)=>{this.props.setParentScrollEnable(scrollEnabled)}} >
      <View style={styles.container} >
        <Image style={styles.thumb as ImageStyle} source={{uri: this.props.image.base64}} />
        <Text>{this.props.name}</Text>
        <TouchableOpacity  onPress={() => this.handleCountChange(-1)} disabled={this.props.count < 1}>
            <Image source={require('../img/minus_button.png')} style={{width: 40, height: 40}}/>
        </TouchableOpacity>
        <Text>{this.props.count}</Text>
        <TouchableOpacity  onPress={() => this.handleCountChange(+1)} >
            <Image source={require('../img/plus_button.png')} style={{width: 40, height: 40}}/>
        </TouchableOpacity>
        <TouchableOpacity>
            <Image source={require('../img/info_button.png')} style={{width: 40, height: 40}}/>
        </TouchableOpacity>
      </View>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
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

export default useMaterial(ListItem);

