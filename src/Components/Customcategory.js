import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from './Baseurl';

import AsyncStorage from '@react-native-async-storage/async-storage';
const Customcategory = ({ actionSheetCategory, sendDataToParent, catData,sendSelectedCategory }) => {


  const [number, onChangeNumber] = React.useState('');
  const [category, setcategory] = useState(catData);
    // console.log(category,'category');
  const [selectedItems, setSelectedItems] = useState([]);
  const catego = () => {
    fetch(Baseurl + '/api/product/category/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setcategory(json)
      })
      .catch((error) => {
        console.error(error)
      })
  };
  useEffect(() => {
    // catego();

  }, [])


  // Function to save selected items to AsyncStorage
  const saveSelectedItems = async () => {
    try {
      const jsonValue = JSON.stringify(selectedItems);
      await AsyncStorage.setItem('selectedItems', jsonValue);
      console.log('itemselected')
    } catch (error) {
      console.error('Error saving selected items:', error);
    }
  };

  // Function to retrieve selected items from AsyncStorage
  const retrieveSelectedItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedItems');
      const storedSelectedItems = jsonValue != null ? JSON.parse(jsonValue) : [];
      setSelectedItems(storedSelectedItems);
      console.log('itemremove')
    } catch (error) {
      console.error('Error retrieving selected items:', error);
    }
  };

  const toggleItemSelection = (itemId) => {
    // Check if the item is already selected
    const isItemSelected = selectedItems.includes(itemId);

    // If the item is selected, remove it from selectedItems
    if (isItemSelected) {
      setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== itemId));
    } else {
      // If the item is not selected, add it to selectedItems
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    }

    const selectedItem = category.find((item) => item === itemId);
    console.log('Selected Item:', selectedItem);
    sendSelectedCategory(selectedItem); // Pass the selected item back to the parent component

    // Save the selected items to AsyncStorage
    saveSelectedItems();
  };
  // const handleDonePress = () => {
  //   // Send the selected categories to the parent component using the prop function
  //   const selectedCategories = selectedItems.map((itemId) => category[itemId]);
  //   sendDataToParent(selectedCategories);
  //   actionSheetCategory.current?.hide(); // Hide the bottom action sheet after pressing "Done"
  // };





  return (
    <>
<View>
      <View style={styles.topmain}>
        <View style={styles.txttop}>
          <Text style={styles.txt}>
          Elege una o mas categorias
          </Text>
          <TouchableOpacity onPress={() => { actionSheetCategory.current?.hide() }}>
            <Text style={styles.txtd}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      
      </View>
      <ScrollView style={styles.main}>
       
          {category.map((e) => (
            <>
            <TouchableOpacity key={e} onPress={() => toggleItemSelection(e)} >
                <View style={styles.contentContainer}>
              <Text style={styles.niketxt}>{e}</Text>
              {selectedItems.includes(e) ? (
                <Image style={styles.tickimg} source={require('../Assets/tick.png')} />
              ) : null}
              </View>
            </TouchableOpacity>
              <View style={styles.hrWidth}/>
        </>  ))}
    
      </ScrollView>
      </View>

    </>
  )
}

export default Customcategory

const styles = StyleSheet.create({
  topmain: {
    backgroundColor: "black",
    height: hp('12%'),
  },
  main: {
    // flex:1,
    backgroundColor: "#333333",
    marginTop: hp('-6%'),
    height: hp('100%'),
  },
  txttop: {
    flexDirection: 'row',

    // justifyContent:'center',
    // alignItems:"center",
  },
  txt: {
    color: 'white',
    marginLeft: wp("30%"),
    marginTop: hp('1%'),
  },
  txtd: {
    color: '#DAFDA5',
    marginTop: hp('1%'),
    marginLeft: wp("13%"),
  },
  searcmain: {
    backgroundColor: "#333333",
    height: hp('5.5%'),
    borderRadius: 10,
    marginTop: hp('1%'),
  },
  srchmainim: {
    flexDirection: 'row',
  },
  serchm: {
    height: 36,
    backgroundColor: '#333333',
    width: wp('12%'),
    marginTop: hp('0.6%'),
    marginLeft: hp('2%'),
    borderRadius: 10,
  },
  srchim: {
    height: hp('2.5%'),
    width: wp('5.2%'),
    marginTop: hp('1%'),
    marginLeft: hp('0.8%'),
  },
  input: {
    backgroundColor: '#333333',
    height: 36,
    width: wp('84%'),
    // borderWidth: 1,
    // padding: 8,
    // paddingLeft: 18,
    marginLeft: hp('-2.4%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('0.6%'),
    border: 'none',
  },
  brandmain: {
    flexDirection: 'row',
    padding: 10,
  },
  nikeimgmain: {
    backgroundColor: 'white',
    height: hp('4%'),
    width: wp('7%'),
    borderRadius: 50,
    marginTop: hp('1%'),
  },
  nikeimg: {
    height: hp('2.5%'),
    width: wp('6%'),
    marginTop: hp('1%'),
    marginLeft: hp('0.4%'),
  },
  niketxt: {
    color: 'white',
    fontSize: hp('2.6%'),
    marginTop: hp('1.2%'),
    marginLeft: hp('2%'),
  },
  hrline: {
    height: hp('0.05%'),
    width: wp('96%'),
    backgroundColor: '#fff',
    marginTop: hp('0.6%'),
    alignSelf: 'center'
  },
  tickimg: {
    height: hp('2.6%'),
    width: wp('6%'),
    marginTop: hp('1.2%'),
    marginRight: hp('4.5%'),
  },
  contentContainer:{
    flexDirection:'row',
    // alignItems:'flex-end',
    justifyContent:'space-between'
  },
  hrWidth: {
    height: hp('0.12%'),
    width: wp('91.5%'),
    backgroundColor: '#737373',
    marginTop: hp('2.2%'),
    // marginLeft:hp('2.2%'),
    alignSelf: 'center'
  },
  
})