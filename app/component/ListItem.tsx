
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle } from 'react-native';
import { IMaterial } from '../models/Types';
import { useMaterial } from '../models/Material';
import Swipeout, { SwipeoutButtonProperties } from 'react-native-swipeout';

interface IProps extends IMaterial {
  idx: number;
  swipeEnable: boolean;
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
    // this.state = {
    // };
  }

  handleCountChange = (change: number) => {
    let newCount = this.props.count + change;
    this.props.changeCount(this.props.idx, newCount);
  }

  handleDeleteItem = () => {
    this.props.deleteItem(this.props.idx);
  }

  handleEditItem = () => {
    this.props.onEditItem(this.props.idx);
  }

  swipeoutBtns: Array<SwipeoutButtonProperties> = [
    {
      text: 'Edit',
      onPress: this.handleEditItem,
    }, {
      text: 'Delete',
      backgroundColor: '#E40000',
      type: 'delete',
      onPress: this.handleDeleteItem,
    },
  ];

  render() {
    const {setParentScrollEnable, swipeEnable, name, image, count} = this.props;
    const { swipeoutBtns, handleCountChange } = this;
    return (
      <View style={{marginBottom: 4}}>
        <Swipeout backgroundColor={'#F5F5F5'} right={swipeoutBtns} autoClose={true} scroll={(scrollEnabled: boolean) => { setParentScrollEnable(scrollEnabled); }} disabled={!swipeEnable} close={!swipeEnable}>
          <View style={styles.container} >
            <Image style={styles.thumb as ImageStyle} source={{ uri: image.base64 }} />
            <Text style={styles.name}>{name}</Text>
            <View style={styles.buttons} >
              <TouchableOpacity onPress={() => handleCountChange(-1)} disabled={count < 1}>
                <Image source={require('../img/minus_btn.png')} style={{ width: 19, height: 19 }} />
              </TouchableOpacity>
              <Text>{count}</Text>
              <TouchableOpacity onPress={() => handleCountChange(+1)} >
                <Image source={require('../img/plus_btn.png')} style={{ width: 19, height: 19 }} />
              </TouchableOpacity>
            </View>
          </View>
        </Swipeout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  thumb: {
    width: 50,
    height: 50,
    marginLeft: 5,
    marginVertical: 6,
  },
  name: {
    flex: 100,
    marginLeft: 13,
  },
  buttons: {
    width: 78,
    height: 19,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default useMaterial(ListItem);