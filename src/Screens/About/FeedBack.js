import { StyleSheet, Text, ScrollView, Modal, View, StatusBar, Dimensions,TouchableOpacity, Alert,Image, SafeAreaView } from 'react-native'
import React, { useState, useEffect,useContext } from 'react';
import Topbarback from '../../Components/Topbarback';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
import { LightYellow, White } from '../../Components/ColorConst/ColorConst';
import Mailer from 'react-native-mail';
import { AuthContext } from '../../Components/AuthContext';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const FeedBack = ({ navigation, route }) => {
  const { email } = route.params;
  console.log(email, 'email')
  const [isFocused, setIsFocused] = useState(false);
  const [number, onChangeNumber] = React.useState('');
  const [Changemessage, onChangemessage] = React.useState('');
  const [showSendButton, setShowSendButton] = useState(false);
  const { userToken, userName, } = useContext(AuthContext);


  // State for controlling the modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // State for the text to be displayed in the modal
  const [modalText, setModalText] = useState('');


  const onFocusChange = () => {
    setIsFocused(true);
  };

  const onBlurChange = () => {
    setIsFocused(false);
  };
  useEffect(() => {
    // Check if email is null and Changemessage has some content to show the Send button.
    if (!email !== null && Changemessage.trim() !== '') {
      setShowSendButton(true);
    } else {
      setShowSendButton(false);
    }
  }, [email, Changemessage]);

  const handleSend = () => {
    // Your logic to send the message (if needed)

    // Set the text for the modal
    setModalText(Changemessage);

    // Show the modal
    setModalVisible(true);

    // Clear the message input
    onChangemessage('');
    navigation.goBack();
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };


  const sendEmail = () => {

    if (!Changemessage || Changemessage.trim() === '') {
        // Display an alert or handle the validation error as needed
        Alert.alert('Please enter a message.','Email body can not be empty');
        return; // Return early to prevent sending the email
      }

    Mailer.mail(
      {
        subject:'Feedback sobre Byder -'+ userName, // Subject of the email
        recipients: ['byder.team@gmail.com'], // An array of email addresses
        ccRecipients: ['byder.team@gmail.com'], // An array of CC email addresses
        bccRecipients: ['byder.team@gmail.com'], // An array of BCC email addresses
        body: Changemessage,
        isHTML: false, // Set this true if you want to send an HTML email
      },
      (error, event) => {
        if (error) {
          console.error('Error sending email:', error);
        }
      }
    );
  };

  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <SafeAreaView style={styles.MainFlex} >
        <View style={styles.Topimg1}>
          <TouchableOpacity style={styles.Topimg} onPress={() => navigation.goBack()} >
            <Image style={styles.backim} source={require('../../Assets/left.png')} tintColor="#DAFDA5" />

            <Text style={styles.bac}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.txtMain}> Send feedback</Text>
          {/* <TouchableOpacity >
            <Text style={styles.sendtxt}>Send</Text>
            </TouchableOpacity> */}
          <TouchableOpacity
            disabled={!showSendButton}
            style={[styles.sendButton, !showSendButton ? { opacity: 0.5 } : null]}
            // onPress={handleSend}
            onPress={()=>sendEmail()}
          >
            <Text style={[styles.sendtxt, !showSendButton ? { color: '#DAFDA5' } : null]}>Send</Text>
          </TouchableOpacity>





        </View>
        <ScrollView style={{ padding: 15 }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
            <Text style={styles.txtxview}>From</Text>
            <Text style={styles.txtxview}>Required</Text>
          </View>
          <TextInput
            style={styles.inputFrom}
            multiline={true}
            // textAlignVertical= 'top'
            // numberOfLines={1}
            onChangeText={(e) => onChangeNumber(e)}
            value={email}
            // placeholder="byderteam@gmail.com"
            placeholderTextColor="#fff"


          />

          <View style={{ marginTop: hp('2%') }}>
            <Text style={styles.txtxview}>Message</Text>
          </View>
          <TextInput
            // style={styles.input}
            style={[
              styles.input,
              isFocused ? { borderColor: '#DAFDA5', borderWidth: 1 } : null,
            ]}
            multiline={true}
            textAlignVertical='top'
            numberOfLines={45}
            onChangeText={(e) => onChangemessage(e)}
            value={Changemessage}
            placeholder="message"
            placeholderTextColor={'#47494c'}
            onFocus={onFocusChange}
            onBlur={onBlurChange}
          />

        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >

        <View style={styles.containerModal}>
          <View style={styles.modalMain}>
            <Image source={require('../../Assets/wishlistick.png')} tintColor="#DAFDA5" style={{ height: 100, width: 100 }} />
            <Text style={styles.txtaddedFav}>Sent</Text>
          </View>
        </View>
       
      </Modal>
    </>
  )
}

export default FeedBack

const styles = StyleSheet.create({
  MainFlex: {
    flex: 1,
    backgroundColor: '#15181e',
  },
  txtxview: {
    fontSize: hp('2.1%'),
    color: 'grey',
    fontWeight: '500',
  },
  Topimg1: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    backgroundColor: 'black',
    height: hp('4.6')
  },
  sendtxt: {
    color: LightYellow,
    marginLeft: wp("17.5%"),
    fontSize: hp('2.1%'),
  },
  Topimg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    // marginLeft:hp('2.5%'),
  },
  checkmarkImage: {
    height: hp('3%'),
    width: wp('6%'),
    alignSelf: 'center'
  },
  backim: {
    width: wp('6%'),
    height: hp('3%'),
    // marginLeft:wp("-2.2%")
  },
  bac: {
    color: LightYellow,
    fontSize: hp('2%'),
  },
  txtMain: {
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '700',
    marginLeft: wp("22%")
  },
  inputFrom: {
    backgroundColor: '#272a30',
    borderRadius: 10,
    // height: hp('40%'),
    marginTop: hp('1.1%'),
    // borderWidth: 1,
    padding: 10,
    color: 'white',
  },
  input: {
    backgroundColor: '#272a30',
    borderRadius: 10,
    height: hp('40%'),
    marginTop: hp('1.1%'),
    // borderWidth: 1,
    padding: 10,
    color: 'white',
  },
  Logofwhat: {
    height: hp('2.2%'),
    width: wp('4.4%'),
    // height: 25,
    tintColor: '#aac584',
    marginHorizontal: 10,
  },
  Buttonsecond: {
    flexDirection: 'row',
    height: hp('5.8%'),
    width: wp('92%'),
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: '#aac584',
    alignItems: 'center',
    justifyContent: "center",
    marginTop: hp('3.8%'),
  },

  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalMain: {
    // backgroundColor: "#fff",
    marginTop: hp('-4%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: HEIGHT * 0.2,
    width: WIDTH * 0.58,
    // borderWidth: 0.25,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'

  },

  txtaddedFav: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "600"
  },

})