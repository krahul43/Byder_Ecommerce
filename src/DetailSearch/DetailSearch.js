import { StyleSheet, Text, View, StatusBar, Image, BackHandler, FlatList, Alert, TouchableOpacity, ScrollView, Dimensions, ImageBackground, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

import Swiper from 'react-native-swiper';
import { AuthContext } from '../Components/AuthContext';
import { LightYellow } from '../Components/ColorConst/ColorConst'
import { MainBlack } from '../Components/ColorConst/ColorConst'
import { White } from '../Components/ColorConst/ColorConst'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { style } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes'
import Topbarback from '../Components/Topbarback'
import base64 from 'react-native-base64';
import { Baseurl } from '../Components/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useIsFocused } from '@react-navigation/native';



const DetailSearch = ({ navigation, route, data, onHeartPress }) => {
  const { item, ScreenNavigation, displayorderid, distace, datasaved } = route.params

  console.log(item, 'item')
  // console.log(displayorderid, 'displayorderid')
  // console.log(datasaved, 'datasaved')
  const sizesArray = item.sizes.split('|');
  const isFocused = useIsFocused();
  // console.log(item, '111item')


  const [likedCards, setLikedCards] = useState([]);

  const [wishlist, setWhislist] = useState([])
  const { userToken, userName, password } = useContext(AuthContext);
  // console.log(userName, 'userName')
  // console.log(userToken, 'userToken')

  const loginCred = base64.encode(userName + ':' + password)


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
  useEffect(() => {
    Datawhislist();
  }, [])

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

  const likeData = (product_id) => {
    const url = product_id;
    const updatedUrl = url.replace(".html", "");
    // console.log(updatedUrl, 'updatedUrl')
    setLikedCards((prevLikedCards) => ({
      ...prevLikedCards,
      [product_id]: !prevLikedCards[product_id], // Toggle the liked status
    }));
    let formData = new FormData();
    formData.append('product_id', item.product_id)
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
    formData.append('product_id', item.product_id)
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
  const [similarproduct, setsimilarproduct] = useState([]);
  console.log(similarproduct, 'similarproduct');

  const Similar = () => {
    fetch(Baseurl + '/api/product/similar/' + item.product_id + '/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setsimilarproduct(json)
      })
      .catch((error) => {
        console.error(error)
      })
  };
  useEffect(() => {
    Similar();
    //   console.log("Product ID:", item.product_id);
  }, [])

  const Similardata = ({ item, index }) => {
    const imageUrls = item.images.split('|');
    const similarimage = imageUrls[0]
    const [fav, setFav] = useState(false)

    return (<>
      <View style={styles.maina}>
        <View style={styles.txman}>
          <TouchableOpacity onPress={() => navigation.navigate('RelatedProducts', { item, distace })}>
            <View style={styles.imgfl}>
              <View >
                <ImageBackground style={styles.img1} source={{ uri: similarimage }}>
                  {/* <TouchableOpacity onPress={() => setFav(!fav)}>
                    {fav ?
                      <Image style={styles.imgh} source={require('../Assets/redheart.png')} />
                      :
                      <Image style={styles.imgh} source={require('../Assets/heart.png')} />
                    }
                  </TouchableOpacity> */}
                </ImageBackground>
                <Text style={styles.txtonimg} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.txton7}>{item.current_price} €</Text>
              </View>

            </View>
          </TouchableOpacity>
        </View>

      </View>
    </>)
  };

  const [selectedSize, setSelectedSize] = useState([]);
  // console.log(selectedSize,'selectedSize');

  // const handleSizeClick = (size) => {
  //   setSelectedSize(size);
  //   // console.log("Selected Size:", size);
  // };
  console.log(selectedSize,'selectedSize')

  const handleSizeClick = (size) => {
    if (selectedSize.includes(size)) {
      setSelectedSize(selectedSize.filter((selectedSizes) => selectedSizes !== size));
    } else {
      setSelectedSize([...selectedSize, size]);
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to format the date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };


  const [orderid, setOrderid] = useState(null);
  const [imageTicket, setImageTicket] = useState(null);
  // const displayorderid=orderid
  console.log(orderid, 'orderid detail')


  useEffect(() => {
    const retrieveOrderDetailsFromAsyncStorage = async () => {
      try {
        const ordersData = await AsyncStorage.getItem('orderid');
        const ordersArray = ordersData ? JSON.parse(ordersData) : [];

        for (const order of ordersArray) {
          if (order.product_id == item.product_id) {
            setOrderid(order.product_id);
            setImageTicket(order.imageStore);
            console.log(ordersData, 'ordersData ordersData')
            break; // No need to continue searching if found
          }
        }
      } catch (error) {
        console.error('Error retrieving order details from AsyncStorage:', error);
      }
    };
    if (isFocused) {
      retrieveOrderDetailsFromAsyncStorage();
    }
  }, []);

  const imageUrls = item.images.split("|");
  const images = imageUrls;


  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView>
        <Topbarback Textheading={item.name.slice(0, 18)} navigation={navigation} />

        <ScrollView>
          <View style={styles.main2}>
            <View style={styles.txtmain1}>

              {orderid ? (
                <TouchableOpacity style={styles.txtbo} onPress={() => {
                  userToken == null ?
                    navigation.navigate('Login') : selectedSize == null ?
                      Alert.alert('Select size', 'Please select size .') :
                      navigation.navigate('SeeInStore', { distace, imageTicket, orderIdGet: orderid, brandName: item.brand, name: item.name, selectedSize, images: item.images, userName, currentDate: formatDate(currentDate), current_price: item.current_price, product_id: item.product_id, sizesArray })
                }}>
                  <Image style={styles.img} source={require('../Assets/location.png')} tintColor={LightYellow} />
                  <Text style={styles.txtv}>
                    Ver en tienda
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.txtbo} onPress={() => {
                  userToken == null ?
                    navigation.navigate('Login') :
                    selectedSize == null ?
                      Alert.alert('Select size', 'Please select size .') :
                      navigation.navigate('StoreSubmit', { distace, imageTicket, orderIdGet: orderid, brandName: item.brand, name: item.name, selectedSize, images: item.images, userName, currentDate: formatDate(currentDate), current_price: item.current_price, product_id: item.product_id, sizesArray })
                }}>
                  <Image style={styles.img} source={require('../Assets/location.png')} tintColor={LightYellow} />
                  <Text style={styles.txtv}>
                    Ver en tienda
                  </Text>
                </TouchableOpacity>
              )}


              {orderid ? (
                <TouchableOpacity style={styles.txtbo2} onPress={() => {
                  userToken == null ?
                    navigation.navigate('Login') : selectedSize == null ?
                      Alert.alert('Select size', 'Please select size .') :
                      navigation.navigate('CompareInStore', { distace, imageTicket, orderIdGet: orderid, brandName: item.brand, name: item.name, selectedSize, images: item.images, userName, currentDate: formatDate(currentDate), current_price: item.current_price, product_id: item.product_id, sizesArray })
                }}>
                  <Image style={styles.imgs} source={require('../Assets/shopping-cart.png')} tintColor={LightYellow} />
                  <Text style={styles.txtv}>
                    Comprar online
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.txtbo2} onPress={() => {
                  userToken == null ?
                    navigation.navigate('Login') : selectedSize == null ?
                      Alert.alert('Select size', 'Please select size .') :
                      navigation.navigate('Submit', { distace, imageTicket, orderIdGet: orderid, brandName: item.brand, name: item.name, selectedSize, images: item.images, userName, currentDate: formatDate(currentDate), current_price: item.current_price, product_id: item.product_id, sizesArray })
                }}>
                  <Image style={styles.imgs} source={require('../Assets/shopping-cart.png')} tintColor={LightYellow} />
                  <Text style={styles.txtv}>
                    Comprar online
                  </Text>
                </TouchableOpacity>
              )}

            </View>

            {/* <TouchableOpacity onPress={() => navigation.navigate('Payment', {name:item.name, selectedSize, images:item.images, userName,    currentDate: formatDate(currentDate), current_price: item.current_price, product_id: item.product_id,sizesArray })}>
                        <Text style={styles.ordtxt}>
                            Order here
                        </Text>
                    </TouchableOpacity> */}


            {/* <View>
                    <Text >Current Date: {formatDate(currentDate)}</Text>
    </View> */}




            <Text style={styles.txtt}>Tallas disponibles</Text>
            <View style={{ flexDirection: 'row', }}>
              {/* {sizesArray.map((size, index) => (

                <TouchableOpacity
                  key={index}
                  style={[
                    styles.txma1,
                    { flex: 0.2,maxWidth: wp('25.5%')} ,
                    selectedSize === size ? { backgroundColor: '#DAFDA5' } : {} // Apply different style to the selected size
                  ]}
                  onPress={() => handleSizeClick(size)}
                >
                  <Text
                    style={[
                      styles.txttt,
                      selectedSize === size ? { color: 'black' } : {} // Apply different text color for the selected size
                    ]} numberOfLines={1}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))} */}

              {sizesArray.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.txma1,
                    { flex: 0.2, maxWidth: wp('25.5%') },
                    selectedSize.includes(size) ? { backgroundColor: '#DAFDA5' } : {} // Apply different style to the selected size
                  ]}
                  onPress={() => handleSizeClick(size)}
                >
                  <Text
                    style={[
                      styles.txttt,
                      selectedSize.includes(size) ? { color: 'black' } : {} // Apply different text color for the selected size
                    ]}
                    numberOfLines={1}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.txtadima}>{item.name}</Text>
            <Text style={styles.txtADDI}>{item.brand}</Text>
            <View style={styles.txt6main}>
              <View style={styles.txt66mn}>
                <View>
                  <Text style={styles.txt66}>{item.current_price} €</Text>
                </View>
                {item.old_price == null ? null :
                  <Text style={styles.txt11}>{item.old_price} €</Text>
                }
              </View>
              <View>
                <Text style={styles.txtA7}>{distace} km</Text>
              </View>
            </View>
            <View style={styles.shoebac}>


              <View>

                {/* <ImageSlider /> */}
                <Swiper
                  autoplay={false}
                  style={styles.wrapper} >
                  {images.map((imageUrl, index) => (
                    <View key={index} style={styles.slide}>
                      <ImageBackground source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" >
                        <TouchableOpacity onPress={() => handleHeartPress(item)} style={styles.LikeImg}>

                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                  ))}
                </Swiper>

              </View>
            </View>
            <View style={styles.hrline} />
            <View>
              <Text style={styles.txtprod}>Productos relacionados</Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similarproduct}
                renderItem={({ item, index }) =>
                (
                  <Similardata item={item} index={index} handleHeartPress={handleHeartPress} />


                )} />

            </View>
          </View>
        </ScrollView>
        <View style={styles.mainbutt}>

          <TouchableOpacity style={styles.circl} onPress={() => handleHeartPress(item)}>
            {/* Conditionally render the heart image based on liked status */}
            {likedCards[item.product_id] == true ? (
              <Image style={styles.heimg} source={require('../Assets/redheart.png')} />
            ) : (
              <Image style={styles.heimg} source={require('../Assets/heart.png')} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

    </>
  )
}
export default DetailSearch
const styles = StyleSheet.create({
  main2: {
    flex: 1,
    backgroundColor: '#15181e',
    padding: 8,
    // height: hp('124%'),
  },
  txtmain1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  backim: {
    width: wp('6%'),
    height: hp('4%'),
    // marginLeft:wp("-2.2%")
  },

  bac: {
    color: LightYellow,
  },
  txtv: {
    color: LightYellow,
    fontSize: hp('2.4%'),
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: hp('0.1%'),
    marginLeft: hp('1%'),
  },
  txtbo: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: LightYellow,
    height: hp('5%'),
    width: wp('45%'),
    borderRadius: 7,
  },
  man: {
    backgroundColor: MainBlack,
  },
  Topimg: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",

  },
  Topimg1: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    backgroundColor: 'black'
  },
  txtMain: {
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '700',
    marginLeft: wp("19%")
  },
  navi: {
    width: wp('8%'),
    height: hp('5%'),
  },
  txtbo2: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 7,
    height: hp('5%'),
    width: wp('45%'),
  },
  img: {
    marginLeft: hp('2.5%'),
    alignSelf: 'center',
    height: hp('2.5%'),
    width: wp('4.5%'),
  },
  imgs: {
    marginLeft: hp('1%'),
    alignSelf: 'center',
    height: hp('2.5%'),
    width: wp('4.9%'),
  },
  txtt: {
    color: '#8C8C8C',
    fontSize: hp('1.9%'),
    marginTop: hp('1.5%'),
    padding: 5,
    fontWeight: '500',
  },
  txttt: {
    color: White,
    alignSelf: 'center',
    marginTop: hp('0.6%'),
  },
  txma1: {
    backgroundColor: '#333333',
    height: hp('4%'),
    // width: wp('12.5%'),
    borderRadius: 14,
    marginLeft: hp('1%'),
  },
  txtadima: {
    color: White,
    padding: 6,
    fontSize: hp('2.1%'),
    fontWeight: '700',
    marginTop: hp('1.9%'),
  },
  txtADDI: {
    color: '#8C8C8C',
    marginLeft: hp('1%'),
    fontSize: hp('1.9%'),
    marginTop: hp('-0.8%'),
  },
  txt66: {
    color: LightYellow,
    padding: 7,
    fontSize: hp('2.5%'),
    fontWeight: '500',
  },
  txtA7: {
    color: White,
    fontSize: hp('1.8%'),
    fontWeight: '700',
    marginTop: hp('1.1%'),
    marginRight: wp('2%')
  },
  txt6main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt11: {
    color: White,
    marginTop: hp('1.6%'),
    textDecorationLine: 'line-through',
  },
  txt66mn: {
    flexDirection: 'row',
  },
  shoebac: {
    backgroundColor: White,
    flexDirection: 'row',
    height: hp('55%'),
    width: wp('80%'),
    marginLeft: hp('4%'),
  },
  shoeimg: {
    width: wp('80%'),
    height: hp('34%'),
    marginTop: hp('6%'),
  },
  mainbutt: {
    width: wp('40%'),
    // backgroundColor:'black',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: hp('13.5%')
  },
  circl: {
    backgroundColor: LightYellow,
    height: hp('6.5%'),
    width: wp('13%'),
    borderRadius: 50,

  },
  LikeImg: {
    // position: 'absolute',
    marginTop: hp('1%'),
    marginLeft: wp('62%')
    // alignSelf:"flex-end"
    // bottom: hp('8.5%')
  },
  heimg: {
    height: hp('2.5%'),
    width: wp('5%'),
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  hrline: {
    height: hp('0.03%'),
    width: wp('92%'),
    backgroundColor: '#c8c8c',
    marginTop: hp('1%'),
    alignSelf: 'center',
  },
  heimg1: {
    height: hp('2.5%'),
    width: wp('5%'),
    marginLeft: hp('0.5%'),
    marginTop: hp('2%'),
  },
  txtprod: {
    color: White,
    fontSize: hp('2.2%'),
    fontWeight: '700',
    marginVertical: hp('1%'),
  },
  maina: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('13%'),
  },
  txman: {
    backgroundColor: '#999999',
    height: hp('20%'),
    width: wp('43%'),
    borderRadius: 6,
    marginLeft: 5,
    // resizeMode:"contain"
    // borderRadius: 6,
  },
  txta: {
    color: LightYellow,
    fontSize: hp('1.6%'),
    marginVertical: wp('1.4%'),
    marginLeft: hp('2%'),
  },
  img1: {
    alignSelf: 'center',
    height: hp('20%'),
    width: wp('43%'),
    borderRadius: 6,
    opacity: 0.6,
    resizeMode: "contain",
    overflow: "hidden"
    // position:'absolute'
  },
  img2: {
    alignSelf: 'center',
    height: hp('30%'),
    width: wp('55%'),
  },
  img3: {
    alignSelf: 'center',
    height: hp('30%'),
    width: wp('55%'),
  },
  imgh: {
    height: hp('2.5%'),
    width: wp('5%'),
    marginLeft: hp('-6%'),
    marginTop: hp('2%'),
    position: 'absolute'
  },
  imgfl: {
    flexDirection: 'row',
    // borderRadius:6,
    resizeMode: "contain"

  },
  txtonim: {
    color: White,
  },
  txtonimg: {
    // color: '#595959',
    color: '#fff',
    marginTop: hp('-13%'),
    alignSelf: 'center',
    fontSize: hp('2.2%'),
    fontWeight: '700',
  },
  txton7: {
    // color: '#595959',
    color: '#fff',
    alignSelf: 'center',
    fontSize: hp('2.2%'),
  },
  txtonimg2: {
    color: White,
    marginTop: hp('-17%'),
    alignSelf: 'center',
    fontSize: hp('2.1%'),
    fontWeight: '700',
  },
  txtonimg3: {
    color: White,
    marginTop: hp('-17%'),
    alignSelf: 'center',
    fontSize: hp('2.12%'),
    fontWeight: '700',
  },
  ordtxt: {
    color: White,
    //     height:hp('1.5%'),
    //  width:wp('2%'),
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: Dimensions.get('window').width,
    height: '100%',
  },
  image: {
    width: Dimensions.get('window').width,
    height: '100%',
    resizeMode: "cever"
    // width:'auto'
  },

})