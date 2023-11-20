import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import React, { useEffect,useState,useContext } from 'react'
import Topbarback from '../../Components/Topbarback'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LightYellow, White, MainBlack } from '../../Components/ColorConst/ColorConst';
import { Baseurl } from '../../Components/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Components/AuthContext';
import base64 from 'react-native-base64';
import Loader from '../../Components/Loader';


const OrderGenerate = ({ navigation,route }) => {
  const { distace,reservData,reservDate,imageTicket,brandName, orderIdGet, name, images, sizesArray, selectedSize, currentDate, current_price, product_id } = route.params
  const { userToken, userName, password,emailSet } = useContext(AuthContext);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedGender, setIsFocusedGender] = useState(false);
  const [user, setUser] = useState(userName);
  const [email, setEmail] = useState(emailSet);
  const [phone, setPhone] = useState('');
  const [hombreBackgroundColor, setHombreBackgroundColor] = useState('#333333');
  const [mujerBackgroundColor, setMujerBackgroundColor] = useState('#333333');
  const [imageBackgroundColor, setImageBackgroundColor] = useState('#666666');
  const [genderStatus, setGenderStatus] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);


  const loginCred = base64.encode(userName + ':' + password);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toISOString().split('T')[0];

  const onFocusChange = () => {
    setIsFocused(true);
  };
  const onFocusChangeGender = () => {
    setIsFocusedGender(true);
  };

  const onHombrePress = () => {
    setHombreBackgroundColor('#666666');
    setMujerBackgroundColor('#333333');
    setImageBackgroundColor('#333333');
    setGenderStatus('emailGet');
  };

  const onMujerPress = () => {
    setHombreBackgroundColor('#333333');
    setMujerBackgroundColor('#666666');
    setImageBackgroundColor('#333333');
    setGenderStatus('phoneGet');
  };


  const OrderData = () => {
    setLoaderVisible(true)
    let formData = new FormData();
    formData.append('user', user)
    formData.append('sizes', selectedSize)
    formData.append('order_date', formattedDate)
    formData.append('frozen_price', current_price)
    formData.append('product', product_id)

      // console.log('preet');
    fetch('https://byder-backend-3l2yk.ondigitalocean.app/api/order/', {
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
        setLoaderVisible(false)
        console.log(response, "order  Response");
        // setOrderid(response.order_id);
        navigation.goBack('StoreSubmit')
        console.log(response,'orderid');
      }).catch((err) => {
        setLoaderVisible(false)
        console.log(err)
      })
    })

  }
  return (

    <SafeAreaView style={styles.container}>

{reservData.length > 0  ? 
     <View>
     
       <TouchableOpacity onPress={() => navigation.goBack()}  style={{flexDirection:'row',alignItems:"center",backgroundColor:"#000",height:hp('3.9%')}} >

       <Image style={styles.backim} source={require('../../Assets/left.png')} tintColor={LightYellow} />
         <Text style={[styles.txtMain, { marginLeft: 1,fontWeight: '400' }]}>Back</Text>
       </TouchableOpacity>
       <View style={styles.mntx} >
       <Text style={[styles.estx,{fontSize:hp('1.7%')}]}>Recoger antes del {reservDate}</Text>
       <Text style={[styles.sutx,{fontSize:hp('1.7%')}]}>Quedan 1 dias</Text>
     </View>
      </View>
     :
      (<>
      <View style={styles.man}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Text style={[styles.txtMain, { marginLeft: 10 }]}>Cancel</Text>
        </TouchableOpacity>
        {genderStatus !==null &&
        <TouchableOpacity 
        onPress={() =>OrderData() } >
          <Text style={[styles.txtMain, { marginRight: 10 }]}>Done</Text>
        </TouchableOpacity>
       }
      </View>
    
   

      <ScrollView style={styles.MainFlex}>
        <Text style={[styles.txtName, { marginTop: hp('0.2%') }]}>{name}</Text>
        <Text style={[styles.txtName, { color: "#808082" }]}>{brandName}</Text>

        <View style={styles.mntx} >
          <Text style={styles.estx}>Centro</Text>
          <Text style={styles.sutx}>{distace} km</Text>
        </View>
        <View style={styles.hrline2} />
        <View style={styles.txtman}>
          <Text style={styles.txt5}>Tendras 2 dias</Text>
          <Text style={[styles.txtdesc, { marginTop: hp('0.3%') }]}>a partir de hoy para recoger el pedido</Text>

        </View>
        <View style={styles.hrline2} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
          <Text style={styles.txtxview}>Numbre Completo</Text>
          <Text style={[styles.txtxview, { fontSize: hp('1.7%') }]}>Required</Text>
        </View>
        <TextInput
          style={[styles.inputFrom, isFocused ? { borderColor: '#DAFDA5', borderWidth: 1 } : null,
          ]}
          onFocus={onFocusChange}
          onChangeText={(e) => setUser(e)}
          value={user}
          // placeholder="byderteam@gmail.com"
          placeholderTextColor="#fff"
        />
        <View style={styles.mainnn}>

          <TouchableOpacity onPress={onHombrePress}>
            <View style={[styles.hom, { backgroundColor: hombreBackgroundColor }]}>
              <Text style={styles.homtx}>Correo electronic</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onMujerPress}>
            <View style={[styles.muj, { backgroundColor: mujerBackgroundColor }]}>
              <Text style={styles.mujtx}>Telefono</Text>
            </View>
          </TouchableOpacity>
        </View>
        {genderStatus == 'emailGet' &&
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
              <Text style={styles.txtxview}>Direccion de correo</Text>
            </View>
            <TextInput
              style={[styles.inputFrom, isFocusedGender ? { borderColor: '#DAFDA5', borderWidth: 1 } : null,
              ]}
              onFocus={onFocusChangeGender}
              onChangeText={(e) => setEmail(e)}
              value={email}
              // placeholder="byderteam@gmail.com"
              placeholderTextColor="#fff"
            />
          </View>
        }
        {genderStatus == 'phoneGet' &&
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
              <Text style={styles.txtxview}>Numero de telefono</Text>

            </View>
            <TextInput
              style={[styles.inputFrom, isFocusedGender ? { borderColor: '#DAFDA5', borderWidth: 1 } : null,
              ]}
              onFocus={onFocusChangeGender}
              onChangeText={(e) => setPhone(e)}
              value={phone}
              // placeholder="byderteam@gmail.com"
              placeholderTextColor="#fff"
            />
          </View>
        }
        <View style={styles.viewmsg}>
          <Text style={styles.txtmsg}>Te notificaremos a través del medio que elijas cuando tu prenda esté lista para ser recogida.</Text>
          <Text style={[styles.txtmsg, { fontSize: hp('2%'), marginTop: hp('1.5%') }]}>No enviaremos nunca contenido promocional.</Text>
        </View>
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />

      </ScrollView>
    </>)
         }
     
    </SafeAreaView>
  )
}

export default OrderGenerate

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15181e',
  },
  MainFlex: {
    flex: 1,
    padding: 15,
  },
  man: {
    backgroundColor: MainBlack,
    height: hp('5%'),
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
  },
  txtMain: {
    fontSize: hp('2.1%'),
    color: LightYellow,
    fontWeight: '500',
  },
  backim: {
    width: wp('6%'),
    height: hp('3%'),
    marginLeft: wp("0.1%")
  },
  txtName: {
    fontSize: hp('2.4%'),
    color: 'white',
    fontWeight: "700",
    fontFamily: 'Avenir',
  },
  mntx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.2%'),
  },
  estx: {
    color: '#e0e1e1',
    fontSize: hp('2.2%'),
    fontWeight: '600',
    marginLeft: hp('0.6%'),
  },
  sutx: {
    color: LightYellow,
    fontSize: hp('2.2%'),
    fontWeight: '600',
    marginRight: hp('0.6%'),
  },
  hrline2: {
    height: hp('0.03%'),
    width: wp('92%'),
    backgroundColor: '#292c32',
    marginVertical: hp('1.2%'),
},
  txtman: {
    backgroundColor: '#332200',
    height: hp('8.5%'),
    width: wp('92%'),
    borderWidth: 2,
    borderColor: '#665200',
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  txt5: {
    color: '#B38F00',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: hp('2%'),
    // marginTop: hp('1.5%'),
  },
  txtdesc: {
    color: '#ae8637',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: hp('1.9%'),
  },
  txtxview: {
    fontSize: hp('1.9%'),
    color: 'grey',
    fontWeight: '500',
  },
  inputFrom: {
    backgroundColor: '#272a30',
    borderRadius: 10,
    // height: hp('40%'),
    marginTop: hp('1.1%'),
    // borderWidth: 1,
    padding: 10,
    color: 'white',
  },
  mainnn: {
    flexDirection: 'row',
    marginTop: hp('2.7%'),
    marginBottom: hp('2.7%'),
    backgroundColor: '#333333',
    width: wp('91.6%'),
    borderRadius: 7,
  },
  ll: {
    backgroundColor: '#666666',
    height: hp('5%'),
    width: wp('12%'),
    borderRadius: 10,
  },
  mi: {
    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  hom: {
    backgroundColor: '#333333',
    height: hp('4.9%'),
    width: wp('45.2%'),
    borderRadius: 10,
  },
  homtx: {
    color: White,
    fontWeight: '600',
    marginTop: hp('1.1%'),
    alignSelf: 'center',
  },
  muj: {
    backgroundColor: '#333333',
    height: hp('4.9%'),
    width: wp('45.2%'),
    marginLeft: hp('0.5%'),
    borderRadius: 10,
  },
  mujtx: {
    color: White,
    fontWeight: '600',
    marginTop: hp('1.1%'),
    alignSelf: 'center',
  },
  viewmsg: {
    height: hp('12.6%'),
    width: wp('91.5%'),
    marginTop: hp('2.2%'),
    borderWidth: 1,
    borderColor: '#5f6560',
    borderRadius: 10,
    alignSelf:'center',
    backgroundColor: '#29302c',
    padding: 8
  },
  txtmsg: {
    fontSize: hp('2%'),
    color: 'white',
    fontWeight: "600",
  },
})