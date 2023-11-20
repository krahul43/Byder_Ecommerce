import { StyleSheet, Text, View, StatusBar, ScrollView, Linking, Image,Platform, SafeAreaView,TouchableOpacity } from 'react-native'
import React from 'react'
import Topbarback from '../../Components/Topbarback'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow, White } from '../../Components/ColorConst/ColorConst';


const MapsScreen = ({ navigation }) => {


    // for Map open in both platform
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const lat = "40.7127753";
const lng = "-74.0059728";
    const latLng = `${lat},${lng}`; // for latitude and longitude stting
    const label = 'Custom Label';
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });
    return (
        <>
            <StatusBar backgroundColor={'#000'} />
            <SafeAreaView>
            <Topbarback navigation={navigation} />
            <ScrollView>
                <View style={styles.main2}>
                    <View style={styles.txtman}>
                        <Text style={styles.txt5}>ATENCION </Text>
                        <Text style={styles.txtdesc}>Anique no es obligatorio reservar, si vas a la tienda{'\n'}sin reserva, no podemos garantizar que el producto y{'\n'} tallas(s) esten disponibles cuando vayas</Text>

                    </View>

                    <View style={styles.txtrembolso}>
                        <Text style={styles.txtdescrembolso}>5% de reembolso </Text>
                        <Text style={styles.txtdesc2}>Si comprar en tienda online,padras obtener el{'\n'}reembolso subiendo el ticket de compra en:</Text>
                        <Text style={[styles.txtdesc2, { marginTop: hp('1.1%') }]}>Mi Perfil Mis Pedidos Pedido Subir Ticket</Text>
                    </View>

                    <TouchableOpacity onPress={() => Linking.openURL(url)} style={styles.map}>
                        <Image style={styles.mapimg} source={require('../../Assets/location.png')} tintColor='#fff' />
                        <Text style={styles.txab}>Ver ubicacion sin reserver</Text>
                    </TouchableOpacity>





                </View>
            </ScrollView>
            </SafeAreaView>
        </>
    )
}
export default MapsScreen
const styles = StyleSheet.create({
    main2: {
        flex: 1,
        backgroundColor: '#221D28',
        padding: 10,
        height: hp('105%'),
    },
    txtman: {
        backgroundColor: '#332200',
        height: hp('12.9%'),
        width: wp('93%'),
        borderWidth: 2,
        borderColor: '#665200',
        borderRadius: 7,
    },
    txtrembolso: {
        marginTop: hp('2.2%'),
        backgroundColor: '#132b26',
        height: hp('15%'),
        width: wp('93%'),
        borderWidth: 2,
        borderColor: '#173f32',
        borderRadius: 7,
    },
    txt5: {
        color: '#d9a640',
        paddingLeft: 10,
        fontWeight: '700',
        fontSize: hp('2%'),
        marginTop: hp('1.5%'),

    },
    txtdescrembolso: {
        color: '#22cd7c',
        paddingLeft: 10,
        fontWeight: '700',
        fontSize: hp('2%'),
        marginTop: hp('1.5%'),

    },
    txtdesc: {
        color: '#ae8637',
        paddingLeft: 10,
        fontWeight: '700',
        fontSize: hp('1.9%'),

    },
    txtdesc2: {
        color: '#1e9e63',
        paddingLeft: 10,
        fontWeight: '700',
        fontSize: hp('1.9%'),

    },
    map: {
        flexDirection: 'row',
        height: hp('6%'),
        width: wp('92.5%'),
        borderRadius: 7,
        marginLeft: 3,
        backgroundColor: '#ff7674',
        marginTop: hp('3%'),
    },
    txab: {
        color: '#fff',
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


})