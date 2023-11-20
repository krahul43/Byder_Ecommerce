import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from './Baseurl';
import Loader from './Loader';

const CustombrandSubCat = ({ navigation, actionSheetSubCategory, subcatData,onSubcategorySelect }) => {


  const [number, onChangeNumber] = React.useState('');
  const searchRef = useRef()
  const [subcategory, setSubcategory] = useState(subcatData);
  const [oldsubcategory, setOldSubcategory] = useState(subcatData);
  const [loaderVisible, setLoaderVisible] = useState(false);
  console.log(subcatData, 'subcatData subcategory');

  const category = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/subcategory/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setSubcategory(json)
        setOldSubcategory(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  };
  useEffect(() => {
    // category();

  }, [])



  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItemSelection = (selectedSubcategory) => {
    setSelectedItems((prevSelected) => {
      const updatedSelectedItems = prevSelected.includes(selectedSubcategory)
        ? prevSelected.filter((subcategory) => subcategory !== selectedSubcategory)
        : [...prevSelected, selectedSubcategory];

      const selectedSubcategories = subcategory.filter((e) => updatedSelectedItems.includes(e));
      console.log("Selected Subcategories:", selectedSubcategories);
      onSubcategorySelect(selectedSubcategories);

      return updatedSelectedItems;
    });
  };


  const Search = (txt) => {
    if (txt !== '') {
      const lowerCaseTxt = txt.toLowerCase(); // Convert the search text to lowercase
      const tempData = subcategory.filter((item) => {
        // Use map to convert each item to lowercase and check if it contains the search text
        return item ? item.toLowerCase().indexOf(lowerCaseTxt) > -1 : false;
      });
      setSubcategory(tempData);
    } else {
      setSubcategory(oldsubcategory); // Reset to the original data when the search text is empty
    }
  };




  return (
    <>
      <View style={styles.topmain}>
        <View style={styles.txttop}>
          <Text style={styles.txt}>
            Elege una o mas subcategorias
          </Text>
          <TouchableOpacity onPress={() => actionSheetSubCategory.current?.hide()}>
            <Text style={styles.txtd}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searcmain}>
          <View style={styles.srchmainim}>
            <View style={styles.serchm}>
              <Image style={styles.srchim} source={require('../Assets/searchwhite.png')} />
            </View>
            <TextInput
              style={styles.input}
              ref={searchRef}
              onChangeText={txt => Search(txt)}
              placeholder="Search"
              placeholderTextColor={'#fff'}
            />
          </View>
        </View>
      </View>
      <ScrollView style={styles.main}>
        <View >

          {subcategory.map((e) => (
            <>
              <TouchableOpacity key={e} onPress={() => toggleItemSelection(e)}>
                <Text style={styles.niketxt}>{e}</Text>
                {selectedItems.includes(e) && <Image style={styles.tickimg} source={require('../Assets/tick.png')} />}
              </TouchableOpacity>
              <View style={styles.hrWidth} />
            </>))}



        </View>
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
      </ScrollView>
    </>
  )
}
export default CustombrandSubCat
const styles = StyleSheet.create({
  topmain: {
    backgroundColor: "black",
    height: hp('12%'),
  },
  hrWidth: {
    height: hp('0.12%'),
    width: wp('91.5%'),
    backgroundColor: '#737373',
    marginTop: hp('2.2%'),
    // marginLeft:hp('2.2%'),
    alignSelf: 'center'
  },
  main: {
    // flex:1,
    backgroundColor: "#333333",
    height: hp('90%'),
  },
  txttop: {
    flexDirection: 'row',
   
  },
  txt: {
    color: 'white',
    marginLeft: wp("28%"),
    marginTop: hp('1%'),
  },
  txtd: {
    color: '#DAFDA5',
    marginTop: hp('1%'),
    marginLeft: wp("8.5%"),
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
    color: "#fff",
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
    marginTop: hp('-2.6%'),
    marginLeft: wp('85%'),
  },
})