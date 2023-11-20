import { StyleSheet, Text, View ,Image,TouchableOpacity,TextInput} from 'react-native'
import React,{useState} from 'react'
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from '../../Components/Baseurl';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import { ScrollView } from 'react-native-gesture-handler';

const OtpVerify = ({navigation,route}) => {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const {userName,token,password,email}=route.params

  // const {password,token}=route.params
    const [text, onChangeText] = React.useState('Useless Text');
    const [number, onChangeNumber] = React.useState('');


    // const [userName, setUserName] = React.useState('');
  
    const PutData = () => {
      if (!number) {
       Toast.show({
         onPress: () => { Toast.hide() },
         type: ALERT_TYPE.WARNING,
         title: 'WARNING',
         textBody: 'Enter otp',
       })
     }     
              
                    
     else {
      setLoaderVisible(true)
       let formData = new FormData();
       formData.append('otp', number)
  
 
       fetch(Baseurl + '/api/activate/'+ userName +'/', {
         method: 'Put',
         headers: {
           "Accept": "application/json",
           "Content-Type": "multipart/form-data",
           // "Authorization": "token " + userToken
         },
         body: formData
       }).then((result) => {
         result.json().then((response) => {
          setLoaderVisible(false)
          if(response.message =='Invalid OTP'){
            Toast.show({
              onPress: () => { Toast.hide() },
              type: ALERT_TYPE.WARNING,
              title: 'WARNING',
              textBody: 'Invalid otp',
            })
          }else if(response.message == 'User activated successfully'){
 
          //  AsyncStorage.setItem("userToken", token);
          //  AsyncStorage.setItem("password", password);
          //  AsyncStorage.setItem("userName", userName);
           console.log("userName", userName)
           setTimeout(() => {
            navigation.navigate('Login');
          }, 2000);
           console.log(response, "signup Response");
          }
           console.log(response, "User signup Response");
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
    <ScrollView style={styles.main}>
    <View style={styles.mainimg}>
<Image style={styles.img} source={require('../../Assets/Logowithout.png')}/>
<TouchableOpacity  onPress={() => navigation.goBack()}>
<Image style={styles.imgcl} source={require('../../Assets/close.png')}/>
</TouchableOpacity>
</View>
<Text style={styles.pintxt}>
    We've sent a pin to {email}
</Text>
<Text style={styles.pintxt2}>
  Check your spam folder if you don't receive it.
</Text>
<View style={styles.inputmain}>
<TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Enter pin"
        placeholderTextColor={MainBlack}
      />
</View>
<TouchableOpacity style={styles.mainconti} onPress={()=>PutData()}>
<Text style={styles.txtconti}>Continue</Text>
</TouchableOpacity>
<Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
</ScrollView>
</Root>
  </>
  )
}
export default OtpVerify
const styles = StyleSheet.create({
    main:{
        flex:1,
        backgroundColor:LightYellow,
    },
    mainimg:{
        flexDirection:'row',
    },
    img:{
        height:hp('13%'),
        width:wp('16%'),
       marginLeft:hp('21.5%'),
       marginTop:hp('6%'),
    },
    imgcl:{
        height:hp('5%'),
        width:wp('4%'),
       marginLeft:hp('16%'),
       marginTop:hp('3%'),
    },
    pintxt:{
        color:MainBlack,
        alignSelf:'center',
        fontSize:hp('2.1%'),
        marginTop:hp('16%'),
        fontWeight:'500'
    },
    pintxt2:{
        color:MainBlack,
        alignSelf:'center',
        fontSize:hp('2.1%'),
        marginTop:hp('0.3%'),
        fontWeight:'500'

    },
    inputmain:{
        padding:26,
    },
    input: {
      backgroundColor: '#a4be7c',
        height: 45,
        // margin: 12,
        borderWidth: 2,
        padding: 5,
        paddingLeft: 14,
        borderRadius:10,
        borderColor:MainBlack,
      },
      mainconti:{
        marginLeft:hp('3%'),
        backgroundColor: '#000',
        height:hp('6%'),
        width:wp('89%'),
        borderRadius:10,
        marginTop:hp('3%'),
      },
      txtconti:{
        color:White,
        fontSize:hp('2.2%'),
        alignSelf:"center",
        marginTop:hp('1.2%'),
        // fontWeight:'400',
       },
       anpintxt:{
        color:MainBlack,
        alignSelf:'center',
        fontSize:hp('2.4%'),
        marginTop:hp('2%'),
       },
}) 