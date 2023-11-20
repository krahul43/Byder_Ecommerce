// CustomDrawer.js
import React, { useEffect, useState, useContext } from 'react';
import { View, ImageBackground, Image, StyleSheet, Text, Modal, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { sidebarBlack } from '../Components/ColorConst/ColorConst';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Components/AuthContext';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Baseurl } from '../Components/Baseurl';
import { useIsFocused } from '@react-navigation/native';

const CustomDrawer = (props) => {

  const navigation = useNavigation();
  // Use the useAuth hook

  const [loginStatus, setLoginStatus] = useState(false)
  const { userToken, userName, password, profilePic,logout,emailSet } = useContext(AuthContext);
  const isFocused = useIsFocused();
  console.log(userName, 'userName')
  console.log(userToken, 'userToken')

  const [dataprofile, setDataprofile] = useState([])

  console.log(dataprofile, 'dataprofile')
  const loginCred = base64.encode(userName + ':' + password)

  const Logoutuser = async () => {

    let formData = new FormData();
    formData.append('username', userName)
    formData.append('password', password)
    await logout();

    fetch(Baseurl + '/api/logout/', {
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
        navigation.navigate('Home');
        // setModalVisible(false)

        console.log(response, "logout");
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('userName')
        AsyncStorage.removeItem('password')
        AsyncStorage.removeItem('GetEmail');
        AsyncStorage.removeItem('ProfilePic');
   
      }).catch((err) => {
        // setModalVisible(false)
        console.log(err)
      })
    })
  }



  return (
    <>

      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: sidebarBlack, flex: 1 }}>
          <TouchableOpacity onPress={() => {userName ? navigation.navigate('SidebarProfile', { username: userName, email: emailSet }) : navigation.navigate('Login')  }}>
         {profilePic ?
          <Image source={{uri:profilePic }} style={styles.userImage}  />
          :
          <Image source={require('../Assets/prIcon.png')} style={styles.userImage} tintColor='#dafda5' />
         }
          </TouchableOpacity>

          {userToken && ( // Render only if user is logged in
            <TouchableOpacity style={styles.flexDir} onPress={() => navigation.navigate('SidebarProfile', { username: userName, email: emailSet })}>

              <Text style={styles.text} numberOfLines={2}>
                {userName}
              </Text>
              <Text style={styles.text2} numberOfLines={2}>{emailSet}</Text>
            </TouchableOpacity>
          )}
          {!userName && !password &&
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('0.8%'), marginLeft: wp('5.4%'), justifyContent: 'flex-start' }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: '600', marginLeft: hp('-0.6') }}>Sign In</Text>
            </TouchableOpacity>
          }

          <View style={styles.borderWidth} />
          {/* <DrawerItemList {...props} /> */}


          <TouchableOpacity onPress={() => navigation.navigate('About', { email:emailSet , username: userName })} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('0.7%'), marginLeft: wp('5.4%'), justifyContent: 'flex-start' }} >
            <Image source={require('../Assets/About-out.png')} style={[styles.logoutImage,{marginLeft:wp('-0.5%')}]} tintColor='#fff' />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: '600', marginLeft: wp('4%') }}>About</Text>
          </TouchableOpacity>
          {userName && password &&
          <TouchableOpacity onPress={() => Logoutuser()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('1.5%'), marginLeft: wp('5.4%'), justifyContent: 'flex-start' }}>
            <Image source={require('../Assets/logout.png')} style={styles.logoutImage} tintColor='#fff' />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: '600', marginLeft: wp('4%') }}>Sign Out</Text>
          </TouchableOpacity>
          }

        </DrawerContentScrollView>
      </View>
    </>
  );
};
export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexDir: {

    paddingLeft: 10,

    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  userImage: {
    height: hp('7%'),
    width: wp('14%'),
    borderRadius: 999,
    marginLeft: hp('1.8%'),
    marginTop: hp('1.2%'),
  },
  TabIcon: {
    height: hp('6.4%'),
    width: wp('12.8%'),
    marginLeft: 20,
  },
  text: {
    color: '#fff',
    marginLeft: wp('0.4%'),
    fontSize: hp('2.2%'),
    fontWeight: '700',
    marginTop: hp('2%'),
    marginLeft: wp('2.1%'),
  },
  text2: {
    color: '#808080',
    fontSize: hp('1.8%'),
    fontWeight: '500',
    marginTop: hp('0.2%'),
    marginLeft: wp('2.1%'),
  },
  borderWidth: {
    width: wp('75%'),
    alignSelf: 'center',
    marginTop: hp('1.8%'),
    marginBottom: hp('0.8%'),
    borderWidth: 0.4,
    borderColor: '#808080',
  },
  logoutImage: {
    height: hp('2.5%'),
    width: wp('5%')
  },

});


