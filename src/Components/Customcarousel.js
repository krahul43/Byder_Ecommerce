import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, PermissionsAndroid,Platform, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useContext, useEffect, } from 'react'
import { Black, LightYellow, White } from './ColorConst/ColorConst';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from './Baseurl';
import { AuthContext } from './AuthContext';
import base64 from 'react-native-base64'
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const Customcarousel = ({ data, navigation }) => {

  console.log(data)

  const { userToken, userName, password } = useContext(AuthContext);
  const loginCred = base64.encode(userName + ':' + password)
  const [checklikedCards, setCheckLikedCards] = useState([]);

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

  useEffect(() => {
    CheckPermission();
  }, []);

  const Getdata = ({ item, index }) => {

    // console.log(imagesLink, '1111item')
    const imageUrls = item.images.split('|');
    const imagee = imageUrls[0];
    const [likedCards, setLikedCards] = useState([]);
    const [wishlist, setWhislist] = useState([])
    const [distace, setDistance] = useState([])
    const [shoplatitude, shoplongitude] = item.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const [address, setAddress] = useState(null);

    // const addressComponents = address.split(',');
// const mainArea = address[address.length - 2].trim();

    console.log(address,'address')
    // console.log(shoplatitude,'shoplatitude')
    const Datawhislist = () => {

      fetch(Baseurl + '/api/user/' + userName + '/wishlist/', {
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
   
    //  console.log(item,'item')
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
      // if (likedCards[item.product_id]) {
      //   // If the item is already liked (redheart), call deleteData function
      //   deleteData(item.product_id);
      // } else {
      //   // If the item is not liked (heart), call likeData function
      //   likeData(item.product_id);
      // }
    };

    const likeData = (product_id) => {
      const url = product_id;
      const updatedUrl = url.replace(".html", "");
      console.log(updatedUrl, 'updatedUrl')
      setLikedCards((prevLikedCards) => ({
        ...prevLikedCards,
        [product_id]: !prevLikedCards[product_id], // Toggle the liked status
      }));
      let formData = new FormData();
      formData.append('product_id', data.product_id)
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
      formData.append('product_id', data.product_id)
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
                setAddress(dataAddress[4]);
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
      if (userName || password) {
        Datawhislist();
        distanceGet();
        getAdress()
      }
    }, [])

    return (<>
      <View style={{ padding: 4 }}>
        <TouchableOpacity onPress={() => navigation.navigate('DetailSearch', { item,distace,ScreenNavigation: "Home" })} style={styles.maincard}>
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
                  <Image style={styles.heartim} source={require('../Assets/redheart.png')} />
                ) : (
                  <Image style={styles.heartim} source={require('../Assets/heart.png')} />
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => likeData(item.product_id)}>
            
                {likedCards[item.product_id] ? (
                  <Image style={styles.heartim} source={require('../Assets/redheart.png')} />
                ) : (
                  <Image style={styles.heartim} source={require('../Assets/heart.png')} />
                )}
              </TouchableOpacity> */}
            </ImageBackground>
            {/* ))} */}

          </View>
          <View>
            <View style={{ marginLeft: hp('2%') }}>
              <Text style={styles.textColor}>{item.brand}</Text>
              <Text style={styles.txtclr} numberOfLines={2}>{item.name.slice(0, 14)}...</Text>
              <Text style={styles.txtdlr}>{item.current_price} €</Text>
              <View style={styles.maintx}>
                <Text style={[styles.txtclr,{fontSize:hp('1.7%')}]} numberOfLines={1}>{item.area}</Text>
                <Text style={styles.txtclr1}>{distace} km</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* <View style={{marginVertical:hp('4%')}}></View> */}
      </View>
    </>)
  };
  return (
    <>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) =>
          (<Getdata item={item} index={index}></Getdata>)} />

    </>
  )
}
export default Customcarousel
const styles = StyleSheet.create({

  maincard: {
    width: wp('45.8%'),
    borderRadius: 10,
    height: hp('33.2%'),
    backgroundColor: '#1e222b',
    marginBottom: wp('2%'),
    marginLeft: hp('0.3%'),
  },
  Imagecontainer: {
    width: wp('45.6%'),
    height: hp('20%'),
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
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('-10.2%'),
  },
  per: {
    backgroundColor: LightYellow,
    width: wp('10.8%'),
    height: hp('2.5%'),
    borderRadius: 40,
    marginLeft: hp('1.2%'),
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
    marginRight: hp('1.4%'),
    marginTop: hp('0.8%'),
  },

  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('45.6%'),
    height: hp('20%'),
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
    fontSize: hp('1.9%'),
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
})





