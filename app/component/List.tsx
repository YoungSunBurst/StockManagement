
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, ImageStyle } from 'react-native';
import { IMaterial } from '../models/Types';
import AddPage from './AddPage';
import { useMaterial } from '../models/Material';
import ListItem from './ListItem';
import { number } from 'prop-types';
// const { StatusBarManager } = NativeModules;

// StatusBarManager.getHeight((statusBarHeight: number) =>{
//   console.log(statusBarHeight)
// })
// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

interface IProps {
  title: string;
  backToMain: () => void;
  materials: Array<IMaterial>;
  loadDataFromStorage: ((complete: () => void) => void) | undefined;
  saveDataToStorage: (() => void) | undefined;
}

interface IState {
  listState: EnumListState;
  loading: boolean;
  scroll: boolean;
  editIdx: number;
}

enum EnumListState {
  main,
  addMaterial,
  EditMaterail,
  showDetail,
}

class ItemListView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      listState: EnumListState.main,
      loading: true,
      scroll: true,
      editIdx: -1,
    };
  }

  componentWillMount() {
    if ( undefined !== this.props.loadDataFromStorage ) {
      this.props.loadDataFromStorage(() => {this.setState({loading: false}); });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if ( this.props.materials !== nextProps.materials ) {
      this.setState({listState: EnumListState.main, editIdx: -1});
    }
  }

  handleAddButton = () => {
    this.setState({ listState: EnumListState.addMaterial});
  }

  handlePopupCancel = () => {
    this.setState({ listState: EnumListState.main, editIdx: -1});
  }

  handleBackToMain = () => {
    if ( undefined !== this.props.saveDataToStorage ) {
      this.props.saveDataToStorage();
    }
    this.props.backToMain();
  }

  handleSetScroll = (enable: boolean) => {
    if ( this.state.scroll !== enable) {
      this.setState({scroll: enable});
    }
  }

  handleEditItem = ( idx: number ) => {
    this.setState({ listState: EnumListState.EditMaterail, editIdx: idx});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBar}>
          <TouchableOpacity style={styles.backToMain} onPress={this.handleBackToMain} >
            <Image source={require('../img/menu_btn.png')} style={{ width: 8, height: 13 }} />
          </TouchableOpacity>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <ScrollView style={styles.contents} scrollEnabled={false !== this.state.scroll}>
          {
            this.state.loading === false ?
              this.props.materials.map((item, index) => <ListItem idx={index} name={item.name} image={item.image} count={item.count}
                setParentScrollEnable={this.handleSetScroll} onEditItem={this.handleEditItem} key={index} />) :
              <Text>loading..</Text>
          }
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footerChild}>
            <TouchableOpacity style={styles.footerBtn} onPress={this.handleBackToMain} >
              <Image source={require('../img/home_btn.png')} style={styles.footerBtnImg as ImageStyle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerBtn} >
              <Image source={require('../img/product_btn.png')} style={styles.footerBtnImg as ImageStyle} />
            </TouchableOpacity>
          </View>
          <View style={{ width: 56}}/>
          <View style={styles.footerChild}>
            <TouchableOpacity style={styles.footerBtn} >
              <Image source={require('../img/wish_btn.png')} style={styles.footerBtnImg as ImageStyle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerBtn} >
              <Image source={require('../img/account_btn.png')} style={styles.footerBtnImg as ImageStyle} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={this.handleAddButton} >
          <Image source={require('../img/add_btn.png')} style={{ width: 56, height: 56 }} />
        </TouchableOpacity>
        {this.state.listState === EnumListState.addMaterial && <AddPage cancel={this.handlePopupCancel} isEdited={false} idx={-1} />}
        {this.state.listState === EnumListState.EditMaterail && <AddPage cancel={this.handlePopupCancel} isEdited={true}
          idx={this.state.editIdx} name={this.props.materials[this.state.editIdx].name} image={this.props.materials[this.state.editIdx].image}
          price={this.props.materials[this.state.editIdx].price} count={this.props.materials[this.state.editIdx].count} />
        }

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleBar: {
    // marginTop
    borderBottomColor: '#DBDBDB',
    borderBottomWidth: 2,
    height: 61,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backToMain: {
    // position: 'absolute',
    marginLeft: 15,
    width: 8,
    height: 14,
  },
  title: {
    width: 100,
    marginLeft: 15,
    color: '#557BE2',
    // textAlign: 'center',
    // alignSelf: 'center',
  },
  addButton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
   // marginRight: 10,
    // justifyContent: 'flex-end',
  },
  contents: {
    marginTop: 21,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
    // backgroundColor: '#DDDDDD',
  },
  footer: {
    height: 57,
    // flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
  footerChild: {
    // height: 57,
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
  footerBtn: {
    alignSelf: 'center',
    flex: 1,
    // alignContent: 'center',
    // justifyContent: 'center',
  },
  footerBtnImg: {
    alignSelf: 'center',
    width: 20,
    height: 20,
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
