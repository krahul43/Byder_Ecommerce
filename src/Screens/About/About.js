import { StyleSheet, Text, View, Image, Share,TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst';

const About = ({navigation,route}) => {
    const {email,username} = route.params;

    const handleShare = async () => {
        try {
          const result = await Share.share({
            message: 'Check out this awesome content!',
            url: 'https://example.com',
            title: 'Share Content'
          });
      
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Content shared
            } else {
              // Share dismissed
            }
          } else if (result.action === Share.dismissedAction) {
            // Share dismissed
          }
        } catch (error) {
          // Handle error
        }
      };
      
    return (
        <>
        <SafeAreaView style={styles.MainFlex}>
            <View style={styles.man}>
                <View style={styles.Topimg}>
                    <TouchableOpacity onPress={() =>  navigation.navigate('Scanner')} >
                        <Image style={styles.backim} source={require('../../Assets/scan.png')} tintColor={LightYellow} />
                    </TouchableOpacity>
                    {/* <Text style={styles.bac}>Back</Text> */}
                    <Text style={[styles.txtMain, { color: White }]}>Compartir</Text>
                    <TouchableOpacity onPress={() =>  navigation.goBack()} >
                    <Text style={styles.txtMain}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{padding:10}}>
                <Image source={require('../../Assets/Logo.png')} style={styles.ProfileImg} />
                <Text style={styles.txtName}>Byder </Text>

                <View style={{padding:5,paddingTop:hp('1.9%')}}>
                    <TouchableOpacity style={styles.ListView} >
                        <Text style={styles.txtList}>Author</Text>
                        <Text style={[styles.txtsupport,{color:'#737373'}]}>Byder-CTO</Text>
                    </TouchableOpacity>
                    <View style={styles.hrWidthsecond} />

                    <TouchableOpacity style={styles.ListView} onPress={() => handleShare()}>
                        <Text style={styles.txtList}>Share</Text>
                        <Text style={styles.txtsupport}>app.byder.app</Text>
                    </TouchableOpacity>
                    <View style={styles.hrWidthsecond} />

                    <TouchableOpacity style={styles.ListView} onPress={() =>{username == null ?
                    navigation.navigate('Login'): navigation.navigate('FeedBack',{email})} }>
                        <Text style={styles.txtList}>Support</Text>
                        <Text style={styles.txtsupport}>Send feedback</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.hrWidthsecond} /> */}

                </View>

            </View>
            </SafeAreaView>
        </>
    )
}

export default About

const styles = StyleSheet.create({
    man: {
        backgroundColor: MainBlack,
        height: hp('4.5%'),
        alignItems:"center"
    },
    Topimg: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: "space-evenly",
    },
    txtMain: {
        fontSize: hp('2.4%'),
        color: LightYellow,
        fontWeight: '700',
        marginLeft: wp("26%")
    },
    backim: {
        width: wp('5%'),
        height: hp('2.5%'),
        marginLeft: wp("2%")
    },
    bac: {
        color: LightYellow,
    },
    MainFlex: {
        flex: 1,
        backgroundColor: '#15181e',
        // padding: 10
    },
    ProfileImg: {
        height: hp('8.5%'),
        width: wp('17%'),
        borderRadius: 10,
        marginTop: hp('1.2%'),
        alignSelf: 'center'
    },
    txtName: {
        fontSize: hp('3.6%'),
        color: 'white',
        fontWeight: "900",
        alignSelf: 'center'
    },
    ListView: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        width: wp('92.5%'),
        marginTop: hp('1.9%'),
        borderRadius: 10,
    },

    txtList: {
        fontSize: hp('2.1%'),
        color: '#d2d2d4',
        fontWeight: "700",
    },
    txtsupport:{
        fontSize: hp('2.2%'),
        color: '#b6d38c',
        fontWeight: "500",
        marginRight:hp('1.2%')
    },
    hrWidthsecond: {
        height: hp('0.2%'),
        width: wp('91.5%'),
        backgroundColor: '#737373',
        marginTop: hp('0.9%')
    },
})