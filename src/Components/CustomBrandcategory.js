import { StyleSheet, Text, View ,Image,TextInput,ScrollView,TouchableOpacity} from 'react-native'
import React ,{useState,useEffect,useRef}from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from './Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CustomBrandcategory = ({ actionSheetBrand,sendSelectedBrandCount, BrandDataApi,sendDataToParent, sendSelectedBrandCategory}) => {
  
  const navigation = useNavigation();
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');
  const searchRef = useRef()

  const [category,setcategory] =useState(BrandDataApi);
  const [oldcategory,setOldcategory] =useState([]);

  console.log(category,'brand category');
  const [selectedItems, setSelectedItems] = useState(BrandDataApi); 
  const brandcategory=()=>{
    fetch(Baseurl + '/api/brand/',{
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
    .then((json) => {
      setcategory(json.slice(0,50))
      setOldcategory(json.slice(0,50))
    })
    .catch((error) => {
      console.error(error)
    })
  };
  useEffect(() => {
    // brandcategory();
    retrieveSelectedItems()
  }, []);



  // Function to retrieve selected items from AsyncStorage
  const retrieveSelectedItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedItemsBrands');
      const storedSelectedItems = jsonValue != null ? JSON.parse(jsonValue) : [];
      setSelectedItems(storedSelectedItems);
      console.log('itemremove')
    } catch (error) {
      console.error('Error retrieving selected items:', error);
    }
  };


  const toggleItemSelection = async (index) => {
    // Check if the item is already selected
    const isItemSelected = selectedItems.includes(index);
  
    // If the item is selected, remove it from selectedItems
    if (isItemSelected) {
      setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== index));
    } else {
      // If the item is not selected, add it to selectedItems
      setSelectedItems((prevSelected) => [...prevSelected, index]);
    }
  
    // Verify that the selected index is within the bounds of the category array
    if (index >= 0 && index < category.length) {
      const selectedItem = category[index];
      console.log('Selected Item:', selectedItem);
      sendSelectedBrandCategory(selectedItem.brand); // Pass the selected item back to the parent component
    } else {
      console.log('Invalid index:', index);
    }
  
    // Save the selected items to AsyncStorage
    try {
      const jsonValue = JSON.stringify(selectedItems);
      await AsyncStorage.setItem('selectedItemsBrands', jsonValue);
      console.log('Selected items saved', selectedItems);
  
      // Set the number of selected items
      const selectedItemCount = selectedItems.length;
      
      // Send the count to another component
      sendSelectedBrandCount(selectedItemCount);
    } catch (error) {
      console.error('Error saving selected items:', error);
    }
  };
  

  const Search = txt => {
    if (txt !== '') {
      let tempData = category.filter(item => {
        const lowerCaseTxt = txt.toLocaleLowerCase();
        return (
          // item.name.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.brand.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 
          // item.category.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          // item.shop.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setcategory(tempData);
    } else {
      setcategory(oldcategory);
    }
  };




  
  return (
    <>
   <View style={styles.topmain}>
      <View style={styles.txttop}>
      <Text style={styles.txt}>
      Eligle una marca
     </Text>
  
      <TouchableOpacity onPress={()=> actionSheetBrand.current?.hide()}>
        <Text style={styles.txtd}>Done</Text>
      </TouchableOpacity>
  </View>
  <View style={styles.searcmain}>
          <View style={styles.srchmainim}>
            <View style={styles.serchm}>
              <Image style={styles.srchim} source={require('../Assets/searchwhite.png')} />
            </View>
            <TextInput
              style={styles.input}
              ref={searchRef} onChangeText={txt => Search(txt)}
              placeholder="Search"
              placeholderTextColor={'#fff'}
            />
          </View>
        </View>
</View>
<ScrollView style={styles.main}>


     {category.map((e,index) => (
      <>
    <TouchableOpacity style={[ styles.mainimgtxt,selectedBrand === e.brand && styles.selectedBrandItem ]}
      key={index} // Use a unique key
      onPress={() => toggleItemSelection(index)}>
      {/* <Image source={{ uri: e.image_link }} style={styles.brandimg} /> */}
      <View style={styles.contentContainer}>
      <Text style={styles.niketxt}>{e.brand}</Text>

           {selectedItems.includes(index) ? 
        <Image style={styles.tickimg} source={require('../Assets/tick.png')} />
        : null
      }
      </View>
    </TouchableOpacity>
       <View style={styles.hrWidth}/>
       </> ))}
      
       
    </ScrollView>
    </>
  )
}
export default CustomBrandcategory
const styles = StyleSheet.create({
  topmain:{
    backgroundColor:"black",
    height:hp('12%'),
  },
  main:{
    // flex:1,
    backgroundColor:"#333333",
    height:hp('90%'),
  },
  txttop:{
flexDirection:'row',
// justifyContent:'center',
// alignItems:"center",
  },
  hrWidth: {
    height: hp('0.12%'),
    width: wp('91.5%'),
    backgroundColor: '#737373',
    marginTop: hp('2.2%'),
    // marginLeft:hp('2.2%'),
    alignSelf: 'center'
  },
  txt:{
    color:'white',
    marginLeft:wp("40%"),
    marginTop:hp('1%'),
  },
  txtd:{
    color:'#DAFDA5',
    marginTop:hp('1%'),
marginLeft:wp("22%"),
  },
  searcmain: {
    backgroundColor: "#333333",
    height: hp('5.5%'),
    borderRadius:10,
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
    color:'#fff',
    // borderWidth: 1,
    // padding: 8,
    // paddingLeft: 18,
    marginLeft: hp('-2.4%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('0.6%'),
    border: 'none',
  },
  brandmain:{
    flexDirection:'row',
    padding:10,
  },
  nikeimgmain:{
    backgroundColor:'white',
    height:hp('4%'),
    width:wp('7%'),
    borderRadius:50,
    marginTop: hp('1%'),
  },
  nikeimg:{
    height:hp('2.5%'),
    width:wp('6%'),
    marginTop: hp('1%'),
    marginLeft: hp('0.4%'),
  },
  niketxt:{
    color:'white',
    fontSize:hp('2.6%'),
    marginTop: hp('1.2%'),
    marginLeft: hp('2%'),
  },
  hrline: {
    height: hp('0.05%'),
    width: wp('96%'),
    backgroundColor: '#fff',
    marginTop: hp('0.6%'),
alignSelf:'center'
  },
  tickimg:{
    height:hp('2.6%'),
    width:wp('6%'),
    marginTop: hp('1.2%'),
    marginRight: wp('8%'),
  },
  brandimg:{
    height:hp('5%'),
    width:wp('2%'),
  },
  mainimgtxt:{
    // flexDirection:'row',
    // // alignItems:'flex-end',
    // justifyContent:"flex-start"
  },
  contentContainer:{
    flexDirection:'row',
    // alignItems:'flex-end',
    justifyContent:'space-between'
  },
})










