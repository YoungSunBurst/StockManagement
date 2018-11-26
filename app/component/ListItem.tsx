
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle } from 'react-native';
import { IMaterial } from '../models/Types';
import { useMaterial } from '../models/Material';
import Swipeout, { SwipeoutButtonProperties } from 'react-native-swipeout';

interface IProps extends IMaterial {
  idx: number;
  setParentScrollEnable: (enable: boolean) => void;
  changeCount?: (idx: number, count: number) => void;
  deleteItem?: (idx: number) => void;
  onEditItem?: (idx: number) => void;
}

interface IState {
  // for test, this will be replaced redux props.
  // count: number;
}

class ListItem extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      // count: props.count,
    };
  }

  handleCountChange = (change: number) => {
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
    },
  ];

  render() {
    return (
      <View style={{marginBottom: 4}}>
        <Swipeout backgroundColor={'#F5F5F5'} right={this.swipeoutBtns} autoClose={true} scroll={(scrollEnabled: boolean) => { this.props.setParentScrollEnable(scrollEnabled); }} >
          <View style={styles.container} >
            <Image style={styles.thumb as ImageStyle} source={{ uri: this.props.image.base64 }} />
            <Text style={styles.name}>{this.props.name}</Text>
            <View style={styles.buttons} >
              <TouchableOpacity onPress={() => this.handleCountChange(-1)} disabled={this.props.count < 1}>
                <Image source={require('../img/minus_btn.png')} style={{ width: 19, height: 19 }} />
              </TouchableOpacity>
              <Text>{this.props.count}</Text>
              <TouchableOpacity onPress={() => this.handleCountChange(+1)} >
                <Image source={require('../img/plus_btn.png')} style={{ width: 19, height: 19 }} />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity>
            <Image source={require('../img/info_btn.png')} style={{width: 20, height: 20}}/>
        </TouchableOpacity> */}
          </View>
        </Swipeout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // position: 'absolute',
    // top: 0,
    // width: '100%',
    flexDirection: 'row',
    flex: 1,
    height: 62,
    // borderStyle: 'solid',
    // borderColor: '#00000055',
    // borderWidth: 1,
    // justifyContent: 'stretch',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    // marginBottom: 4,
  },
  thumb: {
    // // borderStyle: 'solid',
    // borderColor: '#11111111',
    // borderWidth: 1,
    width: 50,
    height: 50,
    marginLeft: 5,
    marginVertical: 6,
  },
  name: {
    // width: 152,
    // height: 13,
    marginLeft: 13,
    flex: 100,
    // backgroundColor: '#FF0000',
  },
  buttons: {
    // position: '
    flexDirection: 'row',
    width: 78,
    height: 19,
    justifyContent: 'space-between',
    marginRight: 30,
    // : 'flex-end',
  },
});

export default useMaterial(ListItem);