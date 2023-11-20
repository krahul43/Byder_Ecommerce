import { StyleSheet, Text, View, Image, TouchableOpacity,Platform } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { White } from './ColorConst/ColorConst';
import { MainBlack } from './ColorConst/ColorConst';
import { LightYellow } from './ColorConst/ColorConst';
const Topbarback = ({ Textheading, navigation }) => {
  return (
    <>

        <View style={styles.Topimg}>
          <TouchableOpacity style={styles.Topimg2} onPress={() => navigation.goBack()} >
            <Image style={styles.backim} source={require('../Assets/left.png')} tintColor={LightYellow} />
            <Text style={styles.bac}>Back</Text>  
          </TouchableOpacity>
          <View style={styles.centeredTextContainer}>
          <Text style={styles.txtMain} numberOfLines={1}>{Textheading}</Text>
          </View>
        </View>

    </>
  )
}
export default Topbarback
const styles = StyleSheet.create({
 
  Topimg: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: "flex-start",
    // backgroundColor: MainBlack,
    // padding:2,
    // height:hp('5.8%')

    flexDirection: 'row',
    alignItems: 'center', // Center vertically
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height:hp('5.8%'),
    backgroundColor: Platform.OS == 'ios' ? null : MainBlack,
  },
  Topimg2: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "flex-start",
   
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
  backim: {
    width: wp('6%'),
    height: hp('3%'),
    marginLeft: wp("0.8%")
  },
  bac: {
    fontSize: hp('2.01%'),
    color: LightYellow,
    fontWeight: '400',
    marginLeft: wp("-0.2%")
  },
})