import { StyleSheet, Text, ScrollView, View, StatusBar,TouchableOpacity,Image, Alert,Linking ,SafeAreaView } from 'react-native'
import React,{useState,useContext} from 'react';
import Topbar from '../../Components/Topbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
import Topbarback from '../../Components/Topbarback';
import Mailer from 'react-native-mail';
import { AuthContext } from '../../Components/AuthContext';

const SupportDescription = ({ navigation }) => {
    const [mail, setMail] = React.useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { userToken, userName,emailSet, } = useContext(AuthContext);
    const onFocusChange = () => {
        setIsFocused(true);
      };
    
      const onBlurChange = () => {
        setIsFocused(false);
      };

      const sendEmail = () => {

        if (!mail || mail.trim() === '') {
            // Display an alert or handle the validation error as needed
            Alert.alert('Please enter a message.','Email body can not be empty');
            return; // Return early to prevent sending the email
          }

        Mailer.mail(
          {
            subject:'Una pregunta sobre Byder -'+ userName, // Subject of the email
            recipients: ['byder.team@gmail.com'], // An array of email addresses
            ccRecipients: ['byder.team@gmail.com'], // An array of CC email addresses
            bccRecipients: ['byder.team@gmail.com'], // An array of BCC email addresses
            body: mail,
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
            <SafeAreaView  style={styles.MainFlex}>
            <Topbarback Textheading={'Mensaje des soporte'} navigation={navigation} />
            <ScrollView style={{padding:15}}>
                <View>
                    <Text style={styles.txtxview}>Escribenos tu Mensaje</Text>
                </View>
                <TextInput
                       style={[
                        styles.input,
                        isFocused ? { borderColor: '#DAFDA5', borderWidth: 1 } : null,
                      ]}
                    multiline={true}
                    textAlignVertical= 'top'
                    numberOfLines={45}
                    onChangeText={(e) => setMail(e)}
                    value={mail}
                    placeholder="Escribir mensaje ..."
                    placeholderTextColor={'#47494c'}
                    onFocus={onFocusChange}
                    onBlur={onBlurChange}
                    
                />


                <TouchableOpacity style={styles.Buttonsecond} onPress={()=>sendEmail()}>
                    <Image style={[styles.Logofwhat, { tintColor: '#aac584' }]}
                        source={require('../../Assets/send.png')} />
                    <Text style={[styles.textButton, { color: '#aac584' }]}> Envair Mensaje</Text>
                </TouchableOpacity>
            </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default SupportDescription

const styles = StyleSheet.create({
    MainFlex: {
        flex: 1,
        backgroundColor: '#15181e',
        // padding: 15
    },
    txtxview: {
        fontSize: hp('2.1%'),
        color: 'grey',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#272a30',
        borderRadius: 10,
        height: hp('40%'),
        marginTop: hp('1.1%'),
        borderWidth: 1,
        padding: 10,
        color:'#fff'
    },
    Logofwhat: {
        height: hp('2.2%'),
        width: wp('4.4%'),
        tintColor: '#aac584',
        marginHorizontal: 10,
      },
      Buttonsecond:{
        flexDirection: 'row',
        height: hp('5.8%'),
        width: wp('92%'),
        borderRadius: 10,
        backgroundColor: '#2d332d',
        alignItems: 'center',
        justifyContent: "center",
        marginTop: hp('3.8%'),
      },

})