import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {color} from '../asset/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const GoBack = ({title}: any) => {
  const nav = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.headerTexCon}
        onPress={() => nav.goBack()}>
        <Icon name="angle-left" size={23} color={color.pri} />
        <Text style={styles.headerTex}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default GoBack;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: color.pri4,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTexCon: {
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  headerTex: {
    fontSize: 15,
    fontWeight: '500',
    color: color.pri,
    marginLeft: 10,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: color.pri,
  },
});
