import { StyleSheet, Text, View, StatusBar, ScrollView, Dimensions, Modal, Image, SafeAreaView } from 'react-native'
import React, { useEffect,useState, createRef, useContext } from 'react'
import Topbarback from '../../Components/Topbarback';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Customcategory from '../../Components/Customcategory';
import BottomActionSheet from '../../Components/BottomActionSheet';
import Loader from '../../Components/Loader';
import { Baseurl } from '../../Components/Baseurl';
import base64 from 'react-native-base64';
import { AuthContext } from '../../Components/AuthContext';
import CustomBrandcategory from '../../Components/CustomBrandcategory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const EditPrefrence = ({ navigation }) => {

  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [dataprofile, setDataprofile] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  const actionSheetBrand = createRef()
  const [loaderVisible, setLoaderVisible] = useState(false);

  const { userToken, userName, password, emailSet, userProfilePic } = useContext(AuthContext);
  const loginCred = base64.encode(userName + ':' + password)

  console.log( dataprofile,'dataprofile')
  console.log( selectedGender,'selectedGender')

  const handleGenderClick = (gender) => {
    // Check if the gender is already selected, and toggle its selection
    if (selectedGender.includes(gender)) {
      setSelectedGender(selectedGender.filter((item) => item !== gender));
    } else {
      setSelectedGender([...selectedGender, gender]);
    }
  };

  const isGenderSelected = (gender) => {
    return selectedGender.includes(gender);
  };

  const closeModal = () => {
    // setSelectedGender([]);
    setModalVisible(false);
    setModalText('');
    setModalVisible(false);
  };

  const openModalWithText = (text) => {
    setSelectedGender([]);
    setModalText(text);
    setModalVisible(true);
    AsyncStorage.removeItem('selectedItemsBrands');
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const Dataprofile = () => {
  
    fetch(Baseurl +'/api/user/'+ userName +'/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
      },
    }).then((response) => response.json())
      .then((json) => {
        // const resultString = json.gender.join('');
        const resultSlice = json.gender.slice(1, -1).join('');
      let finalValue=  resultSlice.replace(/^"|"$/g, '').split(','); 
      const parsedGenders = finalValue.map((gender) => gender.replace(/\\"/g, ''));
        setDataprofile(parsedGenders)
        setSelectedGender(parsedGenders)
      
      })
      .catch((error) => {
      
        console.error(error)
      })
  }

  // bottomsheet brand data
  const [categoryBrand, setcategoryBrand] = useState([]);
  const brandcategory=()=>{
    setLoaderVisible(true)
    fetch(Baseurl + '/api/brand/',{
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
    .then((json) => {
      setLoaderVisible(false)
      setcategoryBrand(json.slice(0,50))
    })
    .catch((error) => {
      setLoaderVisible(false)
      console.error(error)
    })
  };


useEffect(() => {
 
    Dataprofile();
    brandcategory()
  }, [])





    // Brand
    const [selectedBrandCategory, setSelectedBrandCategory] = useState(null);
    const handleSelectedBrandCategory = (brand) => {
      // console.log("Received Selected Brand:", brand);
      setSelectedBrandCategory(brand);
    };
    const [selectedBrandCount, setSelectedBrandCount] = useState(0);
  
    const handleSelectedBrandCount = (count) => {
      setSelectedBrandCount(count);
    };

  const PreferenceUpdtae = () => {
    let formData = new FormData();
    formData.append('gender  ', selectedGender)

    fetch(Baseurl + '/api/user/' + userName + '/', {
      method: 'Put',
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
        "Referer": "https://byder-backend-3l2yk.ondigitalocean.app",
        "X-CSRFTOKEN": userToken, // Include the CSRF token in the headers
      },
      body: formData
    }).then((result) => {
      result.json().then((response) => {
        setLoaderVisible(false)
        setModalText('Preferencias actualizadas');
        setModalVisible(true);
        // setSelectedState(true)
        setTimeout(() => {
          navigation.goBack()
          setModalVisible(false);
        }, 2000);

        console.log(response, "gender api  Response");
        // navigation.navigate('Profile')

      }).catch((err) => {
        setLoaderVisible(false)
        console.log(err)
      })
    })
  }


  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.main}>
        <Topbarback Textheading={'Mis Preferencias'} navigation={navigation} />
        <ScrollView>
          <View >
            <Text style={styles.txt}>Rellenando tus preferencias,Ias {'\n'}
              prendas que veras dentro de la app {'\n'}seran mas relevantes para tus gustos.</Text>
            <View style={styles.hrline} />
            <Text style={styles.txtq}>
              Quiero ver prendas de
            </Text>

            <View style={styles.mainnn}>
             
              <TouchableOpacity style={isGenderSelected('HOMBRE') ? styles.hom : styles.muj} onPress={() => handleGenderClick('HOMBRE')}>
                <Text style={isGenderSelected('HOMBRE') ? styles.homtx : styles.mujtx}>HOMBRE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={isGenderSelected('MUJER') ? styles.hom : styles.muj} onPress={() => handleGenderClick('MUJER')}>
                <Text style={isGenderSelected('MUJER') ? styles.homtx : styles.mujtx}>MUJER</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.txtq}>
              Elige tusmarcas favoritas
            </Text>
            <TouchableOpacity onPress={() => actionSheetBrand.current?.show()}>
              <View style={styles.ree}>
                <View style={styles.r1}>
                </View>
                <Text style={{ color: White,marginRight:wp('38%') }}>{selectedBrandCount >1 ? selectedBrandCount + ' items': selectedBrandCategory}</Text>
                {/* <Image style={styles.de} source={require('../../Assets/delete.png')} /> */}
              </View>
            </TouchableOpacity>
            <BottomActionSheet ref={actionSheetBrand} title={'Title'}>
            < CustomBrandcategory actionSheetBrand={actionSheetBrand}
                    BrandDataApi={categoryBrand}
                    sendSelectedBrandCategory={handleSelectedBrandCategory}
                    sendSelectedBrandCount={handleSelectedBrandCount} />
            </BottomActionSheet>
            <View style={styles.hrline} />
            <TouchableOpacity style={styles.ac} onPress={() => PreferenceUpdtae()}>
              <Image style={styles.ch} source={require('../../Assets/tick.png')} />
              <Text style={styles.actx}>
                Actualizar
              </Text>
            </TouchableOpacity>
            {selectedGender.length > 0  &&
              <TouchableOpacity style={styles.re} onPress={() => openModalWithText('Preferencias restauradas')}>
                <Image style={styles.de} source={require('../../Assets/delete.png')} />
                <Text style={styles.retx}>
                  Restaurar preferencias
                </Text>
              </TouchableOpacity>
            }
          </View>
        </ScrollView>
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >

        <View style={styles.containerModal}>
          <View style={styles.modalMain}>
            <Image source={require('../../Assets/wishlistick.png')} tintColor="#DAFDA5" style={{ height: 100, width: 100 }} />
            <Text style={styles.txtaddedFav}>{modalText}</Text>
          </View>
        </View>

      </Modal>

      
    </>
  )
}
export default EditPrefrence
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#15181e',
  },
  txt: {
    color: White,
    fontSize: hp('2.6%'),
    marginLeft: hp('2%'),
    fontWeight: '600',
    marginVertical: hp('0.6%'),
  },
  hrline: {
    height: hp('0.1%'),
    width: wp('92%'),
    backgroundColor: '#999999',
    marginTop: hp('1.5%'),
    alignSelf: 'center',
  },
  txtq: {
    color: '#999999',
    padding: 14,
  },
  ll: {
    backgroundColor: '#333333',
    height: hp('4%'),
    width: wp('10%'),
    marginLeft: hp('2%'),
    borderRadius: 20,
  },
  mi: {
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  hom: {
    backgroundColor: LightYellow,
    height: hp('4%'),
    width: wp('20%'),
    marginLeft: hp('0.5%'),
    borderRadius: 20,
  },
  homtx: {
    color: MainBlack,
    fontWeight: '600',
    marginTop: hp('0.7%'),
    alignSelf: 'center',
  },
  mainnn: {
    flexDirection: 'row',
    marginLeft: wp('2.2%')
  },
  muj: {
    backgroundColor: '#333333',
    height: hp('4%'),
    width: wp('20%'),
    marginLeft: hp('0.5%'),
    borderRadius: 20,
  },
  mujtx: {
    color: White,
    fontWeight: '600',
    marginTop: hp('0.7%'),
    alignSelf: 'center',
  },
  ac: {
    backgroundColor: '#333333',
    height: hp('6%'),
    width: wp('95%'),
    marginLeft: hp('0.5%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('1.9%'),
    flexDirection: 'row',
  },
  actx: {
    color: LightYellow,
    fontSize: hp('2.3%'),
    fontWeight: '600',
    marginTop: hp('0.3%'),
    marginLeft: hp('1.5%'),
    alignSelf: 'center',
  },
  ch: {
    alignSelf: 'center',
    marginTop: hp('0.3%'),
    width: wp('5.2%'),
    height: hp('2.6%'),
    marginLeft: hp('16.5%'),
  },
  retx: {
    color: '#FF531A',
    fontSize: hp('2.3%'),
    fontWeight: '600',
    marginTop: hp('0.1%'),
    marginLeft: hp('1.5%'),
    alignSelf: 'center',
  },
  de: {
    alignSelf: 'center',
    marginTop: hp('0.3%'),
    width: wp('5.5%'),
    marginLeft: hp('10.5%'),
    height: hp('3%'),
  },
  re: {
    backgroundColor: '#333333',
    height: hp('6%'),
    width: wp('95%'),
    marginLeft: hp('0.5%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('1.9%'),
    flexDirection: 'row',
  },
  r1: {
    backgroundColor: '#595959',
    height: hp('4.5%'),
    width: wp('9%'),
    borderRadius: 30,
    alignSelf: 'center',
  },
  ree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    padding: 12,
    height: hp('6%'),
    width: wp('95%'),
    borderRadius: 10,
    alignSelf: 'center',
  },


  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalMain: {
    // backgroundColor: "#fff",
    marginTop: hp('-4%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: HEIGHT * 0.2,
    width: WIDTH * 0.58,
    // borderWidth: 0.25,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'

  },

  txtaddedFav: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "600"
  },
})

