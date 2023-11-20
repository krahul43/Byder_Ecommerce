import React, { useState } from "react";
import { ActivityIndicator,Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";

const Loader = ({loaderVisible,setLoaderVisible}) => {
//   const [modalVisible, setModalVisible] = useState(true);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={loaderVisible}
        onRequestClose={() => {
            setLoaderVisible(!loaderVisible);
        }}
      >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <ActivityIndicator size="large" color="#DAFDA5" />
        </View>
        </View>
      </Modal>
    
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor:'rgba(0.0.0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    
  },

});

export default Loader;