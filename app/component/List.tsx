
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ScrollView, ImageStyle} from 'react-native';
import { IMaterial } from '../models/Types';
import AddPage from './AddPage';
import { dummy } from '../Dummy';
import { useMaterial } from '../models/Material';



interface IItemProps extends IMaterial{
  idx: number;
  changeCount: (idx: number, count: number) => void;
};

interface IItemState {
  // for test, this will be replaced redux props.
  // count: number;
};

class ListItem extends Component<IItemProps, IItemState> {
  constructor(props: IItemProps) {
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

  render() {
    return (
      <View style={itemstyles.container}>
        <Image style={itemstyles.thumb as ImageStyle} source={{uri: this.props.image.base64}} />
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
    );
  }
}

const WrapperdListItem = useMaterial(ListItem);


//


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
  materials: Array<IMaterial>
  loadDataFromStorage: ((complete: () => void) => void) | undefined;
  saveDataToStorage: (() => void) | undefined;
};

interface IState {
  listState: EnumListState;
  loading: Boolean;

};


enum EnumListState {
  main,
  addMaterial,
  showDetail,
}


class ItemListView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      listState: EnumListState.main,
      loading: true,
    }
  }
  componentWillMount() {
    if( undefined !== this.props.loadDataFromStorage ) {
      this.props.loadDataFromStorage(() => {this.setState({loading: false})});
    } 
  }

  componentWillReceiveProps(nextProps: IProps) {
    if( this.props.materials.length !== nextProps.materials.length ) {
      this.setState({listState: EnumListState.main});
    }

  }

  handleAddButton = () => {
    this.setState({ listState: EnumListState.addMaterial});
  }

  handlePopupCancel = () => {
    this.setState({ listState: EnumListState.main});
  }

  handleBackToMain = () => {
    if( undefined !== this.props.saveDataToStorage ) {
      this.props.saveDataToStorage();
    }
    this.props.backToMain();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
            <TouchableOpacity style={styles.backToMain} onPress={this.handleBackToMain} >
            <Image source={require('../img/back_button.png')} style={{width: 40, height: 40}}/>
          </TouchableOpacity>
          <Text style={styles.title}>{this.props.title}</Text>
          <TouchableOpacity style={styles.addButton} onPress={this.handleAddButton} >
            <Image source={require('../img/add_button.png')} style={{width: 40, height: 40}}/>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contents}>
        {
          this.state.loading === false ? 
          this.props.materials.map( (item, index) => <WrapperdListItem idx={index} name={item.name} image={item.image} count={item.count} key={index} /> ) :
          <Text>loading..</Text>
        }
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

export default useMaterial(ItemListView);
