import { StyleSheet, Text, View, StatusBar, Image, ImageBackground, SafeAreaView,TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, createRef, useContext } from 'react'
import { LightYellow, White,MainBlack } from '../../Components/ColorConst/ColorConst';
import { Baseurl } from '../../Components/Baseurl';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../Components/Loader';
import Topbarback from '../../Components/Topbarback';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';


const AccesoriesSeeAll = ({data, navigation}) => {

  const [loaderVisible, setLoaderVisible] = useState(false);
  const [likedCards, setLikedCards] = useState({});
  const searchRef = useRef()




  const { userToken, userName, password } = useContext(AuthContext);
  console.log(userName, 'userName')
  console.log(password, 'password')

  const loginCred = base64.encode(userName + ':' + password)




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







  const [accesdoData, setaccesdoData] = useState([])
  const [accesdoOldData, setaccesdoOldData] = useState([])
  console.log(accesdoData, 'accesdoData')
  const AccesoriesData = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/category/ACCESORIOS/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setaccesdoData(json)
        setaccesdoOldData(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }
  useEffect(() => {
    AccesoriesData();
    CheckPermission()
  }, [])

  const Search = txt => {
    if (txt !== '') {
      let tempData = accesdoData.filter(item => {
        const lowerCaseTxt = txt.toLocaleLowerCase();
        return (
          item.name.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          // item.brand.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.category.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.shop.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setaccesdoData(tempData);
    } else {
      setaccesdoData(accesdoOldData);
    }
  };

  const Getdata = ({ item, index }) => {
    const imageUrls = item.images.split('|');
    const [likedCards, setLikedCards] = useState([]);
    const[wishlist,setWhislist]=useState([])
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

    const getAdress=()=>{
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
             let dataAddress=   data.display_name.split(',');
                setAddress(dataAddress[4].slice(0,10));
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
          "Referer": "https://byder-backend-3l2yk.ondigitalocean.app",
          "Authorization": `Basic ${loginCred}`,
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
          "Referer": "https://byder-backend-3l2yk.ondigitalocean.app",
          "Authorization": `Basic ${loginCred}`,
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

    const handleHeartPress = (item) => {

      if (!userName || !password) {
        // Navigate to login screen
        navigation.navigate('Login'); // Replace 'Login' with your actual login screen name
        return;
      }

      
      if (likedCards[item.product_id]) {
        // If the item is already liked (redheart), call deleteData function
        deleteData(item.product_id);
      } else {
        // If the item is not liked (heart), call likeData function
        likeData(item.product_id);
      }
    };

    const Datawhislist = () => {
    
      fetch(Baseurl + '/api/user/'+ userName +'/wishlist/', {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": `Basic ${loginCred}`,
        },
      }).then((response) => response.json())
        .then((json) => {
         
          // setWhislist(json.wishlist_products)
    
          const wishlistProductIds = json.wishlist_products.map(item => item.product_id);
          setWhislist(wishlistProductIds);
    
          // Create a dictionary of liked products
          const likedProducts = {};
          wishlistProductIds.forEach(product_id => {
            likedProducts[product_id] = true;
          });
    
          setLikedCards(likedProducts); // Set likedCards based on wishlistProductIds
        })
        .catch((error) => {
      
          console.error(error)
        })
    }
    useEffect(() => {
      if (userName || password) {
      Datawhislist();
      distanceGet();
      getAdress();
      }
    }, [])
  
    return (<>

      <View style={styles.MainFlx}>
        <View style={styles.maincard}>
          <View style={styles.Imagecontainer}>

            <View style={styles.Imagecontainer}>

              {imageUrls.map((imageUrl, index) => (

                <ImageBackground key={index} source={{ uri: imageUrl }} style={styles.image} >
                  {item.discount == null ? null :
                    <View style={styles.per}>
                      <Text style={styles.txtper}>{item.discount}%</Text>
                    </View>
                  }
                  <View />
                  <TouchableOpacity onPress={() => handleHeartPress(item)}>

                    {likedCards[item.product_id] ? (
                      <Image style={styles.heartim} source={require('../../Assets/redheart.png')} />
                    ) : (
                      <Image style={styles.heartim} source={require('../../Assets/heart.png')} />
                    )}
                  </TouchableOpacity>
                </ImageBackground>

              ))}

            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DetailSearch', { item,distace })}>
            <View style={{ marginLeft: hp('2%') }}>
              <Text style={styles.textColor}>{item.brand}</Text>
              <Text style={styles.txtclr} numberOfLines={2}>{item.name.slice(0,14)}...</Text>
              <Text style={styles.txtdlr}>{item.current_price} €</Text>
              <View style={styles.maintx}>
                <Text style={styles.txtclr} numberOfLines={1}>{address}</Text>
                <Text style={styles.txtclr1}>{distace} km</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

    </>)
  };



  return (
    <>
      <SafeAreaView style={styles.MainFlx2}>

        <Topbarback navigation={navigation} />
        <View style={styles.searcmain}>
          <View style={styles.srchmainim}>
            <View style={styles.serchm}>
              <Image style={styles.srchim} source={require('../../Assets/searchwhite.png')} />
            </View>
            <TextInput
             ref={searchRef} 
              style={styles.input}
              onChangeText={txt => Search(txt)}
              placeholder="Search"
              placeholderTextColor={'white'}
            />
          </View>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={accesdoData} // Use the filtered data instead of `searchdata`
          // data={genderStatus === 'HOMBRE' ? maleData : femaleData}
          numColumns={2}
          renderItem={({ item, index }) => <Getdata item={item} index={index} />}
        // ... Other FlatList props ...
        // renderItem={({ item, index }) => <Getdata item={item} index={index} data={genderStatus === 'HOMBRE' ? maleData : femaleData} />}
        />
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
   
      </SafeAreaView>
    </>
  )
}

export default AccesoriesSeeAll

const styles = StyleSheet.create({
  MainFlx: {
    flex: 1,
    backgroundColor: '#15181e',
    padding: 10
  },
  MainFlx2: {
    flex: 1,
    backgroundColor: '#15181e',
    // padding: 10
  },
  backFlat: {
    backgroundColor: '#15181E',
    height: '100%'
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
    width: wp('89%'),
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
  maincard: {
    width: wp('46%'),
    borderRadius: 10,
    height: hp('33.2%'),
    backgroundColor: '#1e222b',
    marginBottom: wp('2%'),
  },
  Imagecontainer: {
    width: wp('45.8%'),
    height: hp('20%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('45.8%'),
    height: hp('19.9%'),
    //  marginLeft:hp('1.3%'),
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    borderRadius: 30,
    position: 'absolute',
    // aspectRatio: 1,
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
    color: '#616267',
  },
  heartim: {
    height: hp('3%'),
    width: wp('6.1%'),
    // alignContent:'flex-end',
    marginRight: hp('1.2%'),
    marginTop: hp('0.8%'),
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
    fontSize: hp('2.1%'),
    marginTop: hp('0.1%'),
  },
  txtclr1: {
    color: White,
    fontWeight: '500',
    fontSize: hp('1.8%'),
    marginRight: hp('2%'),
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
})