import { StyleSheet, Text, View, StatusBar, ScrollView, Image, TouchableOpacity, TextInput, ImageBackground, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Topbarback from '../../Components/Topbarback';
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from '../../Components/Baseurl';
import Loader from '../../Components/Loader';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';


const BrandDetail = ({ navigation, route }) => {

  const { brandId, GetName } = route.params
  const [text, onChangeText] = React.useState('');
  const [number, onChangeNumber] = React.useState('');

  const [dataBrand, setDataBrand] = useState([])
  console.log(dataBrand, 'dataBrand')
  const [loaderVisible, setLoaderVisible] = useState(false);
  // console.log(dataBrand, 'dataBrand')


  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  // console.log(latitude)
  // console.log(longitude)

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



  const promotions = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/brand/' + brandId + '/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setDataBrand(json)
        setFilteredData(json);
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }


  useEffect(() => {
    promotions();
    CheckPermission()

  }, [])

  const [showRedHeart, setShowRedHeart] = useState(false);

  const toggleImage = () => {
    setShowRedHeart((prevState) => !prevState);
  };




  const [likedCards, setLikedCards] = useState({});

  const handleHeartPress = (item) => {
    // Check if userName or password is null
    if (!userName || !password) {
      // Navigate to login screen
      navigation.navigate('Login'); // Replace 'Login' with your actual login screen name
      return;
    }

    // Rest of the heart icon press logic
    if (likedCards[item.product_id]) {
      deleteData(item.product_id);
    } else {
      likeData(item.product_id);
    }
  };


  const { userToken, userName, password } = useContext(AuthContext);
  console.log(userName, 'userName')
  console.log(password, 'password')

  const loginCred = base64.encode(userName + ':' + password)

  const likeData = (product_id) => {

    const url = product_id;
    const updatedUrl = url.replace(".html", "");
    console.log(updatedUrl, 'updatedUrl')
    setLikedCards((prevLikedCards) => ({
      ...prevLikedCards,
      [product_id]: !prevLikedCards[product_id], // Toggle the liked status
    }));
    let formData = new FormData();
    formData.append('product_id', product_id)
    formData.append('username', userName)

    fetch(Baseurl + '/api/user/' + userName + '/wishlist/add/' + product_id + '/', {
      method: 'Post',
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
        console.log(response, "like  Response");

      }).catch((err) => {

        console.log(err)
      })
    })

  }
  //delete api
  const deleteData = (product_id) => {
    setLikedCards((prevLikedCards) => ({
      ...prevLikedCards,
      [product_id]: !prevLikedCards[product_id], // Toggle the liked status
    }));
    let formData = new FormData();
    formData.append('product_id', product_id)
    formData.append('username', userName)

    fetch(Baseurl + '/api/user/' + userName + '/wishlist/delete/' + product_id + '/', {
      method: 'Delete',
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
        console.log(response, "delete  Response");

      }).catch((err) => {

        console.log(err)
      })
    })

  }

  const [filteredData, setFilteredData] = useState([]);
  const filterBrands = (searchText) => {
    if (searchText === '') {
      setFilteredData(dataBrand);
    } else {
      const filtered = dataBrand.filter((item) => {
        const itemNameMatches = item.name.toLowerCase().includes(searchText.toLowerCase());
        const brandNameMatches = item.category.toLowerCase().includes(searchText.toLowerCase());
        return itemNameMatches || brandNameMatches;
      });
      setFilteredData(filtered);
    }
  };


  const Getdata = ({ item, index }) => {
    const imageUrls = item.images.split('|');
    const imagee = imageUrls[0]
    const [distace, setDistance] = useState([])
    const [shoplatitude, shoplongitude] = item.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const [address, setAddress] = useState(null);

    const distanceGet = () => {
      const toRadian = n => (n * Math.PI) / 180;
      let lat2 = shoplatitude;
      let lon2 = shoplongitude;
      let lat1 = latitude;
      let lon1 = longitude;

      // console.log(`Input: (${lat1}, ${lon1}) === (${lat2}, ${lon2})`);

      let R = 6371;  // km
      let x1 = lat2 - lat1;
      let dLat = toRadian(x1);
      let x2 = lon2 - lon1;
      let dLon = toRadian(x2);
      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      setDistance((d / 1000).toFixed(1));
      // console.log("Distance (in km):", d);

      return d;
    }

    const getAdress = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // setLocation({ latitude, longitude });

          // Use Nominatim API for reverse geocoding
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${shoplatitude}&lon=${shoplongitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.display_name) {
                let dataAddress = data.display_name.split(',');
                setAddress(dataAddress[4].slice(0, 10));
              } else {
                setAddress('not found');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

    useEffect(() => {
      distanceGet()
      getAdress()
    }, [])

    console.log(item, 'itemitemitem')

    return (<>

      <View style={{ padding: 6 }}>
        <View style={styles.backFlat}>
          <View style={styles.maincard}>
            <View style={styles.Imagecontainer}>

              {/* {imageUrls.map((imageUrl, index) => ( */}
              <ImageBackground key={index} source={{ uri: imagee }} style={styles.image} >
                {item.discount == null ? null :
                  <View style={styles.per}>
                    <Text style={styles.txtper}>{item.discount}%</Text>
                  </View>
                }
                <View />
                {/* <TouchableOpacity onPress={()=>likeData(item.product_id)}>
                   <Image style={styles.heartim} source={require('../Assets/heart.png')} />
                   <Image style={styles.heartim} source={heartImage} />
                   </TouchableOpacity> */}

                <TouchableOpacity onPress={() => handleHeartPress(item)}>
                  {/* Conditionally render the heart image based on liked status */}
                  {likedCards[item.product_id] == true ? (
                    <Image style={styles.heartim} source={require('../../Assets/redheart.png')} />
                  ) : (
                    <Image style={styles.heartim} source={require('../../Assets/heart.png')} />
                  )}
                </TouchableOpacity>
              </ImageBackground>


              {/* ))} */}
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('DetailSearch', { item, distace })}>
              <View style={{ marginLeft: hp('2%') }}>
                <Text style={styles.textColor}>{item.brand}</Text>
                <Text style={styles.txtclr} numberOfLines={2}>{item.name.slice(0, 14)}...</Text>
                <Text style={styles.txtdlr}>{item.current_price} €</Text>
                <View style={styles.maintx}>
                  <Text style={styles.txtclr}>{item.area}</Text>
                  <Text style={styles.txtclr1}>{distace} km</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    </>)
  };
  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.container}>
        <Topbarback Textheading={GetName} navigation={navigation} />

        <View style={styles.searcmain}>
          <View style={styles.srchmainim}>
            <View style={styles.serchm}>
              <Image style={styles.srchim} source={require('../../Assets/searchwhite.png')} />
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                onChangeText(text);
                filterBrands(text);
              }}

              placeholder="Search"
              placeholderTextColor={'white'}
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.main}>

            {filteredData?.length > 0 &&
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={filteredData}
                numColumns={2}
                renderItem={({ item, index }) =>
                  (<Getdata item={item} index={index}></Getdata>)} />
            }
            {  filteredData?.length === 0 && loaderVisible == false &&
              <Text style={{ color: "#fff" }}>No data found.</Text>
            }

          </View>
          <View style={{ marginVertical: hp('4%') }} />
          <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
        </ScrollView>

      </SafeAreaView>
    </>
  )
}
export default BrandDetail
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15181E',
  },
  searcmain: {
    backgroundColor: MainBlack,
    height: hp('7%'),
  },
  srchmainim: {
    flexDirection: 'row',
  },
  backFlat: {

    // backgroundColor: '#15181E',
    // height: 'auto'
  },
  serchm: {
    height: 36,
    backgroundColor: '#373739',
    width: wp('12%'),
    marginTop: hp('0.6%'),
    marginLeft: hp('1.5%'),
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
    width: wp('87%'),
    color: White,
    // borderWidth: 1,
    // padding: 8,
    // paddingLeft: 18,
    marginLeft: hp('-2.4%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('0.6%'),
    border: 'none',
  },
  main: {

    backgroundColor: '#15181e',
    marginTop: 10,
    // height: '100%',
    // width: wp('100%'),
  },
  maincard: {
    width: wp('44%'),
    borderRadius: 10,
    height: hp('33.2%'),
    backgroundColor: '#1e222b',
    marginBottom: wp('2%'),
    marginLeft: hp('0.6%'),
  },
  Imagecontainer: {
    width: wp('43.8%'),
    height: hp('19.5%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  mainpr: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('-10.2%'),
  },
  per: {
    backgroundColor: LightYellow,
    width: wp('10.8%'),
    height: hp('2.5%'),
    borderRadius: 40,
    marginLeft: hp('0.8%'),
    marginTop: hp('0.8%'),
    alignItems: "center",
    justifyContent: "center"
  },
  txtper: {
    fontSize: 12,
    color: "#000"
  },
  heartim: {
    height: hp('3%'),
    width: wp('6%'),
    // alignContent:'flex-end',
    marginRight: hp('0.8%'),
    marginTop: hp('0.8%'),
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('43.8%'),
    height: hp('19.9%'),
    //  marginLeft:hp('1.3%'),
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    borderRadius: 30,
    position: 'absolute',
    // aspectRatio: 1,
  },
  textColor: {
    color: LightYellow,
    fontWeight: '500',
    fontSize: hp('1.9%'),
    marginTop: hp('0.4%'),
  },
  txtclr: {
    color: White,
    fontWeight: '500',
    fontSize: hp('1.95%'),
    marginTop: hp('0.1%'),
  },
  txtdlr: {
    color: '#616267',
    fontWeight: '500',
    fontSize: hp('1.9%'),
    marginTop: hp('0.1%'),
  },
  maintx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtclr1: {
    color: White,
    fontWeight: '500',
    fontSize: hp('1.8%'),
    marginRight: hp('2%'),
  },
  headingtxt: {
    color: 'white',
    fontWeight: '500',
    fontSize: hp('2.2%'),
    marginLeft: hp('1.5%'),
    // marginVertical: hp('0.4%'),
  },
})