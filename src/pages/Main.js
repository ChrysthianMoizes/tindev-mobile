import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import api from '../services/api';
import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({ navigation }) {

  const id = navigation.getParam('user');
  const [devs, setDevs] = useState([]);

  useEffect(() => {

    async function loadDevs() {
      const response = await api.get('/devs', {
        headers: { user: id }
      });

      setDevs(response.data);
    }

    loadDevs();

  }, [id]);

  async function handleLike() {

    const [user, ...rest] = devs;

    await api.post(`/devs/${user._id}/like`, null, {
      headers: {
        user: id
      }
    });

    setDevs(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  async function handleDislike() {

    const [user, ...rest] = devs;

    await api.post(`/devs/${user._id}/deslike`, null, {
      headers: {
        user: id
      }
    });

    setDevs(rest);

  }

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardContainer}>

        {
          devs.length === 0
            ? <Text style={styles.empty}>Acabou :(</Text>
            : (
              devs.map((dev, index) => (
                <View key={dev._id} style={[styles.card, { zIndex: devs.length - index }]}>
                  <Image style={styles.avatar} source={{ uri: dev.avatar }} />
                  <View style={styles.footer}>
                    <Text style={styles.name}>{dev.name}</Text>
                    <Text numberOfLines={3} style={styles.bio}>{dev.bio}</Text>
                  </View>
                </View>
              ))
            )
        }
      </View>

      { devs.length > 0 && <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDislike}>
          <Image source={dislike} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Image source={like} />
        </TouchableOpacity>
      </View> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  logo: {
    marginTop: 30
  },

  cardContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  avatar: {
    flex: 1,
    height: 300
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    lineHeight: 18
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  }
});
