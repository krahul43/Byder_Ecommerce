import React, { useState, useRef, useEffect, useContext, createRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, Modal,SafeAreaView, StatusBar } from 'react-native'
import Swiper from 'react-native-deck-swiper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { sidebarBlack, LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst';
import Topbar from '../../Components/Topbar';
import { Baseurl } from '../../Components/Baseurl';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import Filter from '../../Components/Filter';
import CustomSlide from './CustomSlide';
import BottomActionSheet from '../../Components/BottomActionSheet';


const height = Dimensions.get('window').height

const Waterdrop = ({ navigation }) => {

  const [active, setactiveRight] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  // const actionSheetfilterSubCategory = useRef();
  const actionSheetfilterSubCategory = createRef()

  const [selectedSubcategories, setSelectedSubcategories] = useState('');
  const [searchdata, setsearchData] = useState([])
  const productData = () => {
   
    fetch(Baseurl + '/api/product/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
  
        setsearchData(json)
      })
      .catch((error) => {
       
        console.log(error)
      })
  }

  const [subcategory, setSubcategory] = useState([]);
  const filterCategory = () => {
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


  useEffect(() => {
    filterCategory();
  }, []);


  const handleSubcategorySelection = (selectedSubcategories) => {
    // productData()
    console.log("Received Subcategories:", selectedSubcategories);
    const subcategoriesString = selectedSubcategories.join(', '); // Log the received subcategories
    setSelectedSubcategories(subcategoriesString);
  };


  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.mainbackg}>
        <View >
          {/* <Topbar Textheading={'Explore'} navigation={navigation} /> */}
          <View style={styles.Topimg}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>

              <Image style={styles.navi} source={require('../../Assets/navigation.png')} tintColor={LightYellow} />
            </TouchableOpacity>
            <Text style={styles.txtMain}>Explora</Text>

            <TouchableOpacity onPress={() => actionSheetfilterSubCategory.current?.show()}>
              <Image style={styles.filterim} source={require('../../Assets/filter.png')} tintColor="#DAFDA5" />
            </TouchableOpacity>
            <BottomActionSheet ref={actionSheetfilterSubCategory} title={'Title'}>
              <Filter actionSheetfilterSubCategory={actionSheetfilterSubCategory}
              filderDataCat={subcategory}
                onSubcategorySelect={handleSubcategorySelection}
              />

            </BottomActionSheet>

          </View>
        </View>

        <CustomSlide navigation={navigation} FilterSubcategories={selectedSubcategories} apiData={searchdata} />


      </SafeAreaView>

    </>)

}
export default Waterdrop

const styles = StyleSheet.create({
  MainFlex: {
    flex: 1,
    backgroundColor: '#15181e',
    // height:'100%',
    padding: 10
  },
  mainbackg: {
    backgroundColor: '#15181e',
    height: '100%',
  },
  popup: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    zIndex: 999,
  },

  tickIcon: {
    width: 40,
    height: 40,
    tintColor: '#79ff4d',
  },

  popupText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },

  man: {
    backgroundColor: MainBlack,
  },
  Topimg: {
    backgroundColor:'#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    height:hp('5.8%')
  
  },
  txtMain: {
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '700',
    marginLeft: wp("33%")
  },
  backim: {
    width: wp('6%'),
    height: hp('4%'),
    // marginLeft:wp("-2.2%")
  },
  bac: {
    color: LightYellow,
  },
  filterim: {
    width: wp('5%'),
    height: hp('2.5%'),
    marginLeft: wp("32.5%")
  },


  navi: {
    width: wp('8%'),
    height: hp('5%'),
    marginLeft:wp('1.5%')
  },
  card: {
    /* Setting the height according to the screen height, it also could be fixed value or based on percentage. In this example, this worked well on Android and iOS. */
    height: height - 180,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#15181e',
    borderWidth: 0.6,
    borderColor: '#000',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 10,
    shadowOpacity: 0.9,
    elevation: 2,

  },
  container: {
    backgroundColor: '#15181e',
    height: '100%',
  },

  imgView: {
    height: hp('48%'),
    width: wp('89.6%'),
    alignItems: "center",
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  image: {

    height: hp('48%'),
    width: wp('89%')
  },
  photoDescriptionContainer: {
    paddingLeft: 15,
    paddingTop: 6

  },
  text: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: "700",
    fontFamily: 'Avenir',
    textShadowColor: 'black',
    textShadowRadius: 10,
  },
  textbran: {
    fontSize: hp('1.5%'),
    color: '#737373',
    fontWeight: "700",
    fontFamily: 'Avenir',
    textShadowColor: 'black',
    textShadowRadius: 10,
  },
  txtprlocation: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: hp('0.3%')
  },

  pricetxt: {
    fontSize: hp('2.4%'),
    color: LightYellow,
    fontWeight: "600",
    fontFamily: 'Avenir',
    textShadowColor: 'black',
  },
  locationtxt: {
    fontSize: hp('2.4%'),
    color: 'white',
    fontWeight: "600",
    fontFamily: 'Avenir',
    textShadowColor: 'black',
    marginLeft: wp('19%')
  },
  hrWidth: {
    height: hp('0.4%'),
    width: wp('79.5%'),
    backgroundColor: '#808080',
    marginVertical: hp('1.5%')
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: wp('5.5%')
  },
  viewNext: {
    height: hp('5.4%'),
    width: wp('38%'),
    backgroundColor: '#330000',
    marginVertical: hp('1.5%'),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
})