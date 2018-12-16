
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, ImageStyle } from 'react-native';
import { IMaterial, initMaterial } from '../models/Types';
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
  materials?: Array<IMaterial>;
  loadDataFromStorage?: ((complete: () => void) => void) | undefined;
  saveDataToStorage?: (() => void) | undefined;
}

interface IState {
  listState: EnumListState;
  loading: boolean;
  scrollEnable: boolean;
  onScrolling: boolean;
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
      scrollEnable: true,
      onScrolling: false,
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
    console.log('handleSetScroll');
    if ( this.state.scrollEnable !== enable) {
      this.setState({scrollEnable: enable});
    }
  }

  handleScrollbegin = () => {
    console.log('handleScrollbegin');
    this.setState({onScrolling: true});
  }

  handleScrollEnd = () => {
    console.log('handleScrollEnd');
    this.setState({onScrolling: false});
  }

  handleEditItem = ( idx: number ) => {
    this.setState({ listState: EnumListState.EditMaterail, editIdx: idx});
  }

  render() {
    const { title, materials} = this.props;
    const { scrollEnable, onScrolling, loading, listState, editIdx } = this.state;
    const { handleBackToMain, handleScrollbegin, handleSetScroll, handleEditItem, handleScrollEnd, handleAddButton, handlePopupCancel } = this;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.titleBar}>
            <TouchableOpacity style={styles.backToMain} onPress={handleBackToMain} >
              <Image source={require('../img/menu_btn.png')} style={{ width: 8, height: 13 }} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
          </View>
          <ScrollView style={styles.contents} scrollEnabled={false !== scrollEnable} onScrollBeginDrag={handleScrollbegin} onScrollEndDrag={handleScrollEnd}>
            {
              loading === false && materials !== null ?
                materials.map((item, index) => <ListItem idx={index} swipeEnable={!onScrolling} name={item.name} image={item.image} count={item.count}
                  setParentScrollEnable={handleSetScroll} onEditItem={handleEditItem} key={index} />) :
                <Text>loading..</Text>
            }
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.footerChild}>
              <TouchableOpacity style={styles.footerBtn} onPress={handleBackToMain} >
                <Image source={require('../img/home_btn.png')} style={styles.footerBtnImg as ImageStyle} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerBtn} >
                <Image source={require('../img/product_btn.png')} style={styles.footerBtnImg as ImageStyle} />
              </TouchableOpacity>
            </View>
            <View style={{ width: 56 }} />
            <View style={styles.footerChild}>
              <TouchableOpacity style={styles.footerBtn} >
                <Image source={require('../img/wish_btn.png')} style={[styles.footerBtnImg as ImageStyle]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerBtn} >
                <Image source={require('../img/account_btn.png')} style={styles.footerBtnImg as ImageStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddButton} >
              <Image source={require('../img/add_btn.png')} style={{ width: 56, height: 56 }} />
            </TouchableOpacity>
          </View>
          {
            listState === EnumListState.addMaterial &&
            <AddPage cancel={handlePopupCancel} isEdited={false} idx={-1} {...initMaterial} />
          }
          {
            listState === EnumListState.EditMaterail &&
            <AddPage cancel={handlePopupCancel} isEdited={true} idx={editIdx}
            editMaterial={materials[editIdx]} />
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
  addButtonWrapper: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
   // marginRight: 10,
    // justifyContent: 'flex-end',
  },
  addButton: {

    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
  contents: {
    marginTop: 21,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 4,
    flex: 1,
  },
  footer: {
    height: 57,
    flexDirection: 'row',
  },
  footerChild: {
    flex: 1,
    flexDirection: 'row',
  },
  footerBtn: {
    alignSelf: 'center',
    flex: 1,
  },
  footerBtnImg: {
    alignSelf: 'center',

  },
});

export default useMaterial(ItemListView);
