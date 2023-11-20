import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, Alert,SafeAreaView } from 'react-native'
import React, { useState,useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Topbarback from '../../Components/Topbarback'
import { LightYellow, White, MainBlack } from '../../Components/ColorConst/ColorConst';
import ImageCropPicker from 'react-native-image-crop-picker';
import base64 from 'react-native-base64';
import { AuthContext } from '../../Components/AuthContext';
import { Baseurl } from '../../Components/Baseurl';
import Loader from '../../Components/Loader';

const SidebarProfile = ({ navigation,route }) => {
    const {username,email} = route.params
    const { userToken,  password,userProfilePic,profilePic,logout } = useContext(AuthContext);
    const loginCred = base64.encode(username + ':' + password)
    const [frontimage, setFrontimage] = useState(profilePic);
    const [showoption, setShowoption] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);

    const openGalleryFron = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(frontimage => {
            console.log(frontimage);
            setShowoption(false)
            setFrontimage(frontimage.path)

            // userProfilePic(frontimage.path) //comment when api response done 
            setLoaderVisible(true)
            let filename = frontimage.path.split('/').pop();
            console.log("filename = " + filename);
            let match = /\.(\w+)$/.exec(filename);
            console.log("match = " + match);
            let type = match ? `image/${match[1]}` : `image`;
    
            let formData = new FormData();
            formData.append('profile_pic', { uri: frontimage.path, name: filename, type })
            // formData.append('username', userName)
            fetch(Baseurl + '/api/user/' + username + '/', {
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
                    fetch(Baseurl + '/api/user/' + username + '/', {
                        headers: {
                          "Accept": "application/json",
                          "Content-Type": "multipart/form-data",
                          "Authorization": `Basic ${loginCred}`,
                        },
                      }).then((response) => response.json())
                        .then((json) => {
                          const decodedURL = decodeURIComponent(json.profile_pic);
                          const urlWithoutSlash = decodedURL.slice(1);
                        //   setDataprofile(urlWithoutSlash)
                          userProfilePic(urlWithoutSlash)
                          navigation.navigate('Home')
                        })
                        .catch((error) => {                 
                          console.error(error)
                        })
    
                }).catch((err) => {
                    setLoaderVisible(false)
                    console.log(err)
                })
            })
        });
    }

    const Logoutuser = async () => {
        setLoaderVisible(true)
        let formData = new FormData();
        formData.append('username', username)
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
            setLoaderVisible(false)
    
            console.log(response, "logout");
            AsyncStorage.removeItem('userToken')
            AsyncStorage.removeItem('userName')
            AsyncStorage.removeItem('password')
            AsyncStorage.removeItem('GetEmail');
            AsyncStorage.removeItem('ProfilePic');
            setFrontimage(null)
            // AsyncStorage.setItem("userToken", csrf_token);
          }).catch((err) => {
            setLoaderVisible(false)
            console.log(err)
          })
        })
      }


    return (
        <>
            <StatusBar backgroundColor={'#000'} />
            <SafeAreaView style={styles.MainFlex}>
            <View style={styles.man}>
                <View style={styles.Topimg}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        {/* <Image style={styles.backim} source={require('../../Assets/left.png')} tintColor={LightYellow} /> */}

                        <Text style={styles.bac}>Close</Text>
                    </TouchableOpacity>
                    <Text style={[styles.txtMain, { color: White }]}>Profile</Text>
                    {frontimage ?
                    <TouchableOpacity onPress={() => Logoutuser() } >
                    <Text style={[styles.bac,{marginLeft: wp("26%")}]}>SignOut</Text>
                    </TouchableOpacity>
                    : null }
                </View>
            </View>
            <View style={{padding:10}}>
                <View style={styles.MainImgView}>
                    {frontimage ?
                        <Image source={{ uri: frontimage }} style={styles.ProfileImg} />
                        :
                        <Image source={require('../../Assets/prIcon.png')} style={styles.ProfileImg} tintColor={LightYellow}/>
                    }
                    <TouchableOpacity onPress={() => openGalleryFron()} style={styles.cameratOuch}>

                        <Image source={require('../../Assets/CameraPic.png')} style={styles.CameraImg} tintColor='#fff' />

                    </TouchableOpacity>
                    <View style={{ alignItems:"center", marginTop: hp('5.5%') }}>
                        <Text style={styles.txtName}>{username}</Text>
                        <Text style={[styles.txtName, { fontSize: hp('2%'),color:'grey' }]}>{email}</Text>
                    </View>

                </View>
            </View>
            <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
            </SafeAreaView>
        </>
    )
}

export default SidebarProfile

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
        justifyContent: "flex-start",
    },
    txtMain: {
        fontSize: hp('2.4%'),
        color: LightYellow,
        fontWeight: '700',
        marginLeft: wp("32%")
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
        marginLeft:wp('0.8%')
    },
    MainImgView: {
        // flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ProfileImg: {
        height: hp('18%'),
        width: wp('36%'),
        borderRadius: 999,
        marginVertical: hp('1.2%')
    },
    cameratOuch: {
        height: hp('5%'),
        width: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#dafda5",
        borderRadius:999,
        marginLeft:wp('25%'),
        marginTop: hp('-10.2%'),
        borderWidth:1,
        borderColor:'#000'
    },
    CameraImg: {
        height: hp('2.8%'),
        width: wp('5.6%'),
        // borderRadius:999,

    },
    txtName: {
        fontSize: hp('2.4%'),
        color: 'white',
        fontWeight: "700",
  
    },
})