import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext,useState } from 'react'
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import { Baseurl } from '../../Components/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Components/AuthContext';
import Loader from '../../Components/Loader';
const Login = ({ navigation }) => {
 
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {login,passwordset,usernameset}=useContext(AuthContext)
  const [loaderVisible, setLoaderVisible] = useState(false);
 
  const PostData = () => {

    if (!userName) {
      Toast.show({
        onPress: () => { Toast.hide() },
        type: ALERT_TYPE.WARNING,
        title: 'WARNING',
        textBody: 'Enter username',
      })

    } else if (!password) {
      Toast.show({
        onPress: () => { Toast.hide() },
        type: ALERT_TYPE.WARNING,
        title: 'WARNING',
        textBody: 'Enter paswword',
      })

    }
    else {
      let formData = new FormData();
      formData.append('username', userName)
      formData.append('password', password)

      setLoaderVisible(true)
      fetch(Baseurl + '/api/login/',{
        method: 'Post',
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Referer":"https://byder-backend-3l2yk.ondigitalocean.app",
          // "X-CSRFTOKEN": userToken,
          // Include the CSRF token in the headers
          // "Accept": "application/json",
          // "Content-Type": "multipart/form-data",
          // "Authorization": "token " + userToken
        },
        body: formData
      })
      .then((result) => {
        result.json().then((response) => {
          setLoaderVisible(false)
          console.log(response, "login");
         
          if (response.message =='Login successful') {
            login(response.csrf_token);
            passwordset(password);
            usernameset(userName);
            // AsyncStorage.setItem("userToken", response.csrf_token);
            console.log("userName", userName)  
            navigation.navigate('Home')
            console.log(response, "if login");
            
          }else if(response.message =='Username or Password is incorrect'){
            Toast.show({
              onPress: () => { Toast.hide() },
              type: ALERT_TYPE.WARNING,
              title: 'WARNING',
              textBody: response.message
            })
      
          }
         
          // console.log(response.id, "Response");
        }).catch((err) => {
          setLoaderVisible(false)
          console.log(err)
        })
       
      })

   
    }


  }

  return (
    <>
      <Root>
        <View style={styles.main}>
          <ScrollView>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-end' }}>
              <Image style={styles.imgcl} source={require('../../Assets/close.png')} />
            </TouchableOpacity>
            <View style={styles.mainimg}>
              <Image style={styles.img} source={require('../../Assets/Logowithout.png')} />

            </View>
            <View style={styles.txtLogo}>
              <Text style={styles.txtby}>Byder</Text>
              <Text style={styles.txtEn}>Encuentra prendas cerca de ti. Introduce tu correo para create una cuenta</Text>
            </View>
            <View style={styles.inputmain}>
              <TextInput
                style={styles.input}
                onChangeText={setUserName}
                value={userName}
                placeholder="Username"
                placeholderTextColor={MainBlack}
              />
            </View>
            <View style={styles.inputmain}>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                placeholderTextColor={MainBlack}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity onPress={() => PostData()} style={styles.mainconti}>
              <Text style={styles.txtconti}>Continue</Text>
            </TouchableOpacity>

            {/* <View style={styles.mainsign}>
              <Image style={styles.imggo} source={require('../../Assets/googlelogo.png')} />
              <Text style={styles.txtsign}>Sign in with Google</Text>
            </View> */}
            <View style={{ alignitems: "center", justifyContent: "center", flexDirection: 'row' }}>

              <Text style={styles.smltxt}>Don't have an Account  </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.smltxt, { color: '#ff7674' }]}>Signup</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
          <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
        </View>
      </Root>
    </>
  )
}
export default Login
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#dafda5',
    padding: 20,
  },
  mainimg: {
    alignitems: 'center',
    justifyContent: 'center',
    marginTop: hp('-3%'),
  },
  img: {
    height: hp('18%'),
    width: wp('36%'),
    alignSelf: "center",
  },
  imgcl: {
    height: hp('5%'),
    width: wp('4%'),

  },
  txtLogo: {
    alignitems: 'center',
    justifyContent: 'center',
  },
  txtby: {
    color: MainBlack,
    fontSize: hp('8%'),
    fontWeight: '800',
    alignSelf: "center",
    marginTop: hp('7%'),
  },
  txtEn: {
    fontWeight:'500',
    color: '#404040',
    fontSize: hp('2.2%'),
    alignSelf: 'center',
  },
  inputmain: {
    marginTop: hp('2%'),
  },
  input: {
    backgroundColor: '#a4be7c',
    height: 45,
    borderWidth: 1.4,
    padding: 5,
    paddingLeft: 14,
    borderRadius: 8,
    borderColor: MainBlack,
  },
  mainconti: {
    backgroundColor: '#000',
    height: hp('6%'),
    width: wp('86%'),
    borderRadius: 8,
    marginTop: hp('6%'),
    alignSelf: 'center',
    alignitems: 'center',
    justifyContent: 'center',
  },
  txtconti: {
    color: '#fff',
    fontSize: hp('2.2%'),
    alignSelf: "center",
  },
  mainsign: {
    flexDirection: 'row',
    marginLeft: hp('0.5%'),
    backgroundColor: MainBlack,
    height: hp('6%'),
    width: wp('85%'),
    borderRadius: 8,
    marginTop: hp('2%'),
  },
  smltxt: {
    color: '#000',
    fontSize: hp('2%'),
    marginTop: hp('2%'),
    // alignSelf: "center",
  },
  txtsign: {
    color: White,
    fontSize: hp('2.2%'),
    alignSelf: "center",
    marginTop: hp('0.4%'),
    marginLeft: hp('2%'),
  },
  imggo: {
    height: hp('2.5%'),
    width: wp('5%'),
    marginTop: hp('1.8%'),
    marginLeft: hp('10%'),
  },
})