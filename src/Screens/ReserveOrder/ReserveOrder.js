import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react';
import Topbarback from '../../Components/Topbarback';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Black, LightYellow, White } from '../../Components/ColorConst/ColorConst';
import { Baseurl } from '../../Components/Baseurl';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import Loader from '../../Components/Loader';

const ReserveOrder = ({ navigation, route }) => {




  const { userToken, userName, password } = useContext(AuthContext);
  console.log(typeof userName, 'userName');
  console.log(password, 'password');
  const [reservData, setReservData] = useState([])
  const [ticketData, setTicketData] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log(ticketData,'ticketData')
  const [loaderVisible, setLoaderVisible] = useState(false);
  const loginCred = base64.encode(userName + ':' + password)

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const retrieveOrderDetailsFromAsyncStorage = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orderid');
      const ordersArray = ordersData ? JSON.parse(ordersData) : []; 
          setTicketData(ordersArray);
    } catch (error) {
      console.error('Error retrieving order details from AsyncStorage:', error);
    }
  };

  const ReserveData = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/user/' + userName + '/orders/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setReservData(json.orders)
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })

  }
  useEffect(() => {
    ReserveData();
    retrieveOrderDetailsFromAsyncStorage()
  }, [])

  const Ticketdata = ({ item, index }) => {
    const [product, setProduct] = useState([])
    const [productName, setProductName] = useState([])
    const [productPricce, setProductPrice] = useState([])
    const [productImg, setProductImg] = useState('')
    const [sizeProduct, setSizeProduct] = useState([])
    const [imageArray, setImageArray] = useState([])
    let ImageOfTicket = null

    const ProductGet = () => {
      fetch(Baseurl + '/api/product/' + item.product_id + '/', {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": `Basic ${loginCred}`,
        },
      }).then((response) => response.json())
        .then((res) => {

          setProduct(res[0])
          setProductName(res[0].name)
          setProductPrice(res[0].current_price)
          const imageUrls = res[0].images.split('|');
          const firstImageUrl = imageUrls[0];
          setProductImg(firstImageUrl)
          let SizeProduct = res[0].sizes.split('|');
          setSizeProduct(SizeProduct)
          setImageArray(res[0].images)
          console.log(res, 'console.product');
        })
        .catch((error) => {

          console.error(error)
        })

    }
    useEffect(() => {
      ProductGet();
    }, [])


    return (
      <>

        <View style={styles.cardMain}>
          <TouchableOpacity style={styles.imgmain} onPress={() => navigation.navigate('Submit', { ScreenNavigation: 'ReserveOrder', orderIdGet: item.order_id, imageTicket: ImageOfTicket, name: product.name, sizesArray: sizeProduct, selectedSize: '30', images: imageArray, userName, currentDate: formatDate(currentDate), current_price: product.current_price, product_id: product.product_id })}>
            <ImageBackground source={{ uri: productImg }} style={styles.backimg}>
              <View style={styles.mainedit}>
                <View style={styles.discountMain}>
                  <Text style={styles.txtb}>Ticket en revision</Text>
                </View>
              </View>
              <Text style={styles.txtTitle}>{productName}</Text>
              <Text style={styles.txtPrice}>{productPricce}$</Text>
              {/* <Text style={styles.txtPrice}>{item.order_id}</Text> */}
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const ReserveGetdata = ({ item, index }) => {
    const [product, setProduct] = useState([])
    const [productName, setProductName] = useState([])
    const [productImg, setProductImg] = useState('')
    const [sizeProduct, setSizeProduct] = useState([])
    const [imageArray, setImageArray] = useState([])
    let ImageOfTicket = null

    const ProductGet = () => {
      fetch(Baseurl + '/api/product/' + item.product_id + '/', {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": `Basic ${loginCred}`,
        },
      }).then((response) => response.json())
        .then((res) => {

          setProduct(res[0])
          setProductName(res[0].name)
          const imageUrls = res[0].images.split('|');
          const firstImageUrl = imageUrls[0];
          setProductImg(firstImageUrl)
          let SizeProduct = res[0].sizes.split('|');
          setSizeProduct(SizeProduct)
          setImageArray(res[0].images)
          // console.log(res, 'console.product');
        })
        .catch((error) => {

          console.error(error)
        })

    }
    useEffect(() => {
      ProductGet();
    }, [])


    return (
      <>

        <View style={styles.cardMain}>
          <TouchableOpacity style={styles.imgmain} onPress={() => navigation.navigate('StoreSubmit', { ScreenNavigation: 'ReserveOrder', orderIdGet: item.order_id, imageTicket: ImageOfTicket, name: product.name, sizesArray: sizeProduct, selectedSize: item.sizes[0], images: imageArray, userName, currentDate: formatDate(currentDate), current_price: product.current_price, product_id: product.product_id })}>
            <ImageBackground source={{ uri: productImg }} style={styles.backimg}>
              <View style={styles.mainedit}>
                <View style={[styles.discountMain,{width:wp('20%')}]}>
                  <Text style={styles.txtb}>Reservado</Text>
                </View>
              </View>
              <Text style={styles.txtTitle}>{productName}</Text>
              <Text style={styles.txtPrice}>{item.frozen_price}$</Text>
              {/* <Text style={styles.txtPrice}>{item.order_id}</Text> */}
            </ImageBackground>
          </TouchableOpacity>
        </View>
       
      </>
    );
  };
  return (
    <>

      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.main2}>
      <Topbarback Textheading={'Mis Pedidos'} navigation={navigation} />


      <View style={{padding:10,marginBottom:hp('7%')}} >
        <Text style={styles.txtop}>Mis Pedidos</Text>
       
        <ScrollView>
        {ticketData.length > 0 ?
        <Text style={[styles.txtop, { marginTop: hp('0.1%'), marginLeft:2,fontSize: hp('2.1%') }]}>TICKET EN REVISION</Text>
        : null }
        <FlatList
            showsHorizontalScrollIndicator={false}
            data={ticketData}
            renderItem={({ item, index }) => <Ticketdata item={item} index={index} />}
          />

        <Text style={[styles.txtop, { marginTop: hp('2.1%'),marginLeft:2, fontSize: hp('2.1%') }]}>RESERVADO</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={reservData}
            renderItem={({ item, index }) => <ReserveGetdata item={item} index={index} />}
          />

          <View style={{ marginVertical: hp('3%') }}></View>
          <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
        </ScrollView>
        <View style={{marginVertical:hp('10%')}}/>
      </View>
     
      </SafeAreaView>

    </>
  )
}

export default ReserveOrder

const styles = StyleSheet.create({
  main2: {
    flex: 1,
    backgroundColor: '#15181e',
    // padding: 10,
    // height: hp('124%'),
  },
  cardMain: {
    justifyContent: "center",
    alignItems: 'center',
    // height:hp('20%'),
  },
  txtop: {
    fontSize: hp('2.2%'),
    color: 'white',
    fontWeight: "700",
  },
  imgmain: {
    height: hp('17.6%'),
    width: wp('92.5%'),
    marginTop: hp('2.2%'),
    borderWidth: 1,
    borderColor: '#737373',
    borderRadius: 10,
    backgroundColor: '#556562eb',
    overflow: 'hidden',
    // padding:8
  },
  backimg: {

    height: hp('17.6%'),
    width: wp('92.5%'),
    borderRadius: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  discountMain: {
    height: hp('3%'),
    width: wp('26%'),
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LightYellow,
    marginTop: hp('1.4%'),
    marginLeft: wp('1.9%'),
    // margin:10
  },
  txtb: {
    color: '#000',
    fontSize: hp('1.3%'),
    alignSelf: 'center',
    fontWeight: '500'
  },
  txtTitle: {
    color: Black,
    fontSize: hp('2.1%'),
    alignSelf: 'center',
    fontWeight: '500',
    marginTop: hp('1.2%')
  },
  txtPrice: {
    color: Black,
    fontSize: hp('2.1%'),
    alignSelf: 'center',
    fontWeight: '500',
    marginTop: hp('0.2%')
  },
  edittxt: {
    fontSize: hp('2.2%'),
    color: 'white',
    fontWeight: "700",
    marginTop: hp('1.4%'),
    marginLeft: wp('32%'),
    color: Black,
  },
  mainedit: {
    flexDirection: 'row',

  },
})