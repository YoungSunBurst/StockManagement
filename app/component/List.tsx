
import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import { IMaterial } from '../models/Types';
import AddPage from './AddPage';
import { useMaterial } from '../models/Material';
import ListItem from './ListItem';
import { number } from 'prop-types';

interface IProps {
  title: string;
  backToMain: () => void;
  materials: Array<IMaterial>
  loadDataFromStorage: ((complete: () => void) => void) | undefined;
  saveDataToStorage: (() => void) | undefined;
};

interface IState {
  listState: EnumListState;
  loading: boolean;
  scroll: boolean;
  editIdx: number;
};


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
    }
  }
  componentWillMount() {
    if( undefined !== this.props.loadDataFromStorage ) {
      this.props.loadDataFromStorage(() => {this.setState({loading: false})});
    } 
  }

  componentWillReceiveProps(nextProps: IProps) {
    if( this.props.materials !== nextProps.materials ) {
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
    if( undefined !== this.props.saveDataToStorage ) {
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
        <ScrollView style={styles.contents} scrollEnabled={false !== this.state.scroll}>
        {
          this.state.loading === false ? 
          this.props.materials.map( (item, index) => <ListItem idx={index} name={item.name} image={item.image} count={item.count} 
          setParentScrollEnable={this.handleSetScroll} onEditItem={this.handleEditItem} key={index} /> ) :
          <Text>loading..</Text>
        }
        </ScrollView>
        <View style={styles.footer} />
        {
          this.state.listState === EnumListState.addMaterial && <AddPage cancel={this.handlePopupCancel} isEdited={false} idx={-1}/>
        }
        {
          this.state.listState === EnumListState.EditMaterail && <AddPage cancel={this.handlePopupCancel} isEdited={true} 
          idx={this.state.editIdx} name={this.props.materials[this.state.editIdx].name} image={this.props.materials[this.state.editIdx].image}
          price={this.props.materials[this.state.editIdx].price} count={this.props.materials[this.state.editIdx].count}/>
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
    width: 100,
    textAlign: "center",
    alignSelf: 'center'
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
