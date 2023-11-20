import { StyleSheet, Text, View, StatusBar, SafeAreaView,Image, ImageBackground, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, createRef, useContext } from 'react'
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
import { Baseurl } from '../../Components/Baseurl'
import { AuthContext } from '../../Components/AuthContext'
import Customcategory from '../../Components/Customcategory'
import base64 from 'react-native-base64'
import Loader from '../../Components/Loader';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const Search = ({ data, navigation, route }) => {
  // const { selectedItem } = route.params

  const [selectedItem, setSelectedItem] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);
  // ... Other code ...
  const [toggleButtonDay, setToggleButtonDay] = useState(false)


  const { userToken, userName, password,productDataList,asyncProductData } = useContext(AuthContext);
  const searchRef = useRef()
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



  const actionSheetBrand = createRef()
  const actionSheetCategory = createRef()
  const actionSheetSubCategory = createRef()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // Track whether the BottomActionSheet is open

  const actionSheetSize = createRef()
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');


  const [hombreBackgroundColor, setHombreBackgroundColor] = useState('#333333');
  const [mujerBackgroundColor, setMujerBackgroundColor] = useState('#333333');
  const [imageBackgroundColor, setImageBackgroundColor] = useState('#666666');

  const [genderStatus, setGenderStatus] = useState(null);

  useEffect(() => {
    // Set the image background as selected by default when the component mounts
    setImageBackgroundColor('#666666');
  }, []);

  const [maleData, setMaleData] = useState([]);
  // console.log(maleData,'maleData')
  const [femaleData, setFemaleData] = useState([]);

  const fetchMaleData = () => {
    fetch(Baseurl + '/api/product/gender/Male/', {
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
        console.error(error)
      })
  };

  const fetchFemaleData = () => {
    fetch(Baseurl + '/api/product/gender/Female/', {
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
        console.error(error)
      })
  };



  const onImgPress = () => {
    setHombreBackgroundColor('#333333');
    setMujerBackgroundColor('#333333');
    setImageBackgroundColor('#666666');
    setGenderStatus(null);
    product();
  };

  const onHombrePress = () => {
    setHombreBackgroundColor('#666666');
    setMujerBackgroundColor('#333333');
    setImageBackgroundColor('#333333');
    setGenderStatus('HOMBRE');
    fetchMaleData();
  };

  const onMujerPress = () => {
    setHombreBackgroundColor('#333333');
    setMujerBackgroundColor('#666666');
    setImageBackgroundColor('#333333');
    setGenderStatus('MUJER');
    fetchFemaleData();
  };



  let MainApiData= JSON.parse(asyncProductData);

  
  const [searchdataOld, setsearchDataOld] = useState(MainApiData)
  const [searchdata, setsearchData] = useState(MainApiData)
  // console.log(searchdata, 'searchdata')

  // Function to handle BottomActionSheet open event
  const handleBottomSheetOpen = () => {
    setIsBottomSheetOpen(true);
    // Reset searchData to the original data when the BottomActionSheet is opened
    setsearchData(MainApiData);
  };

  // Function to handle BottomActionSheet close event
  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
    // Optionally, you can reset searchData here if needed when the BottomActionSheet is closed
  };


  const Search = txt => {
    if (txt !== '') {
      let tempData = searchdata.filter(item => {
        const lowerCaseTxt = txt.toLocaleLowerCase();
        return (
          item.name.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.brand.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.category.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 ||
          item.shop.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1
        );
      });
      setsearchData(tempData);
    } else {
      setsearchData(searchdataOld);
    }
  };

  const SearchPrice = txt => {
    if (txt !== '') {
      let tempData = searchdata.filter(item => {
        const lowerCaseTxt = txt.toLocaleLowerCase();
        return (
          item.current_price.toLocaleLowerCase().indexOf(lowerCaseTxt) > -1 
        );
      });
      setsearchData(tempData);
    } else {
      setsearchData(searchdataOld);
    }
  };



  // Brand
  const [selectedBrandCategory, setSelectedBrandCategory] = useState(null);
  const [selectedBrandCount, setSelectedBrandCount] = useState(0);
  console.log("Received Selected selectedBrandCategory:", selectedBrandCategory);


  const handleSelectedBrandCount = (count) => {
    setSelectedBrandCount(count);
  };

  const handleSelectedBrandCategory = (brand) => {
    // console.log("Received Selected Brand:", brand);
    setSelectedBrandCategory(brand);

    if (brand) {
      let tempData = searchdataOld.filter(item => {
        const lowerCaseTxt = brand.toLowerCase();
        return (
          item.brand.toLowerCase().indexOf(lowerCaseTxt) > -1 
        );
      });
      setsearchData(tempData);
    } else {
      setsearchData(searchdataOld); // Reset to the original data when no category is selected
    }
   
  
    // Do something with the selected brand in the parent component
  };
 
 

  //category
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [catogoryItem, setCatogoryItem] = useState(null)

  const handleSelectedCategories = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
   
  };


  const handleSelectedCategory = (selectedItem) => {
    setCatogoryItem(selectedItem);
    // console.log("Received Selected Item: ", selectedItem);
  
    if (selectedItem) {
      let tempData = searchdataOld.filter(item => {
        const lowerCaseTxt = selectedItem.toLowerCase();
        return (
          item.category.toLowerCase().indexOf(lowerCaseTxt) > -1 
        );
      });
      setsearchData(tempData);
    } else {
      setsearchData(searchdataOld); // Reset to the original data when no category is selected
    }
    // Do whatever you want to do with the selected item here in the Search component
  };

  //subcategory
  const [selectedSubcategories, setSelectedSubcategories] = useState(null);

  const handleSubcategorySelection = (selectedSubcategories) => {
    console.log("Received Subcategories:", selectedSubcategories);
    const subcategoriesString = selectedSubcategories.join(', '); // Log the received subcategories
    setSelectedSubcategories(subcategoriesString);

    // if (selectedSubcategories) {
    //   let tempData = searchdata.filter(item => {
    //     const lowerCaseTxt = selectedSubcategories.toLowerCase();
    //     return (
    //       item.subcategory.toLowerCase().indexOf(lowerCaseTxt) > -1 
    //     );
    //   });
    //   setsearchData(tempData);
    // } else {
    //   setsearchData(searchdata); // Reset to the original data when no category is selected
    // }

  };

  const dataFilter=()=>{
    setToggleButtonDay(!toggleButtonDay)
    setCatogoryItem(null)
    setSelectedBrandCategory(null)
    setSelectedSubcategories(null)
    setsearchData(searchdataOld)
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
        // const jsonArrayOfObjects = JSON.stringify(json.slice(0, 50));
        const jsonArrayOfObjects = JSON.stringify(json);
        productDataList(jsonArrayOfObjects)
        // setsearchData(json.slice(0, 50))
        // setsearchDataOld(json.slice(0, 50))
        
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }

  useEffect(() => {
    product();
    category()
    categoBottomsheet()
    brandcategory()
    CheckPermission();
    Similar();
  }, [])

  
useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Remove the AsyncStorage value here
      AsyncStorage.removeItem('selectedItemsBrands')
          .then(() => {
              console.log('Value removed from AsyncStorage');
          })
          .catch(error => {
              console.error('Error removing value from AsyncStorage:', error);
          });
  });

  return unsubscribe;
}, [navigation]);
 


  const [showRedHeart, setShowRedHeart] = useState(false);

  const toggleImage = () => {
    setShowRedHeart((prevState) => !prevState);
  };



  const [similarproduct, setsimilarproduct] = useState([]);
  console.log(similarproduct, 'similarproduct');

  const [idOfProduct, setIdOfProduct] = useState();

  console.log(idOfProduct, 'idOfProduct');


  const Similar = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/product/similar/' + idOfProduct + '/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setsimilarproduct(json)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  };



  const Getdata = ({ item, index }) => {
    const imageUrls = item.images.split('|');
    const imagee = imageUrls[0];
    const [likedCards, setLikedCards] = useState([]);

    const [wishlist, setWhislist] = useState([])
    const [distace, setDistance] = useState([])

    const [shoplatitude, shoplongitude] = item.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const [address, setAddress] = useState(null);



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
  
    // console.log(item.product_id,'ejdejdg');
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

    const likeData = (product_id) => {
      const url = product_id;
      const updatedUrl = url.replace(".html", "");
      console.log(updatedUrl, 'updatedUrl')
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

      setIdOfProduct(item.product_id)
      Datawhislist();
      distanceGet()
      getAdress()
    }, [])
  



    return (<>

      <View style={{ padding: 6 }}>
        <View style={styles.maincard}>
          <View style={styles.Imagecontainer}>
            <View style={styles.Imagecontainer}>

              <ImageBackground key={index} source={{ uri: imagee }} style={styles.image} >
                {item.discount == null ? null :
                  <View style={styles.per}>
                    <Text style={styles.txtper}>{item.discount}%</Text>
                  </View>
                }
                <View />
                <TouchableOpacity onPress={() => handleHeartPress(item)}>
                  {likedCards[item.product_id] == true ? (
                    <Image style={styles.heartim} source={require('../../Assets/redheart.png')} />
                  ) : (
                    <Image style={styles.heartim} source={require('../../Assets/heart.png')} />
                  )}
                </TouchableOpacity>
              </ImageBackground>

              {/* ))} */}

            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DetailSearch', { item,distace, data, ScreenNavigation: "Search" })}>
            <View style={{ marginLeft: hp('2%') }}>
              <Text style={styles.textColor}>{item.brand}</Text>
              <Text style={styles.txtclr}>{item.name.slice(0, 14)}...</Text>
              <Text style={styles.txtdlr}>{item.current_price} €</Text>
              <View style={styles.maintx}>
                <Text style={[styles.txtclr,{fontSize:hp('1.7%')}]} numberOfLines={1}>{item.area}</Text>
                <Text style={styles.txtclr1}>{distace} km</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      </View>

    </>)
  };


  const Similardata = ({ item, index }) => {
    const imageUrls = item.images.split('|');
    const similarimage = imageUrls[0]
    return (<>
      <View style={styles.maina}>
        <View style={styles.txman}>
          <TouchableOpacity onPress={() => navigation.navigate('RelatedProducts', { item })}>
            <View style={styles.imgfl}>
              <View >
                <ImageBackground style={styles.img1} source={{ uri: similarimage }}>
                  <Image style={styles.imgh} source={require('../../Assets/heart.png')} />
                </ImageBackground>
                <Text style={styles.txtonimg}>{item.brand}</Text>
                <Text style={styles.txton7}>{item.current_price}</Text>
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
      <SafeAreaView style={{ backgroundColor: '#15181E', height: '100%' }}>
      <Topbar Textheading={'Buscar'} navigation={navigation} />
        <ScrollView>
          <View style={styles.MainFlx}>
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
                  <TouchableOpacity onPress={onImgPress}>
                    <View style={[styles.ll, { backgroundColor: imageBackgroundColor }]}>
                      <Image
                        style={styles.mi}
                        source={require('../../Assets/minus.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onHombrePress}>
                    <View style={[styles.hom, { backgroundColor: hombreBackgroundColor }]}>
                      <Text style={styles.homtx}>HOMBRE</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onMujerPress}>
                    <View style={[styles.muj, { backgroundColor: mujerBackgroundColor }]}>
                      <Text style={styles.mujtx}>MUJER</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={styles.txtHead}>Elege una marca</Text>

                <TouchableOpacity onPress={() => actionSheetBrand.current?.show()}>
                  <View style={styles.ree}>
                    <View style={styles.r1}>
                    </View>
                    <Text style={{ color: White }}>{selectedBrandCount >1 ? selectedBrandCount : null}  {selectedBrandCategory}</Text>
                    <Image style={styles.de} source={require('../../Assets/down.png')} />
                  </View>

                </TouchableOpacity>
                <BottomActionSheet ref={actionSheetBrand} title={'Title'} 
                onOpen={handleBottomSheetOpen}
                onClose={handleBottomSheetClose}
                >
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


                <Text style={styles.txtHead}>Elege una o mas subcategorias</Text>


                <TouchableOpacity onPress={() => actionSheetSubCategory.current?.show()}>
                  <View style={styles.ree}>

                    <View style={styles.r1}>
                    </View>
                    <Text style={{ color: White }}>{selectedSubcategories}</Text>
                    <Image style={styles.de} source={require('../../Assets/down.png')} />
                  </View>
                </TouchableOpacity>
                <BottomActionSheet ref={actionSheetSubCategory} title={'Title'}>
                  <CustombrandSubCat actionSheetSubCategory={actionSheetSubCategory}
                     subcatData={subcategory}
                    onSubcategorySelect={handleSubcategorySelection}
                  />
                </BottomActionSheet>

                <Text style={styles.txtHead}>Precio maximo</Text>
                <TextInput
                  ref={searchRef}
                  onChangeText={txt => SearchPrice(txt)}
                  style={styles.input1}
                  // onChangeText={onChangeNumber}
                  // value={number}
                  placeholder="109.99"
                  placeholderTextColor='#fff'

                />
              </View>
              :
              null}


            <View style={styles.hrline} />

            <Text style={styles.txttoda}>Todas las prendas</Text>

            <View style={styles.backFlat}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={searchdata} // Use the filtered data based on the search text
                numColumns={2}
                renderItem={({ item, index }) => <Getdata item={item} index={index} />}
              />
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

                 <Similardata item={item} index={index} />
                )} />

            </View>

            <View style={{ marginVertical: hp('4%') }}></View>

          </View>
          <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Search

const styles = StyleSheet.create({
  input1: {
    backgroundColor: '#333333',
    height: 40,
    borderWidth: 1,
    color:'#fff',
    padding: 5,
    paddingLeft: 14,
    borderRadius: 10,
    borderColor: LightYellow,

  },
  imgfl: {
    flexDirection: 'row',
  },
  imgh: {
    height: hp('2.5%'),
    width: wp('5%'),
    marginLeft: hp('-6%'),
    marginTop: hp('2%'),
  },
  txtonimg: {
    color: '#595959',
    marginTop: hp('-13%'),
    alignSelf: 'center',
    fontSize: hp('2.2%'),
    fontWeight: '700',
  },
  txton7: {
    color: '#595959',
    alignSelf: 'center',
    fontSize: hp('2.2%'),
  },
  img1: {
    alignSelf: 'center',
    height: hp('29.7%'),
    width: wp('49.7%'),
    borderRadius: 6,

  },
  txman: {
    backgroundColor: '#999999',
    height: hp('30%'),
    width: wp('50%'),
    borderRadius: 5,
    margin: 5,
  },
  maina: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('6.8%'),
  },
  txtprod: {
    color: White,
    fontSize: hp('2.2%'),
    fontWeight: '700',
    marginTop: hp('3%'),
  },
  backFlat: {
    backgroundColor: '#15181E',
    height: 'auto',
  },
  Imagecontainer: {
    width: wp('46.5%'),
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
    width: wp('46%'),
    height: hp('20.1%'),
    borderRadius: 30,
    position: 'absolute',
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
    marginLeft: hp('0.2%'),
  },
  Imagecontainer: {
    width: wp('43.8%'),
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
    marginLeft: hp('1.2%'),
    marginTop: hp('0.8%'),
    alignItems:"center",
    justifyContent:"center"
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
    width: wp('43.8%'),
    height: hp('20%'),
    borderRadius: 30,
    position: 'absolute',
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
    height: hp('4.9%'),
    width: wp('39%'),
    marginLeft: hp('0.5%'),
    borderRadius: 10,
  },
  homtx: {
    color: White,
    fontWeight: '600',
    marginTop: hp('1.1%'),
    alignSelf: 'center',
  },
  muj: {
    backgroundColor: '#333333',
    height: hp('4.9%'),
    width: wp('41%'),
    marginLeft: hp('0.5%'),
    borderRadius: 10,
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
})


