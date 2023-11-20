import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Topbar from '../../Components/Topbar';
import { MainBlack, sidebarBlack, LightYellow, White } from '../../Components/ColorConst/ColorConst';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AuthContext } from '../../Components/AuthContext';
import { Baseurl } from '../../Components/Baseurl';
import base64 from 'react-native-base64';
import { useIsFocused } from '@react-navigation/native';




const Profile = ({ navigation, route }) => {
  // const {sizesArray } = route.params

  // console.log(sizesArray,"sizesArray")
  const isFocused = useIsFocused();
  const [loginStatus, setLoginStatus] = useState(false)

  const { userToken, userName, password, userProfilePic,emailSet, profilePic } = useContext(AuthContext);
  console.log(userName, '222userName')
  console.log(profilePic, 'profilePic')

  const [dataprofile, setDataprofile] = useState('')

  console.log(dataprofile, 'dataprofile')
  const loginCred = base64.encode(userName + ':' + password)

  // const decodedString = decodeURIComponent(dataprofile);

  console.log(dataprofile,'get profile');

  const Dataprofile = () => {

    fetch(Baseurl + '/api/user/' + userName + '/', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Authorization": `Basic ${loginCred}`,
      },
    }).then((response) => response.json())
      .then((json) => {
        // setDataprofile(json.profile_pic)
        const decodedURL = decodeURIComponent(json.profile_pic);
        const urlWithoutSlash = decodedURL.slice(1);
        setDataprofile(urlWithoutSlash)
        userProfilePic(urlWithoutSlash)
      })
      .catch((error) => {

        console.error(error)
      })
  }

  // useEffect(() => {
  //   if (isFocused) {

  //     Dataprofile();
  //   }
  // }, [isFocused])

  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.MainFlex}>
        <Topbar Textheading={'Mi Perfil'} navigation={navigation} />
        {/* <View style={styles.Topimg1}>
      <View style={styles.Topimg}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
    
          <Image style={styles.navi} source={require('../../Assets/navigation.png')} tintColor={LightYellow} />
        </TouchableOpacity>
        <Text style={styles.txtMain}>Mi Perfil</Text>
        
      </View>
      </View> */}

        <ScrollView style={{ padding: 5 }} >
          {userToken !== null ?

            <View>
              <View style={styles.MainImgView}>
                <TouchableOpacity onPress={() => { userName ? navigation.navigate('EditProfile', { username: userName, email: emailSet, profilePic }) : null }}>
                  {profilePic ?
                    <Image source={{ uri: profilePic }} style={styles.ProfileImg} />
                    :
                    <Image source={require('../../Assets/prIcon.png')} style={styles.ProfileImg} tintColor='#dafda5' />
                  }
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={styles.txtName}>{userName}</Text>
                  <Text style={[styles.txtName, { fontSize: hp('1.9%') }]}>{emailSet}</Text>
                </View>


              </View>
              <View style={styles.hrWidth} />
              <View style={styles.mainWallet}>
                <Text style={[styles.txtName, { marginTop: hp('1.2%') }]}>Byder Wallet</Text>
                <Text style={[styles.txtName, { marginTop: hp('0.1%'), fontSize: hp('2%'), color: '#737373' }]}>Reembolsis Acumulados</Text>
                <Text style={[styles.txtName, { marginTop: hp('0.4%'), fontSize: hp('3.8%'), color: LightYellow }]}>0.00 $</Text>
                <View>
                  <TouchableOpacity style={styles.addWallet}>
                    <Image source={require('../../Assets/dollar.png')} style={styles.dollarImg} />
                    <Text style={[styles.txtName, { marginLeft: hp('1.4%'), fontSize: hp('2.1%'), color: LightYellow }]}>Transfeir a tu cuenta bancaria</Text>
                  </TouchableOpacity>
                  <View style={styles.viewmsg}>
                    <Text style={styles.txtmsg}>Subo los Tickets da las compras</Text>
                    <Text style={[styles.txtmsg, { fontSize: hp('1.9%') }]}>Hechas a traves Subo los Tickets da las compras</Text>
                    <Text style={[styles.txtmsg, { fontSize: hp('1.9%') }]}>Subo los Tickets da las compras</Text>
                    <Text style={[styles.txtmsg, { fontSize: hp('1.9%') }]}>psuedo da las compras</Text>
                    <Text style={[styles.txtmsg, { fontSize: hp('2%'), marginTop: hp('1.5%') }]}>mis psuedo da las compras</Text>
                  </View>
                  <View style={styles.hrWidth} />
                </View>

                <TouchableOpacity style={styles.ListView} onPress={() => navigation.navigate('ReserveOrder')}>
                  <Text style={styles.txtList}>Mis Pedidos y Reservas</Text>
                  <View style={styles.circleView}>
                    <Image source={require('../../Assets/writing.png')} style={styles.ListImg} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ListView} onPress={() => navigation.navigate('EditPrefrence')}>
                  <Text style={styles.txtList}>Mis Preferencias</Text>
                  <View style={styles.circleView}>
                    <Image source={require('../../Assets/adjust.png')} style={styles.ListImg} />
                  </View>
                </TouchableOpacity>
                <View style={styles.hrWidthsecond} />

                <TouchableOpacity style={styles.ListView} onPress={() => navigation.navigate('Support')}>
                  <Text style={styles.txtList}>?Preguntas ?</Text>
                  <View style={styles.circleView}>
                    <Image source={require('../../Assets/telephone.png')} style={styles.ListImg} />
                  </View>
                </TouchableOpacity>

                <View style={{ marginBottom: 65 }} />

              </View>
            </View>

            :

            <View style={{ alignSelf: 'center', marginTop: hp('20%') }}>

              <View style={styles.viewmsgsession}>
                <Text style={styles.txtmsg}>Subo los Tickets da las compras</Text>
                <Text style={[styles.txtmsg, { fontSize: hp('1.9%') }]}>Hechas a traves Subo los Tickets da las compras</Text>
                <Text style={[styles.txtmsg, { fontSize: hp('1.9%') }]}>Subo los Tickets da las compras</Text>

              </View>
              <TouchableOpacity style={styles.addWalletSession} onPress={() => navigation.navigate('Login')}>
                <Image source={require('../../Assets/loading.png')} style={styles.dollarImg} tintColor={LightYellow} />
                <Text style={[styles.txtName, { marginLeft: hp('1.4%'), fontSize: hp('2.1%'), color: LightYellow }]}>iniciar Sesion</Text>
              </TouchableOpacity>

            </View>
          }


        </ScrollView>
      </SafeAreaView>
    </>
  )
}


export default Profile

const styles = StyleSheet.create({
  MainFlex: {
    flex: 1,
    backgroundColor: '#15181e',
    // padding: 10
  },
  MainImgView: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileImg: {
    height: hp('12%'),
    width: wp('24%'),
    borderRadius: 999,
    marginLeft: hp('0.6%'),
    marginVertical: hp('1.2%')
  },

  hrWidth: {
    height: hp('0.15%'),
    width: wp('91.5%'),
    backgroundColor: '#737373',
    marginTop: hp('2.2%'),
    // marginLeft:hp('2.2%'),
    alignSelf: 'center'
  },
  hrWidthsecond: {
    height: hp('0.15%'),
    width: wp('91.5%'),
    backgroundColor: '#737373',
    marginTop: hp('2.2%')
  },
  mainWallet: {
    // justifyContent: 'center',
    alignItems: "flex-start",
    paddingLeft: 8
  },
  txtName: {
    fontSize: hp('2.4%'),
    color: 'white',
    fontWeight: "700",
    fontFamily: 'Avenir',
    textShadowColor: 'black',
  },
  addWalletSession: {
    flexDirection: 'row',
    height: hp('5.6%'),
    width: wp('92.5%'),

    borderRadius: 10,
    backgroundColor: '#2d332d',
    marginTop: hp('2.2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addWallet: {
    flexDirection: 'row',
    height: hp('5.6%'),
    width: wp('91.5%'),
    borderWidth: 1,
    borderColor: LightYellow,
    borderRadius: 10,
    // backgroundColor: '#737373',  
    marginTop: hp('2.2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  dollarImg: {
    height: hp('3%'),
    width: wp('6%'),
  },
  viewmsgsession: {
    height: hp('12%'),
    width: wp('92.5%'),
    marginTop: hp('2.2%'),
    borderWidth: 1,
    borderColor: '#5f6560',
    borderRadius: 10,
    backgroundColor: '#29302c',
    padding: 8
  },
  viewmsg: {
    height: hp('18.6%'),
    width: wp('91.5%'),
    marginTop: hp('2.2%'),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: '#5f6560',
    borderRadius: 10,
    backgroundColor: '#29302c',
    padding: 8
  },
  txtmsg: {
    fontSize: hp('2%'),
    color: 'white',
    fontWeight: "600",
  },
  ListView: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    width: wp('92.5%'),
    marginVertical: hp('1.4%'),
    borderRadius: 10,

  },
  circleView: {
    height: hp('5%'),
    width: wp('10%'),
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#556562eb',
    marginRight: 5.5,
  },
  txtList: {
    fontSize: hp('2.1%'),
    color: 'white',
    fontWeight: "700",
  },
  ListImg: {
    height: hp('2.5%'),
    width: wp('5%'),
    tintColor: LightYellow
  },

  man: {
    backgroundColor: MainBlack,
  },
  Topimg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",

  },
  txtMain: {
    // alignItems:'center',
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '700',
    marginLeft: wp("30.5%")

  },
  navi: {
    width: wp('8%'),
    height: hp('5%'),
    marginLeft: hp('1%'),
  },
  Topimg1: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    backgroundColor: 'black',

  },

})