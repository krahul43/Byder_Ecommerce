import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ImageBackground, Image, TextInput, SafeAreaView } from 'react-native'
import React from 'react'
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Topbarback from '../../Components/Topbarback';

const SeeInStore = ({ navigation, route }) => {
  const { brandName, distace,images, name, current_price, orderIdGet, imageTicket } = route.params
  const imagesArray = images.split('|');
  // console.log(imagesArray,'imagesArray')
  const [On_Offstatus, setOn_OffStatus] = React.useState('ON');
  const [enableStatus, setEnableStatus] = React.useState(false);
  const [ticketStatus, setTicketStatus] = React.useState(false); //when ticket raise
  return (
    <>
      <StatusBar backgroundColor={'#000'} />

      <SafeAreaView style={styles.manFlex}>
      <Topbarback Textheading={'Ver en tienda'} navigation={navigation} />

        <View style={styles.main2}>
          {ticketStatus ?
            <View>
              <View style={styles.txtman}>
                <Text style={styles.txt5}>5% de reembolso </Text>
                <Text style={styles.txtdesc}>Si comprar en tienda online,padras obtener el{'\n'}reembolso subiendo el ticket de compra en:</Text>
                <Text style={[styles.txtdesc, { marginTop: hp('1.1%') }]}>Mi Perfil Mis Pedidos Pedido Subir Ticket</Text>
              </View>

              <View style={styles.maintic}>
                {enableStatus ?

                  <TouchableOpacity style={styles.tic} onPress={() => setEnableStatus(!enableStatus)}>
                    <Image style={styles.imtic} source={require('../../Assets/tickblack.png')} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.ticblack} onPress={() => setEnableStatus(!enableStatus)} />

                }
                <Text style={styles.iE}>iEntendido!</Text>
              </View>

              <Text style={styles.onof}>on_off</Text>
              <View style={styles.mainontx}>
                <TextInput
                  onChangeText={(e) => setOn_OffStatus(e)}
                  value={On_Offstatus}
                  autoCapitalize="characters"
                  style={styles.txton} />
              </View>
            </View>
            :
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('StoreSubmit', {distace, brandName, imageTicket, orderIdGet, name, current_price, images })} style={styles.txman}>
                <View style={styles.imgfl}>
                  <View>
                    <ImageBackground style={styles.img3} source={{ uri: imagesArray[0] }} >
                      <Text style={styles.txtonimg3}>{name}</Text>
                      <Text style={styles.txton7}>Ticket en revision</Text>
                    </ImageBackground>

                  </View>
                  {/* <Image style={styles.imgh} source={require('../Assets/heartwhite.png')} /> */}
                </View>
              </TouchableOpacity>
            </View>
          }
        </View>
      </SafeAreaView>
    </>
  )
}
export default SeeInStore
const styles = StyleSheet.create({
  manFlex: {
    flex: 1,
    backgroundColor: '#15181e',
  },
  Topimg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
  },
  txtMain: {
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '500',
    marginLeft: wp("18%")
  },
  can: {
    marginLeft: wp("3%"),
    fontSize: hp('2.2%'),
    fontWeight: '500',
    color: LightYellow,
  },
  bac: {
    color: LightYellow,
  },
  disabledButton: {
    opacity: 0.5, // example style for a disabled button
  },
  txtsub: {
    color: LightYellow,
    marginLeft: wp("16%"),
    fontSize: hp('2.2%'),
    fontWeight: '500',
  },
  main2: {
    flex: 1,
    backgroundColor: '#15181e',
    padding: 14,
    // height: hp('124%'),
  },
  txtman: {
    backgroundColor: '#332200',
    height: hp('15%'),
    width: wp('93%'),
    borderWidth: 3,
    borderColor: '#665200',
    borderRadius: 7,
  },
  txt5: {
    color: '#d9a640',
    padding: 10,
    fontWeight: '700',
    fontSize: hp('1.9%'),
  },
  txtdesc: {
    color: '#ae8637',
    paddingLeft: 10,
    fontWeight: '700',
    fontSize: hp('1.9%'),
  },
  tic: {
    backgroundColor: LightYellow,
    height: hp('2.5%'),
    width: wp('4.5%'),
    borderRadius: 3,
    marginTop: hp('3%'),
  },
  ticblack: {
    // backgroundColor: LightYellow,
    height: hp('2.5%'),
    width: wp('4.5%'),
    borderRadius: 3,
    borderWidth: 0.6,
    borderColor: '#7f8081',
    marginTop: hp('3%'),
  },
  iE: {
    color: White,
    fontWeight: '700',
    fontSize: hp('2.1%'),
    marginLeft: wp("4%"),
    marginTop: hp('3%'),
  },
  maintic: {
    flexDirection: 'row',
  },
  onof: {
    color: '#8C8C8C',
    fontWeight: '700',
    marginTop: hp('2.5%'),
  },
  mainontx: {
    backgroundColor: '#333333',
    height: hp('5%'),
    width: wp('93%'),
    borderRadius: 7,
    marginTop: hp('1%'),
  },
  txton: {
    color: White,
    height: hp('5%'),
    fontSize: hp('2.1%'),
    fontWeight: '700',
    marginLeft: wp("2%"),
  },
  imtic: {
    height: hp('2%'),
    width: wp('3%'),
    marginLeft: wp("1%"),
  },
  txman: {
    backgroundColor: '#939497',
    height: hp('40%'),
    width: wp('90%'),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
    // margin: 5,
  },
  img3: {
    // alignSelf: 'center',

    height: hp('40%'),
    width: wp('90%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgfl: {
    flexDirection: 'row',
  },
  txton7: {
    color: White,
    alignSelf: 'center',
    fontSize: hp('1.8%'),
    alignSelf: 'flex-start',
    marginLeft: wp("4%"),
    fontWeight: '600',
    marginTop: hp('10%'),
  },

  txtonimg3: {
    color: White,
    marginTop: hp('23%'),
    // alignSelf: 'center',
    fontSize: hp('2.12%'),
    fontWeight: '700',
  },
})
