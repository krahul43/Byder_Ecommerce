import { StyleSheet, Text, View, StatusBar, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import Topbarback from '../../Components/Topbarback'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow, White } from '../../Components/ColorConst/ColorConst';
import Swiper from 'react-native-swiper';
import { Baseurl } from '../../Components/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import { AuthContext } from '../../Components/AuthContext';
import { useIsFocused } from '@react-navigation/native';
// import { useFocusEffect } from '@react-navigation/native';

const StoreSubmit = ({ navigation, route }) => {

    const {distace, brandName, imageTicket, orderIdGet, StoreSubmit, name, images, sizesArray, selectedSize, currentDate, current_price, product_id } = route.params
    const { userToken, userName, password } = useContext(AuthContext);

    const loginCred = base64.encode(userName + ':' + password)
    const imageUrls = images.split("|");
    const isFocused = useIsFocused();


    const [orderProductId, setOrderProductId] = useState(null);
    const [orderid, setOrderid] = useState(orderIdGet);
    const [reservData, setReservData] = useState('')
    const [reservDate, setReservDate] = useState('')
    console.log( reservData, ' reservData reservData')
    console.log(userToken, 'userToken')

    
// get all book data or reserve data detail
    const ReserveData = () => {
        fetch(Baseurl + '/api/user/' + userName + '/orders/', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
                "Authorization": `Basic ${loginCred}`,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                // Filter the orders based on a specific condition (product_id)
                const filteredOrders = json.orders.filter(order => order.product_id === product_id);
                // Extract relevant data (product_id, order_id) from the filtered orders
                const reservedData = filteredOrders.map(order => order.order_id);
                const reservedDataDate = filteredOrders.map(order => order.order_date);
                console.log(filteredOrders, 'filteredOrders')
                // Set the filtered and extracted data in state
                setReservData(reservedData);
                setReservDate(reservedDataDate.slice(0, 10));
            })
            .catch((error) => {
                console.error(error);
            });
    };


    useEffect(() => {
        const retrieveOrderDetailsFromAsyncStorage = async () => {
            try {
                const ordersData = await AsyncStorage.getItem('orderid');
                const ordersArray = ordersData ? JSON.parse(ordersData) : [];

                for (const order of ordersArray) {
                    if (order.product_id == product_id) {
                        setOrderid(order.product_id);
                        // setOrderProductId(order.product_id);
                        break; // No need to continue searching if found
                    }
                }
            } catch (error) {
                console.error('Error retrieving order details from AsyncStorage:', error);
            }
        };
        if (isFocused) {
            retrieveOrderDetailsFromAsyncStorage();
            ReserveData()
        }
    }, [isFocused]);


    const Deleteorder = () => {
        let abc = parseInt(reservData)
        setReservData([])
        fetch(Baseurl + '/api/order/'+reservData+ '/', {
            method: 'DELETE',
            headers: {
                // "Accept": "application/json",
                // "Content-Type": "multipart/form-data",
                // "Authorization": `Basic ${loginCred}`,
                "Referer": "https://byder-backend-3l2yk.ondigitalocean.app",
                "X-CSRFTOKEN": userToken, // Include the CSRF token in the headers
            },
        }).then((result) => {
            result.json().then((response) => {
                console.log( "Delete err Response");
          
                console.log(response, "Delete order Response");
            }).catch((err) => {
                console.log( "err err Response");
               
                console.log(err)
            })
        })
    }
    



    return (
        <>
            <StatusBar backgroundColor={'#000'} />
            <SafeAreaView style={styles.main2}>
            <Topbarback Textheading={'Store Submit'} navigation={navigation} />
            <ScrollView>
                <View style={{padding:8}}>
                    {orderid ? null :
                        <View style={styles.txtman}>
                            <Text style={styles.txt5}>5% de reembolso</Text>
                            <Text style={[styles.txtdesc, { marginTop: hp('0.3%') }]}>al subir el ticket de compra de la tienda{'\n'}
                                Tu dinero aparecera en:</Text>
                            <Text style={[styles.txtdesc, { marginTop: hp('1.1%') }]}>Mi Perfil Byder Wallet</Text>
                        </View>
                    }
                    <TouchableOpacity style={[styles.map, { borderColor: reservData.length > 0 ? '#0f4832' : '#ab5455' }]} onPress={() => navigation.navigate('MapsScreen')}>
                        <Image style={styles.mapimg} source={require('../../Assets/location.png')} tintColor={reservData.length > 0 ? '#01bf64' : '#fa7472'} />
                        <Text style={[styles.txab, { color: reservData.length > 0  ? '#01bf64' : '#fa7472' }]}>Abrir en Google Maps</Text>
                    </TouchableOpacity>
                    {reservData.length > 0  ?
                    <View style={styles.mntx}>
                    <Text style={styles.estx}>Recoger antes del </Text>
                    <Text style={styles.suta7}>Quedan 2 dias</Text>
                    </View>
                    : null }

                    <View style={styles.txtmain1}>
                        <TouchableOpacity style={styles.txtbo} onPress={() => navigation.navigate('OrderGenerate', {distace, reservData, reservDate, brandName, imageTicket, orderIdGet: orderid, name, images, sizesArray, selectedSize, currentDate, current_price, product_id })}>
                            <Image style={styles.img} source={require('../../Assets/calendar.png')}  tintColor={LightYellow} />
                            {reservData.length > 0 ?
                                <Text style={styles.txtv1}> Ver fecha de {'\n'}  recogida </Text>
                                :
                                <Text style={styles.txtv1}> Reservar en{'\n'}tienda gratis </Text>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SubirTicket', { imageTicket, orderIdGet: orderid, name, images, sizesArray, selectedSize, currentDate, current_price, product_id })}>
                            <View style={styles.txtbo}>
                                <Image style={styles.img2} source={require('../../Assets/cloud.png')} tintColor={LightYellow} />
                                {orderid ? (
                                    <Text style={styles.txtv2}>
                                        Editar ticket
                                    </Text>
                                ) : (
                                    <Text style={styles.txtv2}>
                                        Subir ticket
                                    </Text>
                                )}

                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.hrline} />
                    <View style={styles.mntx} >
                        <Text style={styles.estx}>Estado del pedido:</Text>
                        {/* <Text style={styles.sutx}>Sin reservar</Text> */}
                        {reservData.length > 0  ?
                            <Text style={[styles.sutx,{color:'#90b4c0'}]}>Reservado</Text>
                            : orderid ?
                                <Text style={styles.sutx}>Ticket en revision</Text>
                                :
                                <Text style={styles.sutx}>Sin reservar</Text>

                        }
                    </View>
                    <View style={styles.hrline2} />
                    <View style={styles.mntx} >
                        <Text style={styles.estx}>Centro</Text>
                        <Text style={styles.suta7}>{distace} km</Text>
                    </View>
                    <View style={styles.mainimj}>
                        <Swiper 
                         autoplay={false}
                        style={styles.wrapper} >
                            {imageUrls.map((imageUrl, index) => (
                                <View key={index} style={styles.slide}>
                                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                                </View>
                            ))}
                        </Swiper>
                    </View>
                    <View style={styles.bottomView}>
                        <Text style={styles.bltx} numberOfLines={1}>{name}</Text>
                        <Text style={styles.tx20}>{current_price} €</Text>
                        <View style={styles.hrline2} />
                        {reservData.length > 0  ?
                            <View>
                                <View style={styles.mntx} >
                                    <Text style={styles.estx}>Tienda</Text>
                                    <Text style={styles.tx202}>Centro</Text>
                                </View>
                                <View style={styles.hrline2} />
                                <View style={styles.mntx} >
                                    <Text style={styles.estx}>Precio</Text>
                                    <Text style={styles.tx202}>{current_price} €</Text>
                                </View>
                                <View style={styles.hrline2} />
                            </View>
                            : null}
                        {reservData.length > 0  ? (
                            <TouchableOpacity style={styles.addWalletSession} onPress={() => Deleteorder()}>
                                <Image source={require('../../Assets/delete.png')} style={styles.dollarImg} tintColor='#f77371' />
                                <Text style={[styles.txtName, { marginLeft: hp('1.4%'), fontSize: hp('2.1%'), color: '#f77371' }]}>Eliminar pedido</Text>
                            </TouchableOpacity>
                        ) : null}

                    </View>
                </View>
            </ScrollView>
            </SafeAreaView>
        </>
    )
}
export default StoreSubmit
const styles = StyleSheet.create({
    main2: {
        flex: 1,
        backgroundColor: '#15181e',
        // padding: 10,
        // height: hp('105%'),
    },
    txtman: {
        backgroundColor: '#332200',
        height: hp('15%'),
        width: wp('94%'),
        borderWidth: 2,
        borderColor: '#665200',
        borderRadius: 7,
        alignSelf:"center"
    },
    txt5: {
        color: '#B38F00',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: hp('2%'),
        marginTop: hp('1.5%'),
    },
    txtmain1: {
        marginTop: hp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        // alignSelf:"center",
        // marginLeft: hp('-0.5%'),
    },

    txtdesc: {
        color: '#ae8637',
        // paddingLeft: 10,
        textAlign: 'center',
        fontWeight: '700',
        fontSize: hp('1.9%'),
    },
    txtbo: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: LightYellow,
        height: hp('8%'),
        width: wp('45%'),
        borderRadius: 7,
    },
    img: {
        marginLeft: hp('2.5%'),
        alignSelf: 'center',
        height: hp('2.5%'),
        width: wp('4.5%'),
    },
    img2: {
        marginLeft: hp('3%'),
        alignSelf: 'center',
        height: hp('2.5%'),
        width: wp('4.5%'),
    },
    txtv1: {
        color: '#d5f7a2',
        fontSize: hp('2%'),
        fontWeight: '700',
        alignSelf: 'center',
        marginTop: hp('0.1%'),
        marginLeft: hp('2%'),
    },
    txtv2: {
        color: LightYellow,
        fontSize: hp('2%'),
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: hp('0.1%'),
        marginLeft: hp('2%'),
    },
    txtbo2: {
        flexDirection: 'row',
        backgroundColor: '#333333',
        borderRadius: 7,
        height: hp('6%'),
        width: wp('45%'),
    },
    imgs: {
        marginLeft: hp('1%'),
        alignSelf: 'center',
        height: hp('2.5%'),
        width: wp('4.5%'),
    },
    hrline: {
        height: hp('0.03%'),
        width: wp('96%'),
        backgroundColor: '#292c32',
        marginTop: hp('2%'),
    },
    mntx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%'),
    },
    estx: {
        color: '#e0e1e1',
        fontSize: hp('2.2%'),
        fontWeight: '600',
        marginLeft: hp('0.6%'),
    },
    sutx: {
        color: '#f8a101',
        fontSize: hp('2.2%'),
        fontWeight: '600',
        marginRight: hp('1.2%'),
    },
    hrline2: {
        height: hp('0.03%'),
        width: wp('96%'),
        backgroundColor: '#292c32',
        marginTop: hp('2%'),
    },
    suta7: {
        color: LightYellow,
        fontSize: hp('2.2%'),
        fontWeight: '600',
        marginRight:wp('1.8%')
    },
    mainimj: {
        backgroundColor: White,
        marginTop: hp('2%'),
        height: hp('50%'),
    },
    imgj: {
        height: hp('40%'),
        width: wp('60%'),
        alignSelf: 'center',
        marginTop: hp('4%'),
    },
    bltx: {
        color: White,
        fontSize: hp('2.7%'),
        fontWeight: '600',
        marginTop: hp('1%'),
    },
    tx20: {
        color: '#8C8C8C',
        fontSize: hp('2.1%'),

    },
    tx202: {
        color: '#8C8C8C',
        fontSize: hp('2.1%'),
        marginRight: 10
    },
    bottomView: {
        marginBottom: hp('8%'),
    },
    map: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#ab5455',
        height: hp('6%'),
        width: wp('94%'),
        borderRadius: 7,
        marginTop: hp('3%'),
        alignSelf: 'center',
    },
    txab: {
        // color:'#FF531A',
        color: '#fa7472',
        fontSize: hp('2.2%'),
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: hp('2%'),
    },
    mapimg: {
        marginLeft: hp('12%'),
        alignSelf: 'center',
        height: hp('2.5%'),
        width: wp('4.5%'),
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
    txtName: {
        fontSize: hp('2.4%'),
        color: 'white',
        fontWeight: "700",
        fontFamily: 'Avenir',
        textShadowColor: 'black',
    },
    dollarImg: {
        height: hp('2.2%'),
        width: wp('4.4%'),
    },
    addWalletSession: {
        flexDirection: 'row',
        height: hp('5.6%'),
        width: wp('92.5%'),
      alignSelf:"center",
        borderRadius: 10,
        backgroundColor: '#2d332d',
        marginTop: hp('2.2%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:hp('4%')
    },
})