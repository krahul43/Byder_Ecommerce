import { StyleSheet, Text, TextInput,ScrollView, View, StatusBar,TouchableOpacity,Image, SafeAreaView } from 'react-native'
import React from 'react';
import Topbar from '../../Components/Topbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow,White,MainBlack } from '../../Components/ColorConst/ColorConst';


const Scanner = ({ navigation }) => {
    const [number, onChangeNumber] = React.useState('');
    return (
        <>
            <StatusBar backgroundColor={'#000'} />
            <SafeAreaView style={styles.MainFlex}>
            <View style={styles.man}>
                <View style={styles.Topimg}>
                    <TouchableOpacity onPress={() =>  navigation.goBack()} >
                        <Image style={styles.backim} source={require('../../Assets/info.png')} tintColor={LightYellow} />
                    </TouchableOpacity>
                    {/* <Text style={styles.bac}>Back</Text> */}
                    <Text style={[styles.txtMain, { color: White }]}>Compartir</Text>
                    <TouchableOpacity onPress={() =>  navigation.navigate('Home')} >
                    <Text style={styles.txtMain}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Topbar Textheading={'Mi Perfil'} navigation={navigation} /> */}
            <ScrollView style={{padding:15}}>
                <View style={styles.ViewImg}>

                

            <Image style={styles.ProfileImg} source={require('../../Assets/scan.png')} tintColor='#fff' />
           <View style={{alignItems:'center',justifyContent:"center"}}>
            <Text style={styles.txtsupport}>Share this app by scanning the code with your phone's camera.</Text>          
            </View>
            </View>
            </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Scanner

const styles = StyleSheet.create({
    MainFlex: {
        flex: 1,
        backgroundColor: '#15181e',
        // padding: 15,
        
    },
    man: {
        backgroundColor: MainBlack,
        height: hp('4.5%')
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
    ViewImg:{
        alignItems: 'center',
        justifyContent: "center",  
    },
    ProfileImg: {
        height: hp('25%'),
        width: wp('50%'),
        borderRadius: 10,
        marginTop: hp('25%'),
        // alignSelf: 'center'
    },
    txtxview: {
        fontSize: hp('2.1%'),
        color: 'grey',
        fontWeight: '500',
    },
    txtsupport:{
        fontSize: hp('2.1%'),
        color: 'white',
        fontWeight: "400",
        // alignSelf:'center',
        marginTop:hp('25%')
        // marginRight:hp('1.2%')
    },
   

})