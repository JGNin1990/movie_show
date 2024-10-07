import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {color} from '../asset/styles';

const Loading = ({visible}: any) => {
  return (
    <Modal visible={visible} style={{height: hp('100%')}}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={color.pri} />
        <Text style={styles.loadingText}>Loading, Please wait . . .</Text>
      </View>
    </Modal>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
  },
  loadingText: {
    color: color.pri,
    fontSize: 12,
  },
});
