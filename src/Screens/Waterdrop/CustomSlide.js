import React, { useState, useRef, useEffect, useContext, createRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, Modal, ImageBackground, Animated,StatusBar, ScrollView, SafeAreaView, Pressable } from 'react-native'
import Swiper from 'react-native-deck-swiper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { sidebarBlack, LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst';
import Topbar from '../../Components/Topbar';
import { Baseurl } from '../../Components/Baseurl';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import Filter from '../../Components/Filter';
import Loader from '../../Components/Loader';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';


// const { width } = Dimensions.get('window');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const height = Dimensions.get('window').height
const stackSize = 4;


const CustomSlide = ({ card, navigation,FilterSubcategories,apiData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { userToken, userName, password } = useContext(AuthContext);
  const loginCred = base64.encode(userName + ':' + password)
  const [searchdata, setsearchData] = useState(apiData)
  const [likedCards, setLikedCards] = useState({});
  const [idOfProduct, setIdOfProduct] = useState();
  const [loaderVisible, setLoaderVisible] = useState(false);



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


  const useSwiper = useRef(null).current
  const ref = useRef()
  const useSwipercheck = useRef(null)
  const handleOnSwipedTop = () => useSwiper.swipeTop()

  // const actionSheetfilterSubCategory = useRef();
  // const actionSheetfilterSubCategory = createRef()
  const handleOnSwipedLeft = () => {
    if (useSwipercheck.current) {
      useSwipercheck.current.swipeLeft(); // Call the swipeLeft() method from the ref
    }
  };
  const handleOnSwipedRightLike = () => {
    if (useSwipercheck.current) {
      useSwipercheck.current.swipeRight(); // Call the swipeLeft() method from the ref
    }
  };


  console.log(FilterSubcategories, 'FilterSubcategories')

  const product = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setsearchData(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.log(error)
      })
  }

  useEffect(() => {
    product();
    CheckPermission()
  }, [])


  useEffect(() => {
    // Check if FilterSubcategories has a value and is a string
    if (FilterSubcategories && typeof FilterSubcategories === 'string') {
      const lowerCaseTxt = FilterSubcategories.toLowerCase();
      let tempData = searchdata.filter((item) => {
        // Check if item.subcategory exists and is a string
        if (item.subcategory && typeof item.subcategory === 'string') {
          return item.subcategory.toLowerCase().indexOf(lowerCaseTxt) > -1;
        }
        // If item.subcategory is null, undefined, or not a string, exclude it
        return false;
      });
      // setsearchData(tempData);
      console.log(tempData, 'tempData')
    } else {
      // Reset to the original data when no valid category is selected
      product(); // You may need to fetch the original data again
    }
  }, [FilterSubcategories]);


  const likeData = (product_id) => {
    const url = product_id;
    // const updatedUrl = url.replace(".html", "");
    // console.log(updatedUrl,'updatedUrl')

    console.log(product_id,'like swipe upper product_id')
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

  // const handleNextCard = () => {
  //   // Increment the currentIndex and handle boundary conditions
  //   const newIndex = currentIndex + 1;
  //   if (newIndex < searchdata.length) {
  //     setCurrentIndex(newIndex);
  //   }
  // };

  const handlePreviousCard = () => {
    // Decrement the currentIndex and handle boundary conditions
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    }
  };
  const handleHeartPress = (card) => {
    if (likedCards[card.product_id]) {
      // If the item is already liked (red heart), call deleteData function
      deleteData(card.product_id);
    } else {
      // If the item is not liked (heart), call likeData function
      likeData(card.product_id);
    }
  };

  const [activeRight, setactiveRight] = useState(false);
  useEffect(() => {
    if (activeRight) {
      const timer = setTimeout(() => {
        setactiveRight(false);
      }, 2000);

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts or activeRight changes
    }
  }, [activeRight]);



  const Card = ({ card, navigation }) => {


    const [next, setNext] = useState(null);
    const [back, setBack] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);

    const [distace, setDistance] = useState([])
    const [shoplatitude, shoplongitude] = card.coordinates.split(',').map(coord => parseFloat(coord.trim()));


    console.log(card, 'card')

    const imageUrls = card.images.split('|')
    const firstImageUrl = imageUrls[0]; // Get the first image URL
    let product_id = card.product_id

    
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

    useEffect(() => {
      distanceGet();
  
  }, [])

    const [favselect, setFavSelect] = useState(true)
    console.log('like button press')



    const scrollToNextCard = () => {
      const nextIndex = currentIndex + 1;
  
      if (nextIndex < searchdata.length) {
        setCurrentIndex(nextIndex);
        ref.current.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
      } else {
        // Handle what should happen when you reach the end of the cards
        // For example, you can loop back to the first card.
        setCurrentIndex(0);
        ref.current.scrollToIndex({
          animated: true,
          index: 0,
        });
      }
    };
    // useEffect(() => {
    //   setNext(currentIndex + 1);
    //   setBack(currentIndex - 1);
    //   if (currentIndex === 0) {
    //     setBack(searchdata.length - 1);
    //   }
    //   if (currentIndex + 1 === searchdata.length) {
    //     setNext(0);
    //   }
    // }, [currentIndex]);


    return (
      <>
     
  
        <View activeOpacity={1} style={styles.card}>
          <View style={styles.imgView}>
            <Image
              style={styles.image}
              source={{ uri: firstImageUrl }}
              resizeMode="cover"
            />
            {/* ))} */}
          </View>
          <View style={styles.photoDescriptionContainer}>
            <Text style={styles.text} numberOfLines={2}>
              {`${card.name}`}
            </Text>
            <Text style={styles.textbran}>{card.brand}</Text>
            <View style={styles.txtprlocation}>
              <Text style={styles.pricetxt}>{card.current_price} €</Text>
              {card.old_price == null ? null :
                <Text style={[styles.pricetxt, { textDecorationLine: 'line-through', color: '#fff', marginLeft: wp('-14%') }]}>{card.old_price} €</Text>
              }
              <Text style={styles.locationtxt}>{distace} km</Text>
            </View>
            <View style={styles.hrWidth} />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.viewNext}
                onPress={() => scrollToNextCard()}
              >
                <Image source={require('../../Assets/arrowTinder.png')} tintColor='#FF0000' style={{ height: 20, width: 20 }} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewNext, { backgroundColor: '#333333' }]}
                color="white"
                backgroundColor="#E5566D"
                onPress={() => { userToken == null ? navigation.navigate('Login') : handleOnSwipedRightLike(), handleHeartPress(card), setIdOfProduct(product_id) }}
              >
                <Image source={require('../../Assets/heart.png')} tintColor="#DAFDA5" style={{ height: 20, width: 20 }} />
              </TouchableOpacity>

            </View>
          </View>
        </View>         
       
        </>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>

        <StatusBar hidden={true} />

        <View style={styles.swiperContainer}>
          <View style={styles.mainbackg}>
            <View style={styles.MainFlex}>
              {searchdata.length > 0 ? ( // Check if `searchdata` has data before rendering Swiper
                <Swiper
                  ref={useSwipercheck}

                  cards={searchdata}
                  goBackToPreviousCardOnSwipeBottom={true}
                  // cardIndex={index}
                  renderCard={card => <Card card={card} navigation={navigation}  onPrevious={handlePreviousCard}/>}
                  infinite
                  backgroundColor={'transparent'}

                  // disableLeftSwipe
                  // disableRightSwipe
                  // onTapCard={() => swiperRef.current.swipeLeft()}
                  cardVerticalMargin={50}
                  stackSize={stackSize}
                  stackScale={10}
                  stackSeparation={14}
                  animateOverlayLabelsOpacity
                  animateCardOpacity
                  cardIndex={currentIndex}

                  onSwipedRight={() => {
                    if (userToken == null) {
                      navigation.navigate('Login')
                    } else {
                      const product_id = searchdata[currentIndex].product_id;
                      // const product_id = searchdata[currentIndex].product_id;
                      console.log(product_id,'swipe bottom product_id')
                      likeData(product_id);
                      setactiveRight(!activeRight)
                    }
                  }}
                />
              ) : (
                <>
                      {/* <Text style={{color:"#fff"}}>No data found.</Text> */}
                      <View></View>
                </>
          
              )}
            </View>
          </View>

        </View>

        {/* modal right */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={activeRight}
          onRequestClose={() => {
            console.warn("closed");
          }}>
          <View style={styles.containerModal}>
            <View style={styles.modalMain}>
              <Image source={require('../../Assets/wishlistick.png')} tintColor="#DAFDA5" style={{ height: 100, width: 100 }} />
              <Text style={styles.txtaddedFav}>Anadido a lista de deseos</Text>
            </View>
          </View>
        </Modal>
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
      </SafeAreaView>

    </>
  )
}

export default CustomSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swiperContainer: {
    marginTop: HEIGHT * -0.004
  },
  // card: {
  //   // height:HEIGHT * .73,
  //   height: Platform.OS == "ios" ? HEIGHT * .73 : HEIGHT * .77,
  //   width: WIDTH * 0.90,
  //   elevation: 5,
  //   borderRadius: 24,
  //   shadowRadius: 1.5,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.5,
  //   shadowOffset: { width: 0, height: 3 },
  //   backgroundColor: '#fff',
  // },


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
  MainFlex: {
    flex: 1,
    backgroundColor: '#15181E',
    // height:'100%',
    padding: 10
  },
  mainbackg: {
    backgroundColor: '#15181E',
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
    tintColor: '#79FF4D',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    // marginLeft:hp('2.5%'),
  },
  txtMain: {
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '700',
    marginLeft: wp("30%")
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
    marginLeft: wp("30%")
  },
  navi: {
    width: wp('8%'),
    height: hp('5%'),
  },
  card: {
    /* Setting the height according to the screen height, it also could be fixed value or based on percentage. In this example, this worked well on Android and iOS. */
    height: height - 180,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#15181E',
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
    backgroundColor: '#15181E',
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
    width: wp('89.2%')
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
    justifyContent:"space-between",
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
    fontSize: hp('1.9%'),
    color: 'white',
    fontWeight: "600",
    fontFamily: 'Avenir',
    textShadowColor: 'black',
    marginRight:wp('5.5%')
    // alignSelf:"flex-end"
    // marginLeft: wp('19%')
  },
  hrWidth: {
    height: hp('0.15%'),
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
    justifyContent: "center"
  }


});