import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from './Baseurl';
import BottomActionSheet from './BottomActionSheet';

const Filter = ({ navigation, actionSheetfilterSubCategory, onSubcategorySelect,filderDataCat }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [number, onChangeNumber] = useState('');
  const [subcategory, setSubcategory] = useState(filderDataCat);
  const [selectAll, setSelectAll] = useState(false); // Track the "Select All" state

  useEffect(() => {
    // category();
  }, []);

  const category = () => {
    fetch(Baseurl + '/api/product/subcategory/', {
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setSubcategory(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDone = () => {
    actionSheetfilterSubCategory.current?.hide();
  };

  const toggleItemSelection = (selectedSubcategory) => {
    setSelectedItems((prevSelected) => {
      const updatedSelectedItems = prevSelected.includes(selectedSubcategory)
        ? prevSelected.filter((subcategory) => subcategory !== selectedSubcategory)
        : [...prevSelected, selectedSubcategory];

      const selectedSubcategories = subcategory.filter((e) => updatedSelectedItems.includes(e));
      console.log('Selected Subcategories:', selectedSubcategories);
      onSubcategorySelect(selectedSubcategories);

      // Check if all subcategories are selected, and update the "Select All" state accordingly
      setSelectAll(updatedSelectedItems.length === subcategory.length);

      return updatedSelectedItems;
    });
  };

  // Function to handle "Select All" action
  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all subcategories if all are currently selected
      setSelectedItems([]);
    } else {
      // Select all subcategories if not all are currently selected
      setSelectedItems(subcategory);
    }
    setSelectAll(!selectAll); // Toggle the "Select All" state
  };

  return (
    <>
      <View style={styles.topmain}>
        <View style={styles.txttop}>
          <TouchableOpacity onPress={() => handleDone()}>
            <Text style={styles.txtd}>Done</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>Filter by</Text>
        </View>
      </View>
      <ScrollView style={styles.main}>
        {/* "Select All" button */}
        <TouchableOpacity onPress={() => handleSelectAll()}>
          <View style={styles.contentContainer}>
            <Text style={styles.niketxt}>All</Text>
            {selectAll && <Image style={styles.tickimg} source={require('../Assets/tick.png')} />}
          </View>
        </TouchableOpacity>
        <View style={styles.hrWidth} />
        {/* Subcategory list */}
        {subcategory.map((e) => (
          <>
          <TouchableOpacity key={e} onPress={() => toggleItemSelection(e)}>
            <View style={styles.contentContainer}>
              <Text style={styles.niketxt}>{e}</Text>
              {selectedItems.includes(e) && <Image style={styles.tickimg} source={require('../Assets/tick.png')} />}
            </View>
          </TouchableOpacity>
          <View style={styles.hrWidth}/>
      </>  ))}
      </ScrollView>
    </>
  );
};

export default Filter

const styles = StyleSheet.create({
  topmain: {
    backgroundColor: "black",
    height: hp('5.5%'),
  },
  main: {
    // flex:1,
    backgroundColor: "#333333",
    height: hp('90%'),
  },
  txttop: {
    flexDirection: 'row',
    // justifyContent:'center',
    // alignItems:"center",
  },
  txt: {
    color: 'white',
    marginLeft: hp("17.5%"),
    marginTop: hp('1%'),
  },
  txtd: {
    color: '#DAFDA5',
    marginTop: hp('1%'),
    marginLeft: hp("1.9%"),
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
  hrWidth: {
    height: hp('0.12%'),
    width: wp('91.5%'),
    backgroundColor: '#737373',
    marginTop: hp('2.2%'),
    // marginLeft:hp('2.2%'),
    alignSelf: 'center'
  },
  contentContainer:{
    flexDirection:'row',
    // alignItems:'flex-end',
    justifyContent:'space-between'
  },
  tickimg:{
    height:hp('2.6%'),
    width:wp('6%'),
    marginTop: hp('1.2%'),
    marginRight: wp('8%'),
  },
})