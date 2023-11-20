import { StyleSheet, Text, View, StatusBar, TextInput, Image, FlatList, SafeAreaView,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Topbarback from '../../Components/Topbarback'
import { ScrollView } from 'react-native-gesture-handler'
import { LightYellow, MainBlack, White } from '../../Components/ColorConst/ColorConst'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Baseurl } from '../../Components/Baseurl'
import Loader from '../../Components/Loader'

const BrandSeeAll = ({ navigation }) => {

  const [filteredData, setFilteredData] = useState([]);
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');
  const [dataBrand, setDataBrand] = useState([])
  const [loaderVisible, setLoaderVisible] = useState(false);
  console.log(dataBrand, 'dataBrand')

  const promotions = () => {
    setLoaderVisible(true)
    fetch(Baseurl + '/api/brand/', {
      headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Headers': '*',
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.json())
      .then((json) => {
        setLoaderVisible(false)
        setDataBrand(json)
        setFilteredData(json);
      })
      .catch((error) => {
        setLoaderVisible(false)
        console.error(error)
      })
  }
  useEffect(() => {
    promotions()
  }, [])

  const filterBrands = (searchText) => {
    if (searchText === '') {
      setFilteredData(dataBrand);
    } else {
      const filtered = dataBrand.filter((item) =>
        item.brand.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const Brand = ({ item, index }) => {
    return (
      <>
        <View style={styles.main}>
          <TouchableOpacity style={styles.mnboxf} onPress={() => navigation.navigate('BrandDetail', { GetName:item.brand,brandId: item.brand })}>
            <View>
              <Text style={styles.txt22}>
                {item.brand}
              </Text>
              {item.max_discount == null ? null :
                <Text style={styles.txt68}>
                  {item.max_discount}%
                </Text>
              }
            </View>
            <Image source={{ uri: item.image_link }} style={styles.mainbox} />
          </TouchableOpacity>
          <View style={styles.hrline} />
        </View>
      </>
    )
  }

  return (
    <>
      <StatusBar backgroundColor={'#000'} />
  
      <SafeAreaView style={styles.container}>
      <Topbarback navigation={navigation} />
      <View style={styles.searcmain}>
        <View style={styles.srchmainim}>
          <View style={styles.serchm}>
            <Image style={styles.srchim} source={require('../../Assets/searchwhite.png')} />
          </View>
          {/* <TextInput
              style={styles.input}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="Search"
              placeholderTextColor={'#737373'}
            /> */}
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              onChangeText(text);
              filterBrands(text);
            }}

            placeholder="Search"
            placeholderTextColor={'white'}
          />

        </View>
      </View>
      <View style={styles.backFlat}>
      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => <Brand item={item} index={index} />}
      />
        <Loader loaderVisible={loaderVisible} setLoaderVisible={setLoaderVisible} />
      </View>
      </SafeAreaView>
    </>
  )
}
export default BrandSeeAll
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15181E',
  },
  backFlat:{
    backgroundColor:'#15181E',
    height:'100%'
  },
  input: {
    backgroundColor: '#333333',
    height: 36,
    width: wp('86.5%'),
    color: White,
    marginLeft: hp('-2.4%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('0.6%'),
    border: 'none',
  },
  searcmain: {
    backgroundColor: MainBlack,
    height: hp('7%'),
  },
  main: {
    backgroundColor: '#15181E',
    flex: 1,
    flexGrow: 1,
    marginBottom: 0,
  },
  txt22: {
    color: White,
    fontSize: hp('2.3%'),
    fontWeight: '700',
  },
  txt68: {
    color: LightYellow,
  },
  mainbox: {
    // backgroundColor: White,
    height: hp('8%'),
    width: wp('18%'),
    borderRadius: 6,
  },
  boxtxt: {
    color: MainBlack,
    alignSelf: 'center',
    marginTop: hp('2.6%'),
  },
  mnboxf: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hrline: {
    height: hp('0.2%'),
    width: wp('92%'),
    backgroundColor: '#23262C',
    // marginTop: hp('1%'),
    alignSelf: 'center',
  },
  boxtxt4: {
    color: MainBlack,
    alignSelf: 'center',
    marginTop: hp('2.6%'),
    fontSize: hp('1.2%'),
    fontWeight: '700',
  },
  srchim: {
    height: hp('2.5%'),
    width: wp('5.2%'),
    marginTop: hp('1%'),
    marginLeft: hp('0.8%'),
  },
  srchmainim: {
    flexDirection: 'row',
  },
  serchm: {
    height: 36,
    backgroundColor: '#333333',
    width: wp('12%'),
    marginTop: hp('0.6%'),
    marginLeft: hp('1.5%'),
    borderRadius: 10,
  },
})














