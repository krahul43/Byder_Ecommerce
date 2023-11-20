import { StyleSheet, Text, View,StatusBar, Image,FlatList, TouchableOpacity, ScrollView, Dimensions, ImageBackground } from 'react-native'
import React,{useContext,useState} from 'react'
import { Black ,LightYellow,MainBlack,White} from '../../Components/ColorConst/ColorConst'
import { AuthContext } from '../../Components/AuthContext'
import { Baseurl } from '../../Components/Baseurl'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'
import base64 from 'react-native-base64'
const Editorder = ({navigation,route}) => {
    const {product_id,frozen_price,order_id,sizes,order_date,product} = route.params
    const ordersize=sizes;
        
    console.log(ordersize,'ordersize')

    // console.log(res[0].sizes,'res')
    console.log(product,'res1')
    const imagesArray = product.images.split('|');
    const images=imagesArray[0]
    console.log(images,"images");
 
    // const getapisize=[res[0].sizes.split('|')];
    const getapisize = product.sizes.split('|').map(size => size.trim());

    const getapisizeArray = Array.isArray(getapisize) ? getapisize : [];
    console.log(getapisizeArray,'getapisizeArray')

    // const size=res.sizes
    // console.log(sizesArray,'size')
    const { userToken,userName,password } = useContext(AuthContext);
    const filteredSizes = getapisize.filter(size => size === sizes);
// console.log(sizesArray,"sizesArray")
    const loginCred = base64.encode(userName + ':' + password)
    // const getAvailableSizes = (selectedSize) => {
    //     const allSizes = ['S', 'M', 'L', 'XL'];
    //     return allSizes.filter((size) => size !== selectedSize);
    //   };
    
    //   // Function to handle size click (you may modify this if needed)
    //   const handleSizeClick = (size) => {
    //     // Handle size click here if required
    //   };
    
      // const availableSizes = getAvailableSizes(sizes);
      const handleSizeClick = (size) => {
        setSelectedSize(size);
        console.log("Selected Size:", size);
      };

      const name=product.name
      console.log(name,'name')

      const [selectedSize, setSelectedSize] = useState(sizes); // State to store selected size

      // const availableSizes = getapisize;
      // console.log(availableSizes,'availableSizes'); // Add this line
    const EditData = () => {

     
         let formData = new FormData();
         formData.append('user', userName)
         formData.append('product', product_id)
         formData.append('sizes', sizes)
         formData.append('order_date', order_date)
         formData.append('frozen_price', frozen_price)
         formData.append('order_id', order_id)
    
   
         fetch(Baseurl + '/api/order/'+ order_id +'/', {
        
           method: 'Put',
          
        
            headers: {
              "Accept": "application/json",
              "Content-Type": "multipart/form-data",
              "Authorization": `Basic ${loginCred}`,
              "Referer":"https://byder-backend-3l2yk.ondigitalocean.app",
              "X-CSRFTOKEN": userToken, // Include the CSRF token in the headers
            
           },
           
           body: formData
         }).then((result) => {
          // console.log('preet')
           result.json().then((response) => {
   
             // setModalVisible(false)
            //  AsyncStorage.setItem("userToken", token);
            //  AsyncStorage.setItem("password", password);
            //  AsyncStorage.setItem("userName", userName);
            //  navigation.navigate('Home')
             console.log(response, "Editorder Response");
           }).catch((err) => {
             // setModalVisible(false)
             console.log('harpret')
             console.log(err)
           })
         })

     }
  


  return (
    <>
      {/* <View>
        <TouchableOpacity onPress={EditData}>
      <Text style={styles.txtcolor}>Edit</Text>

        </TouchableOpacity>
      <Text style={styles.txtcolor}>userName: {userName}</Text>

      <Text style={styles.txtcolor}>Order_id: {order_id}</Text>
      <Text style={styles.txtcolor}>Size: {sizes}</Text>
      <Text style={styles.txtcolor}>Product_id: {product_id}</Text>
      <Text style={styles.txtcolor}>Price: {frozen_price}</Text>
      <Text style={styles.txtcolor}>order_date: {order_date}</Text>
    </View> */}
          
          <ScrollView>
        <View style={styles.main2}>
        <TouchableOpacity onPress={EditData}>
      <Text style={styles.txtcolor}>Edit</Text>

        </TouchableOpacity>
          {/* <View style={styles.txtmain1}>
            <TouchableOpacity style={styles.txtbo} onPress={() => navigation.navigate('SeeInStore')}>
              <Image style={styles.img} source={require('../../Assets/location.png')} />
              <Text style={styles.txtv}>
                Ver en tienda
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.txtbo2} onPress={() => navigation.navigate('CompareOnline')}>
              <Image style={styles.imgs} source={require('../../Assets/shopping-cart.png')} />
              <Text style={styles.txtv}>
                Comprar online
              </Text>
            </TouchableOpacity>
          </View> */}
          <Text style={styles.txtt}>Tallas disponibles</Text>
          <View style={{ flexDirection: 'row' }}>
{/* 
          <TouchableOpacity
        style={[
          styles.txma1,
          { backgroundColor: '#DAFDA5' } // Apply different style to the selected size
        ]}
        onPress={() => handleSizeClick(sizes)}
        disabled={true} // Disable the TouchableOpacity for the selected size to prevent selection
      >
        <Text
          style={[
            styles.txttt,
            { color: 'black' } // Apply different text color for the selected size
          ]}
        >
          {sizes}
        </Text>
      </TouchableOpacity> */}

{getapisizeArray.map((size, index) => (
          <TouchableOpacity
              key={index}
              style={[
                styles.txma1,
                {
                  backgroundColor:
                    selectedSize === size ? '#DAFDA5' : 'transparent',
                },
              ]}
              onPress={() => handleSizeClick(size)}
            >
              <Text
                style={[
                  styles.txttt,
                  selectedSize === size
                    ? { color: 'black' }
                    : { color: 'white' },
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}

{/* <TouchableOpacity
                    key={index}
                    style={[
                      styles.txma1,
                      selectedSize === size ? { backgroundColor: '#DAFDA5' } : {} // Apply different style to the selected size
                    ]}
                    onPress={() => handleSizeClick(size)}
                  >
                    <Text
                      style={[
                        styles.txttt,
                        selectedSize === size ? { color: 'black' } : {} // Apply different text color for the selected size
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity> */}



          </View>
          <Text style={styles.txtadima}>{name}</Text>

          <View style={styles.txt6main}>
                        <View style={styles.txt66mn}>
                            <View>
                                <Text style={styles.txt66}>{frozen_price} €</Text>
                            </View>
                       
                        </View>
                        <View>
                            <Text style={styles.txtA7}>A 7,105.1 km de ti</Text>
                        </View>
                    </View>
                    <View style={styles.shoebac}>
<Image style={styles.shoeimg} source={{uri:images}} />
</View>



        </View>
      </ScrollView>
    </>
  
  )
}

export default Editorder

const styles = StyleSheet.create({
    txtcolor:{
        color:White,
        alignSelf:'flex-end',
        fontSize:hp('2.5%'),
        marginBottom:wp('2%'),
    },
    main2: {
        flex: 1,
        backgroundColor: '#15181e',
        padding: 10,
        // height: hp('124%'),
    },
    txtmain1: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    txtbo: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: LightYellow,
        height: hp('5%'),
        width: wp('45%'),
        borderRadius: 7,
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
        width: wp('4.5%'),
    },
    txtv: {
        color: LightYellow,
        fontSize: hp('2.4%'),
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: hp('0.1%'),
        marginLeft: hp('1%'),
    },
    txtt: {
        color: '#8C8C8C',
        fontSize: hp('1.9%'),
        marginTop: hp('1.5%'),
        padding: 5,
        fontWeight: '500',
    },
    txma1: {
      backgroundColor: '#333333',
      height: hp('4%'),
      width: wp('10%'),
      borderRadius: 14,
      marginLeft: hp('1%'),
  },
    txttt: {
        color: White,
        alignSelf: 'center',
        marginTop: hp('0.6%'),
    },
    txt66mn: {
        flexDirection: 'row',
    },
    txt6main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txtadima: {
        color: White,
        padding: 6,
        fontSize: hp('2.1%'),
        fontWeight: '700',
        marginTop: hp('1.9%'),
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
    },
    shoebac: {
        backgroundColor: White,
        flexDirection: 'row',
        height: hp('63%'),
        width: wp('80%'),
        marginLeft: hp('4%'),
    },
    shoeimg: {
        width: wp('80%'),
        height: hp('34%'),
        marginTop: hp('6%'),
        // marginBottom:wp('10%'),
    },
})