import { StyleSheet, Text, View, StatusBar, Image, ImageBackground, TextInput, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState, useContext, useRef, createRef, useEffect } from 'react'
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst'
import Topbar from '../../Components/Topbar'
import Inputsearch from '../../Components/Inputsearch'
import ToggleSwitch from 'toggle-switch-react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Cards from '../../Components/Cards'
import { resizeMode } from 'deprecated-react-native-prop-types/DeprecatedImagePropType'
import { ScrollView } from 'react-native-gesture-handler'
import DetailSearch from '../../DetailSearch/DetailSearch'
import BottomActionSheet from '../../Components/BottomActionSheet'
import CustomBrandcategory from '../../Components/CustomBrandcategory'
import CustombrandSubCat from '../../Components/CustombrandSubCat'
import { AuthContext } from '../../Components/AuthContext'
import { Baseurl } from '../../Components/Baseurl'
import base64 from 'react-native-base64'
import Customcategory from '../../Components/Customcategory'
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import Loader from '../../Components/Loader'


const Wishlist = ({ data, navigation }) => {
  const [toggleButtonDay, setToggleButtonDay] = useState(false)



  const actionSheetBrand = createRef()
  const actionSheetCategory = createRef()
  const actionSheetSubCategory = createRef()
  const actionSheetSize = createRef()
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');
  const loginCred = base64.encode(userName + ':' + password)
  const { userToken, userName, password } = useContext(AuthContext);
  const searchRef = useRef()
  const [loaderVisible, setLoaderVisible] = useState(false);

  console.log(userName, 'userName')
  console.log(password, 'password')


  const [wishlist, setWhislist] = useState([])
  const [wishlistOld, setWhislistOld] = useState([])

  // console.log(wishlist, 'wishlist')

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  console.log(latitude)
  console.log(longitude)

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



  const Datawhislist = () => {

    fetch(Baseurl + '/api/user/' + userName + '/wishlist/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
      },
    }).then((response) => response.json())
      .then((json) => {

        setWhislist(json.wishlist_products)
        setWhislistOld(json.wishlist_products)
      })
      .catch((error) => {

        console.error(error)
      })
  }

// bottomsheet brand data
const [categoryBrand, setcategoryBrand] = useState([]);
const brandcategory=()=>{
  fetch(Baseurl + '/api/brand/',{
    headers: {
      "Accept": "application/json",
      'Access-Control-Allow-Headers': '*',
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => response.json())
  .then((json) => {
    setcategoryBrand(json.slice(0,50))
  })
  .catch((error) => {
    console.error(error)
  })
};

//bottomsheet category data
const [categoryData, setcategoryData] = useState([]);
const categoBottomsheet = () => {
  fetch(Baseurl + '/api/product/category/', {
    headers: {
      "Accept": "application/json",
      'Access-Control-Allow-Headers': '*',
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => response.json())
    .then((json) => {
      setcategoryData(json)
    })
    .catch((error) => {
      console.error(error)
    })
};

// bottomsheet subcategory data
const [subcategory, setSubcategory] = useState([]);
const [oldsubcategory, setOldSubcategory] = useState([]);

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
    CheckPermission();
    Datawhislist();
    brandcategory()
    categoBottomsheet()
    category()
  }, [])

  const Search = txt => {
    if (txt !== '') {
      let tempData = wishlist.filter(item => {
        const lowerCaseTxt = txt.toLocaleLowerCase();
        return (
          item.name.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.brand.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.category.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.shop.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setWhislist(tempData);
    } else {
      setWhislist(wishlistOld);
    }
  };

  const SearchPrice = txt => {
    if (txt !== '') {
      let tempData = wishlist.filter(item => {
        const lowerCaseTxt = txt.toLocaleLowerCase();
        return (
          item.current_price.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setWhislist(tempData);
    } else {
      setWhislist(wishlistOld);
    }
  };

  // Brand
  const [selectedBrandCategory, setSelectedBrandCategory] = useState(null);
  const [selectedBrandCount, setSelectedBrandCount] = useState(0);

  console.log(" Selected Brand selectedBrandCategory:", selectedBrandCategory);
  console.log(" Selected Brand selectedBrandCount:", selectedBrandCount);

  const handleSelectedBrandCount = (count) => {
    setSelectedBrandCount(count);
  };

  const handleSelectedBrandCategory = (brand) => {
    console.log("Received Selected Brand:", brand);
    setSelectedBrandCategory(brand);

    if (brand) {
      let tempData = wishlistOld.filter(item => {
        const lowerCaseTxt = brand.toLowerCase();
        return (
          item.brand.toLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setWhislist(tempData);
    } else {
      setWhislist(wishlistOld); // Reset to the original data when no category is selected
    }
  }

  //category
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [catogoryItem, setCatogoryItem] = useState(null)

  const handleSelectedCategories = (selectedCategories) => {
    console.log("Received Selected selectedCategories Categories: ", selectedCategories);
    setSelectedCategories(selectedCategories);

  };


  const handleSelectedCategory = (selectedItem) => {
    // setWhislist(wishlistOld)
    setCatogoryItem(selectedItem);
    console.log("Received Selected Item: ", selectedItem);

    if (selectedItem) {
      let tempData = wishlistOld.filter(item => {
        const lowerCaseTxt = selectedItem.toLowerCase();
        return (
          item.category.toLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setWhislist(tempData);
    } else {
      setWhislist(wishlistOld); // Reset to the original data when no category is selected
    }
    // Do whatever you want to do with the selected item here in the Search component
  };


  const deleteData = (product_id) => {
    let formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('username', userName);

    fetch(Baseurl + '/api/user/' + userName + '/wishlist/delete/' + product_id + '/', {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
        "Referer": "https://byder-backend-3l2yk.ondigitalocean.app",
        "X-CSRFTOKEN": userToken,
      },
      body: formData
    }).then((result) => {
      result.json().then((response) => {
        console.log(response, "delete Response");

        // After successful deletion, update the wishlist state
        setWhislist(prevWishlist => prevWishlist.filter(product => product.product_id !== product_id));
      }).catch((err) => {
        console.log(err);
      });
    });
  };


  const dataFilter=()=>{
    setToggleButtonDay(!toggleButtonDay)
    setCatogoryItem(null)
    setSelectedBrandCategory(null)
    setWhislist(wishlistOld)
  }



  const Getdata = ({ item, index }) => {
    const imageUrls = item.images.split('|');
    const imagee = imageUrls[0];
    const [distace, setDistance] = useState([])
    const [shoplatitude, shoplongitude] = item.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const [address, setAddress] = useState(null);

    // console.log(imageUrls[0])
    const handleHeartPress = (product_id) => {
      // Check if the product is in the wishlist
      if (wishlist.some(product => product.product_id === product_id)) {
        // Call the deleteData function to remove the item from the wishlist
        deleteData(product_id);
      }
    };

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

    useEffect(() => {
        distanceGet();
        getAdress()
    }, [])
    return (<>

      <View style={{ padding: 6 }}>
        <View style={styles.maincard}>
          <View style={styles.Imagecontainer}>

            <ImageBackground key={index} source={{ uri: imagee }} style={styles.image} >
              {item.discount == null ? null :
                <View style={styles.per}>
                  <Text style={styles.txtper}>{item.discount}%</Text>
                </View>
              }
              <View />

              <TouchableOpacity onPress={() => handleHeartPress(item.product_id)}>
                {/* Conditionally render the heart image based on liked status */}
                {wishlist.some(product => product.product_id === item.product_id) ? (
                  <Image style={styles.heartim} source={require('../../Assets/redheart.png')} />
                ) : (
                  <Image style={styles.heartim} source={require('../../Assets/heart.png')} />
                )}
              </TouchableOpacity>
            </ImageBackground>

          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DetailSearch', { item,distace, ScreenNavigation: "Wishlist" })}>
            <View style={{ marginLeft: hp('2%') }}>
              <Text style={styles.textColor}>{item.brand}</Text>
              <Text style={styles.txtclr}>{item.name.slice(0, 14)}...</Text>
              <Text style={styles.txtdlr}>{item.current_price} €</Text>
              <View style={styles.maintx}>
                <Text style={[styles.txtclr,{fontSize:hp('1.7%')} ]} numberOfLines={1}>{item.area}</Text>
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

      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.main2}>
        <Topbar Textheading={'Lista de deseos'} navigation={navigation} />
        {userToken ? 
        <View>
          <ScrollView>
            <View style={{padding:10}}>
              <View>
                <Inputsearch ref={searchRef} onChangeText={txt => Search(txt)} />
              </View>
              <View style={styles.mainntx}>
                <View>
                  <Text style={styles.txtmo}>Monstrar filtros</Text>
                  <Text style={styles.txt0}>0 filtros aplicados</Text>
                </View>
                <View style={styles.togglmain}>
                  <ToggleSwitch

                    isOn={toggleButtonDay}
                    onColor={LightYellow}
                    offColor="#4d4d4d"
                    // label="Day Before"
                    labelStyle={{ color: "white", fontWeight: "900" }}
                    size="large"
                    onToggle={isOn => { dataFilter(isOn), console.log("changed to : ", isOn) }}
                  />
                </View>
              </View>
              {toggleButtonDay ?

                <View>


                  <View style={styles.topViewSolo}>


                    <Image source={require('../../Assets/price-tag.png')} style={styles.ListImg} />
                    <Text style={styles.txtList}>Solo articulos con descuento </Text>
                  </View>

                  <View style={styles.mainnn}>
                    <View style={styles.ll}>
                      <Image style={styles.mi} source={require('../../Assets/minus.png')} />
                    </View>
                    <View style={styles.hom}>
                      <Text style={styles.homtx}>
                        HOMBRE
                      </Text>
                    </View>
                    <View style={styles.muj}>
                      <Text style={styles.mujtx}>
                        MUJER
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.txtHead}>Elege una marca</Text>

                  <TouchableOpacity onPress={() => actionSheetBrand.current?.show()}>
                    <View style={styles.ree}>
                      <View style={styles.r1}>
                      </View>
                      <Text style={{ color: White }}>{selectedBrandCount <= 1 ? null : selectedBrandCount}  {selectedBrandCategory}</Text>
                      <Image style={styles.de} source={require('../../Assets/down.png')} />
                    </View>
                  </TouchableOpacity>
                  {/* <Text style={styles.txtHead}>Elege una o mas categorias</Text> */}
                  <BottomActionSheet ref={actionSheetBrand} title={'Title'}>
                    < CustomBrandcategory actionSheetBrand={actionSheetBrand}
                      BrandDataApi={categoryBrand}
                      sendSelectedBrandCategory={handleSelectedBrandCategory}
                      sendSelectedBrandCount={handleSelectedBrandCount} />
                  </BottomActionSheet>

                  <Text style={styles.txtHead}>Elege una o mas categorias</Text>
                  <TouchableOpacity onPress={() => actionSheetCategory.current?.show()}>

                    <View style={styles.ree}>
                      <View style={styles.r1}>
                        {selectedCategories.map((category) => (
                          <Text key={category}>{category}</Text>
                        ))}
                      </View>
                      <Text style={{ color: White }}>{catogoryItem}</Text>
                      <Image style={styles.de} source={require('../../Assets/down.png')} />

                    </View>

                  </TouchableOpacity>

                  <BottomActionSheet ref={actionSheetCategory} title={'Title'}>
                    <Customcategory
                      actionSheetCategory={actionSheetCategory}
                      sendDataToParent={handleSelectedCategories}
                      catData={categoryData}
                      sendSelectedCategory={handleSelectedCategory} // Pass the prop function to receive the selected item
                    />
                  </BottomActionSheet>

                  <Text style={styles.txtHead}>Precio maximo</Text>
                  <TextInput
                    style={styles.input1}
                    ref={searchRef}
                    onChangeText={txt => SearchPrice(txt)}
                    placeholder="109.99"
                    placeholderTextColor={'#fff'}

                  />
                </View>
                :
                null}


              <View style={styles.hrline} />

              <Text style={styles.txttoda}>Todas las prendas</Text>
              {/* <View style={styles.wish}>
  <Text style={styles.wishtxt}>
    Lista de deseos vacia
  </Text>
  <Text style={styles.wishtxt2}>
    Afiade articulos dindo al cprazon en le parte {'\n'}inferior derecha de la pagina de detailes
  </Text>
   </View> */}

              {/* <FlatList> */}
              {/* <Cards data={data1} /> */}
              {userName === null || password === null || wishlist === null ? (
                <View style={styles.wish}>
                  <Text style={styles.wishtxt}>
                    Lista de deseos vacía
                  </Text>
                  <Text style={styles.wishtxt2}>
                    Añade artículos dando clic en el corazón en la parte inferior derecha de la página de detalles
                  </Text>
                </View>
              ) : (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={wishlist}
                  numColumns={2}
                  // keyExtractor={host_sublist => host_sublist.id}
                  renderItem={({ item, index }) =>
                    (<Getdata item={item} index={index}></Getdata>)} />

              )}
              <View style={{ marginVertical: hp('4%') }}></View>
            </View>
          </ScrollView>

        </View>
        : navigation.navigate('Login') }
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
      </SafeAreaView>
    </>
  )
}

export default Wishlist

const styles = StyleSheet.create({

  main2: {
    flex: 1,
    backgroundColor: '#15181e',
    // padding: 10,
    // height: hp('124%'),
  },
  input1: {
    backgroundColor: '#333333',
    height: 40,
    color:'#fff',
    borderWidth: 1,
    padding: 5,
    paddingLeft: 14,
    borderRadius: 10,
    borderColor: LightYellow,

  },
  MainFlx: {
    flex: 1,
    backgroundColor: '#15181e',
    padding: 10
  },
  txtmo: {
    color: White,
    marginTop: hp('2%'),
    fontSize: hp('2.2%'),
  },
  txtHead: {
    color: '#707173',
    fontSize: hp('1.9%'),
    marginVertical: hp('1%'),
    fontWeight: '500'
  },
  txt0: {
    color: '#737373',
    fontSize: hp('2.2%'),
  },
  mainntx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  togglmain: {
    marginTop: hp('2%'),
  },
  hrline: {
    height: hp('0.05%'),
    width: wp('96%'),
    backgroundColor: '#fff',
    marginTop: hp('3%'),

  },
  txttoda: {
    color: White,
    fontSize: hp('2.2%'),
    marginTop: hp('3%'),
    marginLeft: hp('0.6%')
  },
  mainimg: {
    flexDirection: 'row',

  },

  imgg1: {
    height: 180,
    width: 182,
    margin: 2,
  },

  mani: {

    backgroundColor: 'black',
    height: 286,

  },

  maincard: {
    width: wp('44%'),
    borderRadius: 10,
    height: hp('33.2%'),
    backgroundColor: '#1e222b',
    marginBottom: wp('2%'),
    // marginLeft:hp('-0.6%'),
  },
  // Imagecontainer: {
  //   width: wp('46.5%'),
  //   height: hp('20%'),
  //   backgroundColor: '#fff',
  //   borderTopLeftRadius: 10,
  //   borderTopRightRadius: 10,
  //   // alignItems: 'center',
  //   overflow:'hidden',
  //   justifyContent: 'center',
  //   resizeMode: 'cover',
  // },
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
    color: '#616267',
  },
  heartim: {
    height: hp('3%'),
    width: wp('6.1%'),
    // alignContent:'flex-end',
    marginRight: hp('1.4%'),
    marginTop: hp('0.8%'),
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
    fontSize: hp('2.1%'),
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
  topViewSolo: {
    width: wp('94%'),
    height: hp('5.5%'),
    backgroundColor: '#2d332d',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  txtList: {
    fontSize: hp('2.1%'),
    color: '#d2f39f',
    fontWeight: "700",
    marginLeft: hp('2%'),
  },
  ListImg: {
    height: hp('2.5%'),
    width: wp('5%'),
    tintColor: LightYellow
  },
  mainnn: {
    flexDirection: 'row',
    marginTop: hp('2.7%'),
    marginBottom: hp('2.7%'),
    backgroundColor: '#333333',
    width: wp('94%'),
    borderRadius: 7,
  },
  ll: {
    backgroundColor: '#666666',
    height: hp('5%'),
    width: wp('12%'),
    // marginLeft: hp('2%'),
    borderRadius: 10,
  },
  mi: {
    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  hom: {
    backgroundColor: '#333333',
    height: hp('4%'),
    width: wp('35%'),
    marginLeft: hp('0.5%'),
    // borderRadius: 20,
  },
  homtx: {
    color: White,
    fontWeight: '600',
    marginTop: hp('1.1%'),
    alignSelf: 'center',
  },
  muj: {
    backgroundColor: '#333333',
    height: hp('4%'),
    width: wp('35%'),
    marginLeft: hp('0.5%'),
    // borderRadius: 20,
  },
  mujtx: {
    color: White,
    fontWeight: '600',
    marginTop: hp('1.1%'),
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
  r1: {
    backgroundColor: '#595959',
    height: hp('4.5%'),
    width: wp('9%'),
    borderRadius: 30,
    alignSelf: 'center',
  },
  de: {
    alignSelf: 'center',
    marginTop: hp('0.3%'),
    width: wp('5.5%'),
    marginLeft: hp('10.5%'),
    height: hp('3%'),
  },
  wish: {
    backgroundColor: "#262626",
    height: hp('10%'),
    color: 'white',
    borderWidth: 1,
    padding: 5,
    marginTop: hp('1%'),
    paddingLeft: 14,
    borderRadius: 10,
    borderColor: '#666666',
  },
  wishtxt: {
    color: 'white',
    fontSize: hp('2%'),
  },
  wishtxt2: {
    color: 'white',
  },
})


