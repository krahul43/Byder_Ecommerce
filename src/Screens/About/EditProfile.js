import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import React, { useState, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Topbarback from '../../Components/Topbarback'
import { LightYellow, White, MainBlack } from '../../Components/ColorConst/ColorConst';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Baseurl } from '../../Components/Baseurl';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';


const EditProfile = ({ navigation, route }) => {
    const { username, email,profilePic } = route.params
    const [frontimage, setFrontimage] = useState(profilePic);
    const [showoption, setShowoption] = useState(false);
    const [isFocusedGender, setIsFocusedGender] = useState(false);
    const [name, setName] = useState(username);
    const [loaderVisible, setLoaderVisible] = useState(false);
    // console.log(name,'nam')

    const { userToken, userName, password, emailSet,userProfilePic } = useContext(AuthContext);
    const loginCred = base64.encode(userName + ':' + password)

    const openGalleryFron = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(frontimage => {
            console.log(frontimage);
            setShowoption(false)
            setFrontimage(frontimage.path)
        });
    }
    const onFocusChangeGender = () => {
        setIsFocusedGender(true);
    };

    const ProfileUpdate = () => {
        setLoaderVisible(true)
        // userProfilePic(frontimage)  // comment when api response done

        let filename = frontimage.split('/').pop(); // image get in frontimage
        console.log("filename = " + filename);
        let match = /\.(\w+)$/.exec(filename);
        console.log("match = " + match);
        let type = match ? `image/${match[1]}` : `image`; //image type

        let formData = new FormData();
        formData.append('username ', name)
        formData.append('profile_pic', { uri: frontimage, name: filename, type })

        fetch(Baseurl + '/api/user/' + userName + '/', {
            method: 'Put',
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
                setLoaderVisible(false)
                // userProfilePic(frontimage)
                console.log(response, "Delte order  Response");

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
                    //   setDataprofile(urlWithoutSlash)
                      userProfilePic(urlWithoutSlash)
                      navigation.navigate('Profile')
                    })
                    .catch((error) => {
              
                      console.error(error)
                    })

            }).catch((err) => {
                setLoaderVisible(false)
                console.log(err)
            })
        })
    }

    // console.log(frontimage,'frontimage')


    return (
        <>
            <StatusBar backgroundColor={'#000'} />
            <SafeAreaView style={styles.MainFlex}>
                <View style={styles.man}>
                    <View style={styles.Topimg}>
                        <TouchableOpacity onPress={() => navigation.goBack()} >
                            {/* <Image style={styles.backim} source={require('../../Assets/left.png')} tintColor={LightYellow} /> */}

                            <Text style={styles.bac}>Cancel</Text>
                        </TouchableOpacity>
                        {/* <Text style={[styles.txtMain, { color: White }]}>Profile</Text> */}
                        {frontimage ?
                            <TouchableOpacity onPress={() => ProfileUpdate ()} >
                                <Text style={[styles.bac, { marginRight: wp("0.5%") }]}>Done</Text>
                            </TouchableOpacity>
                            : null}
                    </View>
                </View>


                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                        <Text style={styles.txtxview}>Numero completo</Text>

                    </View>
                    <TextInput
                        style={[styles.inputFrom, isFocusedGender ? { borderColor: '#DAFDA5', borderWidth: 1 } : null,
                        ]}
                        onFocus={onFocusChangeGender}
                        onChangeText={(e) => setName(e)}
                        value={name}
                        // placeholder="byderteam@gmail.com"
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 13, alignItems: 'center', justifyContent: "space-between" }}>
                    <Text style={styles.txtxview}>Foto de perfil</Text>

                </View>

                <View style={styles.searcmain}>
                    <View style={styles.srchmainim}>

                        <TouchableOpacity onPress={() => openGalleryFron()}>
                            {frontimage ?
                                <Image source={{ uri: frontimage }} style={styles.srchim} />
                                :
                                <Image style={styles.srchim} source={require('../../Assets/camera.png')}  />
                            }
                        </TouchableOpacity>
                        {frontimage ?
                        <TouchableOpacity onPress={() => openGalleryFron()}>
                        <Text style={styles.input} >Image Selected</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => openGalleryFron()}>
                        <Text style={styles.input} >Choose an image</Text>
                        </TouchableOpacity>
                       }

                        <TouchableOpacity onPress={() =>{ setFrontimage(null), userProfilePic(null)}}>
                            <Image style={styles.crossimg} source={require('../../Assets/cross.png')} tintColor='#959596' />
                        </TouchableOpacity>
                    </View>
                </View>
                <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
            </SafeAreaView>
        </>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    MainFlex: {
        flex: 1,
        backgroundColor: '#15181e',
        // padding: 10
    },
    man: {
        backgroundColor: MainBlack,
        height: hp('4.5%')
    },
    Topimg: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    txtMain: {
        fontSize: hp('2.4%'),
        color: LightYellow,
        fontWeight: '700',
        marginLeft: wp("35%")
    },
    backim: {
        width: wp('5%'),
        height: hp('2.5%'),
        marginLeft: wp("2%")
    },
    bac: {
        fontSize: hp('2.2%'),
        color: LightYellow,
        fontWeight: '400',
        marginLeft: wp('0.8%')
    },

    searcmain: {
        height: hp('6%'),
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#272a30',
        width: wp('93.5%'),
        marginTop: hp('0.6%'),
        marginLeft: hp('0.6%'),
        borderRadius: 10,
        alignSelf: "center"
    },
    srchmainim: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: hp('1.2%'),
        marginRight: hp('1.8%'),
        justifyContent: "space-between",
    },

    srchim: {
        height: hp('3.5%'),
        width: wp('7%'),
        // marginTop: hp('1.2%'),
        marginLeft: hp('1%'),
        alignSelf: 'center'
    },

    crossimg: {
        height: hp('2.6%'),
        width: wp('5.2%'),
        marginTop: hp('0.3%'),
        marginLeft: hp('1%'),
        alignSelf: 'center'
    },
    input: {
        color: '#959596',
        width: wp('50%'),
        marginLeft: hp('-4.5%'),
        alignSelf: 'center',
        fontWeight: '600'

    },

    txtxview: {
        fontSize: hp('1.9%'),
        color: 'grey',
        fontWeight: '500',
    },
    inputFrom: {
        backgroundColor: '#272a30',
        borderRadius: 10,
        paddingLeft:15,
        // height: hp('40%'),
        marginTop: hp('1.1%'),
        // borderWidth: 1,
        padding: 7.5,
        color: 'white',
    },

})