import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home/Home';
import Search from '../Screens/Search/Search';
import Waterdrop from '../Screens/Waterdrop/Waterdrop';
import Wishlist from '../Screens/Wishlist/Wishlist';
import Profile from '../Screens/Profile/Profile';
import { LightYellow, MainBlack, White, sidebarBlack } from '../Components/ColorConst/ColorConst';
import { createStackNavigator } from '@react-navigation/stack';
import DetailSearch from '../DetailSearch/DetailSearch';
import Support from '../Screens/Profile/Support';
import SupportDescription from '../Screens/Profile/SupportDescription';
import EditPrefrence from '../Screens/Profile/EditPrefrence';
import ReserveOrder from '../Screens/ReserveOrder/ReserveOrder';
import BrandDetail from '../Screens/BrandScreens/BrandDetail';
import BrandSeeAll from '../Screens/BrandScreens/BrandSeeAll';
import SeeInStore from '../Screens/SeeInStore/SeeInStore';
import StoreSubmit from '../Screens/StoreSubmit/StoreSubmit';
import CompareOnline from '../Screens/CompareOnline/CompareOnline';
import Submit from '../Screens/Submit/Submit';
import SubirTicket from '../Screens/SubirTicket/SubirTicket';
import About from '../Screens/About/About';
import SignOut from '../Screens/SignOut/SignOut';
import FeedBack from '../Screens/About/FeedBack';
import Scanner from '../Screens/About/Scanner';
import SidebarProfile from '../Screens/About/SidebarProfile';
import MapsScreen from '../Screens/MapsScreen/MapsScreen';

import Login from '../Screens/Login/Login';
import OtpVerify from '../Screens/Login/OtpVerify';
import SubmitCompareTicket from '../Screens/Submit/SubmitCompareTicket';
import MyTicketRevision from '../Screens/ReserveOrder/MyTicketRevision';
import MyOrderReseve from '../Screens/ReserveOrder/MyOrderReseve';

import Topbar from '../Components/Topbar';
import Topbarback from '../Components/Topbarback';
import DiscountScreen from '../Screens/DiscountScreen/DiscountScreen';
import Signup from '../Screens/Login/Signup';
import RelatedProducts from '../Screens/RelatedProduct/RelatedProducts';
import RopaSeeAll from '../Screens/Home/RopaSeeAll';
import CalazoSeeAll from '../Screens/Home/CalazoSeeAll';
import AccesoriesSeeAll from '../Screens/Home/AccesoriesSeeAll';
import Payment from '../Screens/Payment/Payment';
import Editorder from '../Screens/Editorder/Editorder';
import CompareInStore from '../Screens/Submit/CompareInStore';
import OrderGenerate from '../Screens/StoreSubmit/OrderGenerate';
import EditProfile from '../Screens/About/EditProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const CustomTabBarButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        top: -25,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          backgroundColor: LightYellow,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="DetailSearch" component={DetailSearch} options={{ headerShown: false }} />
      <Stack.Screen name="BrandDetail" component={BrandDetail} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Payment" component={Payment} options={({navigation})=>({  headerTitle: () => <Topbarback  navigation={navigation} />,headerStyle: {backgroundColor: '#000', height: 40, }, headerLeft: null,  })}></Stack.Screen>
      <Stack.Screen name="Editorder" component={Editorder} options={({navigation})=>({  headerTitle: () => <Topbarback  navigation={navigation} />,headerStyle: {backgroundColor: '#000', height: 40, }, headerLeft: null,  })}></Stack.Screen>
      <Stack.Screen name="RopaSeeAll" component={RopaSeeAll} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="AccesoriesSeeAll" component={AccesoriesSeeAll} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="CalazoSeeAll" component={CalazoSeeAll} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="OtpVerify" component={OtpVerify} options={{ headerShown: false }}></Stack.Screen>

      <Stack.Screen name="DiscountScreen" component={DiscountScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="BrandSeeAll" component={BrandSeeAll} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SeeInStore" component={SeeInStore} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="CompareInStore" component={CompareInStore} options={{ headerShown: false }}></Stack.Screen>
     
      <Stack.Screen name="CompareOnline" component={CompareOnline} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SubmitCompareTicket" component={SubmitCompareTicket} options={{ headerShown: false }} />
      <Stack.Screen name="Submit" component={Submit} options={{ headerShown: false }} />
      <Stack.Screen name="StoreSubmit" component={StoreSubmit} options={{ headerShown: false }} />
      <Stack.Screen name="SubirTicket" component={SubirTicket} options={{ headerShown: false }} />
     
      <Stack.Screen name="About" component={About} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SignOut" component={SignOut} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="FeedBack" component={FeedBack} options={{ headerShown: false }} ></Stack.Screen>
      <Stack.Screen name="Scanner" component={Scanner} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SidebarProfile" component={SidebarProfile} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="RelatedProducts" component={RelatedProducts} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="OrderGenerate" component={OrderGenerate} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="MapsScreen" component={MapsScreen} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  );
}
function MyProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="MyTicketRevision" component={MyTicketRevision} options={({navigation})=>({  headerTitle: () => <Topbarback navigation={navigation} />,headerStyle: {backgroundColor: '#000', height: 40, }, headerLeft: null,  })} />
      <Stack.Screen name="MyOrderReseve" component={MyOrderReseve} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="ReserveOrder" component={ReserveOrder} options={{ headerShown: false }}/>
      <Stack.Screen name="EditPrefrence" component={EditPrefrence} options={{ headerShown: false }}/>
      <Stack.Screen name="Support" component={Support} options={{ headerShown: false }}/>
      <Stack.Screen name="SupportDescription" component={SupportDescription} options={{ headerShown: false }}/>
      {/* <Stack.Screen name="Login" component={Login} options={({navigation})=>({  headerTitle: () => <Topbarback navigation={navigation} />,headerStyle: {backgroundColor: '#000', height: 40, }, headerLeft: null,  })} /> */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
      <Stack.Screen name="OtpVerify" component={OtpVerify} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="OrderGenerate" component={OrderGenerate} options={{ headerShown: false }}></Stack.Screen>

      <Stack.Screen name="SeeInStore" component={SeeInStore} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="CompareInStore" component={CompareInStore} options={{ headerShown: false }}></Stack.Screen>
     
      <Stack.Screen name="CompareOnline" component={CompareOnline} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SubmitCompareTicket" component={SubmitCompareTicket} options={{ headerShown: false }} />
      <Stack.Screen name="Submit" component={Submit} options={{ headerShown: false }} />
      <Stack.Screen name="StoreSubmit" component={StoreSubmit} options={{ headerShown: false }} />
      <Stack.Screen name="SubirTicket" component={SubirTicket} options={{ headerShown: false }} />
      <Stack.Screen name="SidebarProfile" component={SidebarProfile} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <Stack.Screen name="DetailSearch" component={DetailSearch} options={{ headerShown: false }} />
      <Stack.Screen name="SeeInStore" component={SeeInStore} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="CompareInStore" component={CompareInStore} options={{ headerShown: false }}></Stack.Screen>
     
      <Stack.Screen name="CompareOnline" component={CompareOnline} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SubmitCompareTicket" component={SubmitCompareTicket} options={{ headerShown: false }} />
      <Stack.Screen name="Submit" component={Submit} options={{ headerShown: false }} />
      <Stack.Screen name="StoreSubmit" component={StoreSubmit} options={{ headerShown: false }} />
      <Stack.Screen name="SubirTicket" component={SubirTicket} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function WishlistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Wishlist" component={Wishlist} options={{ headerShown: false }} />
      <Stack.Screen name="DetailSearch" component={DetailSearch} options={{ headerShown: false }} />
      <Stack.Screen name="SeeInStore" component={SeeInStore} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="CompareInStore" component={CompareInStore} options={{ headerShown: false }}></Stack.Screen>
     
      <Stack.Screen name="CompareOnline" component={CompareOnline} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SubmitCompareTicket" component={SubmitCompareTicket} options={{ headerShown: false }} />
      <Stack.Screen name="Submit" component={Submit} options={{ headerShown: false }} />
      <Stack.Screen name="StoreSubmit" component={StoreSubmit} options={{ headerShown: false }} />
      <Stack.Screen name="SubirTicket" component={SubirTicket} options={{ headerShown: false }} /> 

      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="OtpVerify" component={OtpVerify} options={{ headerShown: false }}></Stack.Screen>

         </Stack.Navigator>
  );
}
const BottomTabs = () => {
  return (
    <>
      <Tab.Navigator
      initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#040506',
            position: 'absolute',
            borderTopWidth: 0,
            // marginTop:10
          },
        })}>
        <Tab.Screen name='Home' component={MyStack} options={({navigation})=>({
          headerShown: false,

          tabBarIcon: ({ color,tintColor, focused }) =>
            <Image style={[styles.tinyLogo,{tintColor:focused ? '#DAFDA5' : '#494A4A'} ]} source={require('../Assets/home.png')}  />,
        }) }
        />
        <Tab.Screen name='Search' component={SearchStack} options={({navigation})=>({
                    headerTitle: () => <Topbar Textheading="Buscar" navigation={navigation} />,headerStyle: {backgroundColor: '#000', height: 40},headerLeft: null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            <Image style={[styles.tinyLogo,{tintColor:focused ? '#DAFDA5' : '#494A4A'} ]} source={require('../Assets/search.png')} />
        }) } />
        <Tab.Screen
          name='Waterdrop'
          component={Waterdrop}
          options={(navigation)=>({
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require('../Assets/drop.png')}
                tintColor={focused ? '#DAFDA5' : '#666666'}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  tintColor: 'black'
                }}
              />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} />
            )
          }) }
        />
        <Tab.Screen name='Wishlist' component={WishlistStack} options={({navigation})=>({
           headerTitle: () => <Topbar Textheading="Buscar" navigation={navigation} />,headerStyle: {backgroundColor: '#000', height: 40},headerLeft: null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            <Image style={[styles.tinyLogo,{tintColor:focused ? '#DAFDA5' : '#494A4A'} ]} source={require('../Assets/heart-rate.png')}  />
        }) } />
        <Tab.Screen name='Profile' component={MyProfileStack} options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            <Image style={[styles.tinyLogo,{tintColor:focused ? '#DAFDA5' : '#494A4A'} ]} source={require('../Assets/user.png')} />
        }} />
      </Tab.Navigator>
    </>
  )
}
export default BottomTabs
const styles = StyleSheet.create({
  tinyLogo: {
    height: 24,
    width: 24,
  },
})