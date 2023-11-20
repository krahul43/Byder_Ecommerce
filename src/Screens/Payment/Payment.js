import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Black, White, MainBlack } from '../../Components/ColorConst/ColorConst';
import { Dropdown } from 'react-native-element-dropdown';
import base64 from 'react-native-base64';
import { Baseurl } from '../../Components/Baseurl';
import { AuthContext } from '../../Components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Payment = ({ navigation, route }) => {
    const { name, images, sizesArray, selectedSize, currentDate, current_price, product_id } = route.params
    console.log(selectedSize);
    console.log(currentDate);
    console.log(current_price);
    console.log(product_id);
    console.log(sizesArray,"sizesArray");
    const imagesArray = images.split('|');
    console.log(imagesArray[0],"imagesArray");



    // console.log(selectedSize);
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(null);
    //   console.log(userData, '44444')
    const dataa = [
        { label: 'Canada', value: 'Canada' },
        { label: 'Usa', value: 'Usa' },
    ];

    const { userToken, userName, password } = useContext(AuthContext);

    console.log(userName, 'userName');
    console.log(password, 'password');
    console.log(userToken);

    const loginCred = base64.encode(userName + ':' + password)

    // const handleApiCall = async () => {
    //     try {
    //       const apiUrl = 'https://api.example.com/your-endpoint'; // Replace with your API endpoint URL
    //       const response = await fetch('https://byder-backend-3l2yk.ondigitalocean.app/api/order/', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ /* Your POST data here */ }),
    //       });
    //       const data = await response.json();
    //       console.log(data);
    //     } catch (error) {
    //       console.error('Error making API call:', error);
    //     }
    //   };




    const OrderData=()=>{
        let formData = new FormData();
        formData.append('user', userName)
        formData.append('sizes', selectedSize)
        formData.append('order_date', currentDate)
        formData.append('frozen_price', current_price)
        formData.append('product', product_id)

    //   console.log('preet');
      fetch('https://byder-backend-3l2yk.ondigitalocean.app/api/order/', {
        method: 'Post',
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": `Basic ${loginCred}`,
          "Referer":"https://byder-backend-3l2yk.ondigitalocean.app",
          "X-CSRFTOKEN": userToken, // Include the CSRF token in the headers
        },
        body: formData
      }).then((result) => {
        result.json().then((response) => {
          console.log(response, "order  Response");
        //   navigation.navigate('Profile', { sizesArray });
        //   AsyncStorage.setItem("userToken", response.csrf_token);
        }).catch((err) => {
          console.log(err)
        })
      })

    }
    return (
        <>
            <ScrollView>
                <Image style={styles.image} source={{ uri: imagesArray[0] }} />
                
                <Text style={styles.puretxt}>
                    {name}
                </Text>
                <Text style={styles.paytxt}>
                    {/* $ 65.00 */}{current_price}€
                </Text>

                <View style={styles.paybtn}>
                    <Text style={styles.pay2txt2}>
                        Pay
                    </Text>
                </View>
                <Text style={styles.paycardtxt}>

                    Or pay with card
                </Text>

                <Text style={styles.emailtxt}>

                    Email
                </Text>
                <TextInput
                    style={styles.input}

                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={styles.cardinfortxt}>

                    Card Information
                </Text>

                <View style={styles.container}>
                    <View style={styles.cardInfo}>
                        <TextInput
                            style={styles.cardNumberInput}
                            placeholder="Card Number"
                            keyboardType="numeric"
                            maxLength={16}
                        />
                        {/* <Image source={require('./visa-card.png')} style={styles.cardImage} resizeMode="contain" /> */}
                    </View>
                    <View style={styles.cardInfo}>
                        <TextInput
                            style={styles.expiryDateInput}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            maxLength={5}
                        />
                        <TextInput
                            style={styles.cvcInput}
                            placeholder="CVC"
                            keyboardType="numeric"
                            maxLength={3}
                        />
                    </View>
                </View>

                <View style={styles.border}>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: '#969696' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        // itemTextStyle={{color:"#000"}}
                        data={dataa}
                        maxHeight={170}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select Country ' : ' Select Country '}
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                        }} />
                </View>



                <TouchableOpacity style={styles.paybtn1} onPress={() => OrderData()}>
                    <Text style={styles.pay2txt}>
                        Pay
                    </Text>
                    <Text style={styles.paytext}>
                        {current_price}€
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </>
    )
}

export default Payment

const styles = StyleSheet.create({
    image: {
        alignSelf: 'center',
        height: hp('16%'),
        width: wp('36%'),
        marginTop: hp('3%'),
    },
    puretxt: {
        padding: 5,
        alignSelf: 'center',
        // marginTop:hp('0.7%'),
    },
    paytxt: {
        alignSelf: 'center',
        marginTop: hp('0.5%'),
    },
    paytext: {
        color: White,
        alignSelf: 'center',
        marginTop: hp('0.8%'),
        marginLeft: hp('0.8%'),
    },
    paybtn: {
        backgroundColor: Black,
        height: hp('5%'),
        width: wp('89%'),
        marginTop: hp('2%'),
        borderRadius: 8,
        alignSelf: 'center',
    },
    pay2txt2: {

        color: White,
        marginTop: hp('1.3%'),
        alignSelf: 'center',
    },
    pay2txt: {
        marginLeft: hp('18%'),
        color: White,
        marginTop: hp('0.7%'),
        alignSelf: 'center',
    },
    paycardtxt: {
        alignSelf: 'center',
        marginTop: hp('2%'),
    },
    emailtxt: {
        marginLeft: hp('3%'),
        marginTop: hp('1%'),
        color: Black,
    },
    input: {
        marginTop: hp('1%'),
        marginLeft: hp('3%'),
        borderColor: Black,
        borderWidth: 0.5,
        borderRadius: 5,
        height: hp('5%'),
        width: wp('89%'),
    },
    cardinfortxt: {
        marginLeft: hp('3%'),
        marginTop: hp('1%'),
        color: Black,
    },
    container: {
        padding: 20,
    },
    cardInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    cardNumberInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingLeft: 10,
    },
    cardImage: {
        width: 50,
        height: 30,
        marginLeft: 10,
    },
    expiryDateInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingLeft: 10,
    },
    cvcInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginLeft: 10,
        paddingLeft: 10,
    },
    paybtn1: {

        flexDirection: 'row',
        backgroundColor: Black,
        height: hp('5%'),
        width: wp('89%'),
        marginTop: hp('2%'),
        borderRadius: 8,
        alignSelf: 'center',
    },
    dropdown: {
        backgroundColor: '#F7F7F7',
        height: 50,
        borderRadius: 12,
        // elevation: 5,
        paddingLeft: 20
    },
    placeholderStyle: {
        // marginLeft: 15,
        fontSize: 14,
        // alignSelf:'center',
        // paddingLeft:5,
        color: '#969696'
    },
    selectedTextStyle: {
        fontSize: 14,
        // alignSelf:'center',
        // paddingLeft:5,
        color: '#000'
    },
    border: {
        marginTop: hp('-2.5%'),
    },
})