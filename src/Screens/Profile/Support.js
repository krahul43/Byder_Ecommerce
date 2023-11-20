import { StyleSheet, Text, View, ScrollView, FlatList, StatusBar,Linking , TouchableOpacity, Image, SafeAreaView } from 'react-native';
import React from 'react';
import Topbarback from '../../Components/Topbarback';
import { sidebarBlack } from '../../Components/ColorConst/ColorConst';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TelePhoneNumber } from '../../Components/Baseurl';

const Support = ({ navigation }) => {

  let number =TelePhoneNumber;

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${number}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("WhatsApp is not installed.");
        }
      })
      .catch(error => console.log("Error:", error));
  };

  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.MainFlex}>
      <Topbarback Textheading={'Contacta con nosotros'} navigation={navigation} />
      <ScrollView style={{padding:15}}>


        <Text style={[styles.textOne, { marginTop: hp('-0.3%') }]}>¿Tienes alguna duda?</Text>
        <Text style={styles.texttwo}>Escribenos para dudas sobre:</Text>

        <Text style={[styles.textOne, { marginTop: hp('2.2%') }]}>Escribenos para dudas sobre:</Text>
        <Text style={styles.textOne}>Problemas</Text>
        <Text style={styles.textOne}>Pedidos</Text>
        <Text style={styles.textOne}>Resevas</Text>
        <Text style={styles.textOne}>Propuestas de mejaro</Text>


        <View style={styles.ContainerTwo}>
          <Text style={styles.TextThree}>¡Te necesitamos!</Text>
          <Text style={[styles.TextThree, { fontSize: hp('1.8%') }]}>
            No dudes en escribirnos,¡tys ideas nos importan!
          </Text>
        </View>

        <View style={styles.lineStyle1} />

        <View style={styles.MainButton}>
          <TouchableOpacity style={styles.Button} onPress={()=>navigation.navigate('SupportDescription')}>
            <Image style={styles.Logof}
              source={require('../../Assets/email.png')} />
            <Text style={styles.textButton}> Mensaje</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>openWhatsApp()} style={[styles.Button, { marginLeft: hp('1.1%'), backgroundColor: '#15181e', borderWidth: 0.4, borderColor: '#079150' }]}>
            <Image style={[styles.Logofwhat, { tintColor: '#079150' }]}
              source={require('../../Assets/whatsapp.png')} />
            <Text style={[styles.textButton, { color: '#079150' }]}> Whatsapp</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.Buttonsecond}  onPress={() => Linking.openURL(`tel:${number}`)}>
          <Image style={[styles.Logofwhat, { tintColor: '#aac584' }]}
            source={require('../../Assets/telephone.png')} />
          <Text style={[styles.textButton, { color: '#aac584' }]}> Llamanos</Text>
        </TouchableOpacity>

      </ScrollView>
      </SafeAreaView>
    </>)
};
export default Support;
const styles = StyleSheet.create({
  MainFlex: {
    flex: 1,
    backgroundColor: '#15181e',
    // padding: 15
  },

  textOne: {
    fontSize: hp('2.4%'),
    color: '#fff',
    fontWeight: '500',
  },
  texttwo: {
    color: 'grey',
    fontSize: hp('2.1%'),
  },

  ContainerTwo: {
    backgroundColor: '#16191f',
    marginTop: hp('2.8%'),
    height: hp('7.8%'),
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: '#5f6560',
    justifyContent: "center",
    alignItems: 'center',
  },
  TextThree: {
    fontSize: hp('2.2%'),
    color: '#fff',
    fontWeight: '500',
  },

  lineStyle1: {
    borderWidth: 0.2,
    borderColor: '#a1a4b2',
    width: wp('91.5%'),
    marginTop: hp('2.1%'),
    alignSelf:'center',
    marginLeft: hp('0.6%')
  },
  MainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2.8%'),
    justifyContent: "space-around",
  },
  Button: {
    flexDirection: 'row',
    height: hp('5.8%'),
    width: wp('44%'),
    borderRadius: 10,
    backgroundColor: '#2d332d',
    alignItems: 'center',
    justifyContent: "center",
  },

  textButton: {

    color: '#aac584',
    fontWeight: '500',
    fontSize: hp('2.2%'),
  },
  Logof: {
    height: hp('2.2%'),
    width: wp('4.4%'),
    // height: 25,
    tintColor: '#aac584',
    marginHorizontal: 10,
  },
  Logofwhat: {
    height: hp('2.2%'),
    width: wp('4.4%'),
    // height: 25,
    tintColor: '#aac584',
    marginHorizontal: 10,
  },
  Buttonsecond:{
    flexDirection: 'row',
    height: hp('5.8%'),
    width: wp('90.5%'),
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: '#aac584',
    alignItems: 'center',
    justifyContent: "center",
    alignSelf:"center",
    marginTop: hp('3.8%'),
  },
});