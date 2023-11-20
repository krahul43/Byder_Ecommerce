import { View, Text, Image, StyleSheet, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import AppIntroSlider from "react-native-app-intro-slider";
import {Translate} from '../../LoginFlow/SetLanguage/Translate/Translate'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const slides = [
  {
    id: 1,
    title: 'Present for good tasty food in your neighbourhood',
    image: require('../../Assets/first1.png')
  },
  {
    id: 2,
    title: 'Enjoy the best food and your favourite host',
    image: require('../../Assets/profile.png')
  },
  {
    id: 3,
    title: 'Get started and explore delicious food',
    image: require('../../Assets/second.png')
  }
]

const Onboarding = ({ navigation }) => {


  StatusBar.setBackgroundColor('black');
  StatusBar.setBarStyle('light-content', true);

  const buttonLabel = (label) => {
    return (
      <View style={{
        backgroundColor: "#DAFDA5",
        padding: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginBottom:hp('50%'),
      }}>
        <Text style={{
          color: "#000"
        }}>
          {label}
        </Text>
      </View>
    )
  }

  return (
    <AppIntroSlider
      data={slides}
      renderItem={({ item }) => {
        return (
          <View style={{
            flex: 1,
            // alignItems: 'center',
            // padding: 5,
            // paddingTop: 130,
            backgroundColor: '#fff'
          }}>
            <Image
              source={item.image}
              style={{
                width:wp('100%'),
                height:hp('100%'),
                // flex: 4
              }}
              // resizeMode="contain"
            />
            {/* <Text style={{
              color: "#187498",
              fontWeight: "600",
              fontSize: 30,
              textAlign: 'center',
              flex: 2
            }}>
              {item.title}
            </Text> */}

          </View>
        )
      }}
      activeDotStyle={{
        backgroundColor: '#DAFDA5',
        width: 24,
        marginBottom: 44,
      }}
      dotStyle={{
        marginBottom: 44,
        backgroundColor: '#808080',
      }}
      showSkipButton
      renderNextButton={() => buttonLabel("Next")}
      // renderSkipButton={() => buttonLabel("Skip")}
      renderDoneButton={() => buttonLabel("Next")}
      onSkip={() => navigation.navigate("DrawerNavigation")}
      onDone={() => navigation.navigate("DrawerNavigation")}

    />
  )
}

export default Onboarding