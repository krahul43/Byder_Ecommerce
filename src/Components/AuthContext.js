
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

    const [userToken, setUserToken] = useState(null);
    const [userName, setuserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [emailSet, setEmailSet] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [asyncProductData, setAsyncProductData] = useState(null);
//   console.log(userName,'userName')

    
    const login = async (data) => {
        setUserToken(data);

        let accessToken = await AsyncStorage.setItem('userToken',data);
   
    }

    const passwordset = async (data) => {
        setPassword(data);
        let userPassword = await AsyncStorage.setItem('password',data);
        console.log("login presed");

    }
    const usernameset = async (data) => {
        setuserName(data);
        let userPassword = await AsyncStorage.setItem('userName',data);
        console.log("login presed");

    }

    const userEmailset = async (data) => {
        setEmailSet(data);
        let userPassword = await AsyncStorage.setItem('GetEmail',data);
        console.log("login presed");

    }

    const userProfilePic = async (data) => {
        setProfilePic(data);
        let userPassword = await AsyncStorage.setItem('ProfilePic',data);
        console.log("login presed");

    }

    const productDataList = async (data) => {
        setAsyncProductData(data);
        let ProductData = await AsyncStorage.setItem('AllProductData',data);
        console.log("login presed");

    }

    
    // const logout = () => {
    //     setUserToken(null);
        
    //     AsyncStorage.removeItem('userToken')
    //     AsyncStorage.removeItem('userName')
    //     AsyncStorage.removeItem('password')
       
    // }
    const logout = async () => {
        setUserToken(null);
        setuserName(null);
        setPassword(null);
        setEmailSet(null);
        setProfilePic(null);

        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('password');
            await AsyncStorage.removeItem('GetEmail');
            await AsyncStorage.removeItem('ProfilePic');
        } catch (e) {
            console.log(`Logout error: ${e}`);
        }
    }
    const isLoggedIn = async () => {
        try {
           
            let userToken = await AsyncStorage.getItem('userToken');
            let userid = await AsyncStorage.getItem('userName');
            let userPassword = await AsyncStorage.getItem('password');
            let userEmail = await AsyncStorage.getItem('GetEmail');
            let userProfilePic = await AsyncStorage.getItem('ProfilePic');
            let AllProductData = await AsyncStorage.getItem('AllProductData');
            setPassword(userPassword)
            setuserName(userid);
            setUserToken(userToken);
            setEmailSet(userEmail);
            setProfilePic(userProfilePic);
            setAsyncProductData(AllProductData);

        } catch (e) {
            console.log(`isLogged in error ${e}`)
        }
    }
    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{usernameset, emailSet,userEmailset,userProfilePic,passwordset,login, logout, productDataList,asyncProductData,userToken ,profilePic, password,userName }}>
            {children}
        </AuthContext.Provider>
    );
}