import { StyleSheet, Image, Text, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

import { createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import CustomDrawer from './CustomDrawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BottomTabs from './Tabs';
import SignOut from '../Screens/SignOut/SignOut';



const Drawer = createDrawerNavigator();  // create drawer navigation
const Stack = createStackNavigator(); //create stack of screens




const DrawerNavigation = (props, item) => {

  


  return (
    <Drawer.Navigator
      drawerContent={drawerProps => <CustomDrawer {...drawerProps} {...props} />}
      scr
      screenOptions={{
        drawerStyle: { backgroundColor: 'transparent' },
        headerShown: false,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#fff',
        drawerActiveBackgroundColor:'#000',
        drawerLabelStyle: {
          fontSize: hp('1.9%'),

        }
      }}
    >
    
      <Drawer.Screen name="Home" component={BottomTabs}
     
        options={{
          drawerIcon: ({ color }) => (
            <Image style={styles.iconsPng} source={require('../Assets/homeSide.png')} tintColor='#fff' />
          ),
          // drawerLabel: () => null, // Hide the label
        }}
      />

      
   

    </Drawer.Navigator>

  )
}





export default DrawerNavigation

const styles = StyleSheet.create({
  iconsPng: {
    height: hp('2.5%'),
    width: wp('5%')
  }

})