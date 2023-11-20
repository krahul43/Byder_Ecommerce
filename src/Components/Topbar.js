import { StyleSheet, Text, View, Image,Platform } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow, MainBlack, White } from './ColorConst/ColorConst';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SignOut from '../Screens/SignOut/SignOut';
const Topbar = ({ Textheading, navigation ,MARGINRight}) => {
  return (

    <View style={styles.Topimg}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('SignOut')}> */}
        <Image style={styles.navi} source={require('../Assets/navigation.png')} tintColor={LightYellow} />
      </TouchableOpacity>
      <View style={styles.centeredTextContainer}>
      <Text style={styles.txtMain}>{Textheading}</Text>
     </View>
    </View>

  )
}

export default Topbar

const styles = StyleSheet.create({

  Topimg: {
    flexDirection: 'row',
    alignItems: 'center', // Center vertically
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height:hp('5.8%'),
    backgroundColor: Platform.OS == 'ios' ? null : MainBlack,

  },
  txtMain: {
    fontSize: hp('2.4%'),
    color: White,
    fontWeight: '700',
    marginLeft: wp("-7.2%")

  },
  centeredTextContainer: {
    flex: 1, 
    alignItems: 'center', 
  },
  navi: {
    width: wp('8%'),
    height: hp('5%'),
    // marginLeft: hp('0.1%')
  },
})