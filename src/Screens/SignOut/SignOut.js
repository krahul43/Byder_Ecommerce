import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { Baseurl } from '../../Components/Baseurl';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignOut = () => {

  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  //  console.log(email,'email');
  //  console.log(password,'password');
  const PostData = () => {
  
    if (!userName) {
      Toast.show({
        onPress: () => { Toast.hide() },
        type: ALERT_TYPE.WARNING,
        title: 'WARNING',
        textBody: 'Enter UserName',
      })
    
    } else if (!password) {
      Toast.show({
        onPress: () => { Toast.hide() },
        type: ALERT_TYPE.WARNING,
        title: 'WARNING',
        textBody: 'Enter Paswword',
      })
    
    }
    else {
      // setModalVisible(true)
      let formData = new FormData();
      formData.append('username', userName)
      formData.append('password', password)
  
  
      fetch(Baseurl + '/api/logout/', {
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
          // setModalVisible(false)
          console.log(response, "logout");
  
          AsyncStorage.setItem("userToken", csrf_token);
          // AsyncStorage.setItem("password", password);
          // AsyncStorage.setItem("userName", userName);
  
          // navigation.navigate('Home')
          
          // console.log(response.id, "Response");
          // navigation.navigate('PriceOverView', { abbb: response.id, listId })
        }).catch((err) => {
          // setModalVisible(false)
          console.log(err)
        })
      })
  
    }
  
  
  }



  return (
    <>
     <TouchableOpacity onPress={PostData}>
      <Text>SignOut</Text>
    </TouchableOpacity>

    </> 
     )
}

export default SignOut

const styles = StyleSheet.create({})