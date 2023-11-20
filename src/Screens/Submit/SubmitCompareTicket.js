
import { StyleSheet, Text, View, StatusBar, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Topbarback from '../../Components/Topbarback'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainBlack, White } from '../../Components/ColorConst/ColorConst';
import ImageCropPicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';

const SubmitCompareTicket = ({ navigation, route }) => {
  const {imageTicket, orderIdGet, name, images, sizesArray, currentDate, current_price, product_id } = route.params
  const [frontimage, setFrontimage] = useState(imageTicket);
  const [imageasync, setimageasync] = useState(null);
  const [showoption, setShowoption] = useState(false);
  const { userToken, userName, password } = useContext(AuthContext);
  const loginCred = base64.encode(userName + ':' + password)

  const [orderidd, setOrderid] = useState(orderIdGet);
  console.log(orderidd, 'orderid');

  const openGalleryFron = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(frontimage => {
      console.log(frontimage);
      setShowoption(false)
      setFrontimage(frontimage.path)
      AsyncStorage.setItem("imagetoken", frontimage.path);
      return frontimage;
    }).then((frontimage) => {
      const newOrder = {
        // order_id: response.order_id,
        product_id: product_id,
        imageStore: frontimage.path
        // ... other order details ...
      };

      // Retrieve existing orders from AsyncStorage or initialize an empty array
      AsyncStorage.getItem('orderid')
        .then((existingOrders) => {
          const ordersArray = existingOrders ? JSON.parse(existingOrders) : [];
          ordersArray.push(newOrder);

          // Store the updated orders array back in AsyncStorage
          AsyncStorage.setItem('orderid', JSON.stringify(ordersArray));
        })

    })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    const retrieveImageFromAsyncStorage = async () => {
      try {
        const ordersData = await AsyncStorage.getItem('orderid');
        const ordersArray = ordersData ? JSON.parse(ordersData) : [];

        for (const order of ordersArray) {
          if (order.product_id === product_id) {
            setFrontimage(order.imageStore);
            console.log(order, 'async order')
            break; // No need to continue searching if found
          }
        }
      } catch (error) {
        console.error('Error retrieving image from AsyncStorage:', error);
      }
    };

    retrieveImageFromAsyncStorage();
  }, []);

  const removeOrderForProduct = async (product_id) => {
    try {
      const ordersData = await AsyncStorage.getItem('orderid');
      let ordersArray = ordersData ? JSON.parse(ordersData) : [];
  
      // Find the index of the order with the specified product_id
      const orderIndex = ordersArray.findIndex(order => order.product_id === product_id);
  
      if (orderIndex !== -1) {
        // Remove the order from the array
        ordersArray.splice(orderIndex, 1);
        setFrontimage(null);
  
        // Update AsyncStorage with the modified array
        await AsyncStorage.setItem('orderid', JSON.stringify(ordersArray));
        console.log('Order data for product removed successfully');
      } else {
        console.log('Product not found in orders');
      }
    } catch (error) {
      console.error('Error removing order data for product:', error);
    }
  };


 


  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.main2}>
      <Topbarback Textheading={'Subir ticket'} navigation={navigation} />
      <View style={{padding:8}}>
        <Text style={styles.subti}>Subir ticket </Text>

        <View style={styles.searcmain}>
          <View style={styles.srchmainim}>
            <TouchableOpacity onPress={() => {
              openGalleryFron(); // Call openGalleryFron first
            }}>
              {frontimage ?
                <Image source={{ uri: frontimage }} style={styles.srchim} />
                :
                <Image style={styles.srchim} source={require('../../Assets/camera.png')}  />
              }
            </TouchableOpacity>
            <Text style={styles.input} >Choose an Image</Text>
            <TouchableOpacity onPress={()=>removeOrderForProduct(product_id) }>
              <Image style={styles.crossimg} source={require('../../Assets/cross.png')} tintColor='#959596' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </SafeAreaView>
    </>
  )
}
export default SubmitCompareTicket
const styles = StyleSheet.create({
  main2: {
    flex: 1,
    backgroundColor: '#15181e',
    // padding: 10,
    // height: hp('124%'),
  },
  subti: {
    color: '#727375',
    fontSize: hp('1.9%'),
    fontWeight: '600',
    marginLeft: hp('0.6%'),
  },
  searcmain: {
    height: hp('6%'),
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272a30',
    width: wp('93%'),
    marginTop: hp('0.6%'),
    marginLeft: hp('0.6%'),
    borderRadius: 10,
  },
  srchmainim: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: hp('1.2%'),
    marginRight: hp('1.8%'),
    justifyContent: "space-between",
  },

  srchim: {
    height: hp('3.5%'),
    width: wp('7%'),
    // marginTop: hp('1.2%'),
    marginLeft: hp('1%'),
    alignSelf: 'center'
  },

  crossimg: {
    height: hp('2.6%'),
    width: wp('5.2%'),
    marginTop: hp('0.4%'),
    marginLeft: hp('1%'),
    alignSelf: 'center'
  },
  input: {
    color: '#959596',
    width: wp('50%'),
    marginLeft: hp('-6.7%'),
    alignSelf: 'center',
    fontWeight: '600'

  },
  hrline: {
    height: hp('0.2%'),
    width: wp('92%'),
    backgroundColor: '#333333',
    marginTop: hp('-2%'),
    alignSelf: 'center',
  },
})