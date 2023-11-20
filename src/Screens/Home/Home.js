import { StyleSheet, Text, View, Image, StatusBar, ScrollView, FlatList,ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState,useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainBlack } from '../../Components/ColorConst/ColorConst';
import { LightYellow } from '../../Components/ColorConst/ColorConst';
import { White } from '../../Components/ColorConst/ColorConst';
import { Black } from '../../Components/ColorConst/ColorConst';
import Customcarousel from '../../Components/Customcarousel';
import Topbar from '../../Components/Topbar';
import { Baseurl } from '../../Components/Baseurl';
import Loader from '../../Components/Loader';
import { AuthContext } from '../../Components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import base64 from 'react-native-base64';
import { SafeAreaView } from 'react-native-safe-area-context';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';


const Home = ({ navigation }) => {

  const isCarousel = React.useRef(null)
  const isFocused = useIsFocused();

  const [dataBrand, setDataBrand] = useState([])
  const [ropaData, setRopaData] = useState([])
  const [calzadoData, setCalzadoData] = useState([])
  const [accessoryData, setAccessoryData] = useState([])
  
  const [loaderVisible, setLoaderVisible] = useState(false);
  // console.log(ropaData, 'dataBrand')

  const { userToken,userName,userEmailset,password,userRopaData,emailSet } = useContext(AuthContext);
  const loginCred = base64.encode(userName + ':' + password)
  console.log(emailSet,'emailSet')

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  console.log(latitude)
  
  const CheckPermission = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        if (result === 'granted') GetPosition();
        else {
          request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((newResult) => {
              if (newResult === 'granted') GetPosition();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  
    const GetPosition = () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          console.log('Coords', position.coords);
  
          const { latitude, longitude } = position.coords;
  
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
  };
  
  useEffect(() => {
    CheckPermission();
  }, []);


  const promotions = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/brand/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setDataBrand(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }
  const [displayorderid,setdisplayorderid]=useState()
  // console.log(displayorderid,'displayorderid')

  const [datasaved,setdatasaved]=useState()

  useEffect(() => {
  // const userDataSet = () => {
    if(userToken && emailSet == null || emailSet == undefined ){
    fetch('https://byder-backend-3l2yk.ondigitalocean.app/api/user/'+userName+'/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
      },
    }).then((response) => response.json())
      .then((json) => {
        userEmailset(json.email)
        console.log(json,'json email set')
      })
      .catch((error) => {
    
        console.error(error)
      })
    }
  // }
}, [userToken,emailSet])

  const RopaData = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/category/ROPA/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then(async(json) => {
        setLoaderVisible(false)

        setRopaData(json)
        
        // userRopaData(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }
  const CalzadoData = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/category/CALZADO/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setCalzadoData(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }
  const AccessoryData = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/category/ACCESORIOS/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setAccessoryData(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }

  useEffect(() => {
    // if(isFocused){
    promotions();
    RopaData();
    CalzadoData();
    AccessoryData();
    // }
    // if(userToken){
      // userDataSet()
    // }

  }, [])


  const Brand = ({ item, index }) => {
    // console.log(item.image_link,'item.image_link')

    return (
      <>
        <View style={styles.Mainb}>
          <TouchableOpacity style={styles.txmanb} onPress={() => navigation.navigate('BrandDetail',{brandId:item.brand,datasaved,displayorderid,GetName:item.brand})}>
            <ImageBackground source={{uri:item.image_link}} style={styles.backImg}>
            {/* {item.max_discount == null ? null:
              <View style={styles.discountMain}> 
                <Text style={[styles.txtb, { fontSize: hp('1.6%'), color: '#000' }]}>{item.max_discount}%</Text>
              </View>
            } */}
              <Text style={styles.txtb} numberOfLines={1}>{item.brand.slice(0,12)}</Text>
            </ImageBackground>
          </TouchableOpacity>
          </View>
       
      </>
    )
  }

  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.MainFlex}>
        <Topbar Textheading={'Inicio'} navigation={navigation}  />
        <ScrollView style={{padding:5}}>
        <TouchableOpacity style={styles.main1} onPress={() => navigation.navigate('DiscountScreen')}>
          
            <View>
              <Text style={styles.txt}>REBAJAS</Text>
            </View>
            <View>
              <Image style={styles.jack} source={require('../../Assets/jacket.png')} />
            </View>
          </TouchableOpacity>
          <View style={styles.txtMain2}>
            <View>
              <Text style={styles.txtm}>
                Marcas Destacadas
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('BrandSeeAll')}>
                <Text style={styles.txts}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            horizontal
            data={dataBrand.slice(0, 10)}
            renderItem={({ item, index }) =>
              <Brand item={item} index={index}> </Brand>} />
{/* 
          <View style={styles.txtmnn}>
            <TouchableOpacity style={styles.txttm} onPress={() => navigation.navigate('Search')}>
              <Image style={styles.imm} source={require('../../Assets/view.png')} />
              <Text style={styles.txtve}>Ver Todo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.txttm1} onPress={() => navigation.navigate('Waterdrop')}>
              <Image style={styles.imm} source={require('../../Assets/energy.png')} />
              <Text style={styles.txtti}>Tinder Moda</Text>
            </TouchableOpacity>
          </View> */}

          <Text style={styles.tx2}>
            Articulos cerca de ti
          </Text>

          <View style={styles.txtMain2}>
            <View>
            <Text style={styles.tx}>
            Ropa
          </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('RopaSeeAll')}>
                <Text style={styles.txts}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        
          <View>
            <Customcarousel
              data={ropaData.slice(0,10)}
              navigation={navigation} />
          </View>
          <View style={styles.txtMain2}>
            <View>
            <Text style={styles.tx}>
              Calzado
            </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('CalazoSeeAll')}>
                <Text style={styles.txts}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        
            <Customcarousel data={calzadoData.slice(0,10)} navigation={navigation} />
          <View style={styles.txtMain2}>
            <View>
            <Text style={styles.tx}>
              Accesories
            </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('AccesoriesSeeAll')}>
                <Text style={styles.txts}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>   
            <Customcarousel data={accessoryData.slice(0,10)} navigation={navigation} />
        </ScrollView>
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
        <View style={{marginVertical:hp('3%')}}></View>
      </SafeAreaView>
    </>
  )
}
export default Home
const styles = StyleSheet.create({
  MainFlex: {
    flex: 1,
    backgroundColor: '#15181E',
    // padding: 8,
 
  },
  main1: {
    backgroundColor: LightYellow,
    height: hp('18%'),
    width:wp('96.2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft:hp('0.7%'),
    padding: 20,
  },
  txt: {
    fontSize: hp('3%'),
    fontWeight: '500',
    color: Black,
  },
  jack: {
    height: hp('18%'),
    width: wp('18%'),
  },
  txtMain2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtm: {
    color: White,
    fontSize: hp('2.1%'),
    marginVertical: wp('0.5%'),
    fontWeight: '600',
  marginLeft:hp('0.7%'),
  },
  txts: {
    color: LightYellow,
    fontSize: hp('2%'),
    // marginVertical: wp('1.8%'),
    marginRight:hp('1%'),
  },
  tx: {
    color: White,
    fontSize: hp('2.1%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  card2: {
    marginTop: hp('0.5%'),
    padding: 2,
  },
  tx2: {
    color: White,
    fontSize: hp('2.6%'),
    marginTop: hp('1.2%'),
    marginBottom: wp('3%'),
    fontWeight: '700',
    marginLeft: wp('1.9%'),
  },
  txta: {
    color: LightYellow,
    fontSize: hp('1.6%'),
    marginVertical: wp('1.4%'),
    marginLeft: hp('2%'),
  },
  maina: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  txman: {
    backgroundColor: '#221D28',
    height: hp('4%'),
    width: wp('40%'),
    borderRadius: 5,
    margin: 5,
  },
  txtve: {
    color: LightYellow,
  },
  txtti: {
    color: '#FF531A',
  },
  txtmnn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp('2.6%'),
    marginLeft:hp('-0.7'),
  },
  txttm: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: LightYellow,
    height: hp('5%'),
    width: wp('42.9%'),
    borderRadius: 7
  },
  txttm1: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#FF531A',
    height: hp('5%'),
    width: wp('42.9%'),
    borderRadius: 7
  },
  Mainb: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // marginLeft:hp('-1%')
  },
  backImg: {
    height: hp('10.2%'),
    width: wp('29.25%'),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txmanb: {
    backgroundColor: '#999999',
    height: hp('10.2%'),
    width: wp('29.25%'),
    borderRadius: 5,
    margin: 5,
    // marginLeft:hp('-1%'),
  },
  discountMain: {
    height: hp('3%'),
    width: wp('14%'),
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LightYellow,
    marginTop: hp('-1.6%'),
    alignSelf:'flex-start',
    marginLeft: wp('1.9%'),
    //  margin:10
  },
  txtb: {
    color: White,
    fontSize: hp('1.7%'),
    // alignSelf: 'center',
    alignSelf:"center",
    fontWeight: '600',
    // marginLeft:hp('-2%'),
    // textAlign:"center"
  },
  imm: {
    marginLeft: hp('2.5%'),
    marginRight: hp('1.5%'),
  },
})