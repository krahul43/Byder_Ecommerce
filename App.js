import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Tabs from './src/Navigation/Tabs'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigation from './src/Navigation/MainNavigation'
import { AuthContext, AuthProvider } from './src/Components/AuthContext'
const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
    <MainNavigation/>
    </NavigationContainer>
   </AuthProvider>
  )
}
export default App