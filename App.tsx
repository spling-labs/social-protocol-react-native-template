/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { Keypair } from '@solana/web3.js';
import { Order_By, Post, ProtocolOptions, SocialProtocol } from '@spling/social-protocol';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PostComponent from './src/components/Post';

const App = () => {
  const backgroundStyle = {
    flex: 1,
    backgroundColor: "#271b2d",
  };

  // States
  const [socialProtocol, setSocialPorotcol] = useState<SocialProtocol>()
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1);
  const [endOfList, setEndOfList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadPosts = async () => {
    if (socialProtocol !== undefined) {
      try {
        setLoading(true)

        const newPosts: Post[] = await socialProtocol.getAllPosts(1, 20, (page - 1) * 20, Order_By.Desc)
        if (newPosts.length === 0) setEndOfList(true)
        setPosts([...posts, ...newPosts])
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }

  useEffect(() => {
    const initializeSocialProtocol = async () => {
      try {
        const protocolOptions = { useIndexer: true } as ProtocolOptions
        const socialProtocol: SocialProtocol = await new SocialProtocol(Keypair.generate(), null, protocolOptions).init()
        setSocialPorotcol(socialProtocol)
      } catch (error) {
        console.log(error);
      }
    }

    const runCode = async () => {
      setPosts([])
      setPage(1)
      setEndOfList(false)
      setLoading(true)

      await initializeSocialProtocol()
      await loadPosts()
    }
    runCode()
  }, [])

  const handleLoadMorePosts = () => {
    if (!loading && !endOfList) {
      setPage(page + 1);
      loadPosts();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true)
    setPosts([])
    setPage(1)
    setEndOfList(false)
    setLoading(true)

    await loadPosts()
  };


  const renderPost = ({ item }: { item: Post }) => (
    <PostComponent
      username={item.user.nickname}
      userAvatar={item.user.avatar}
      postDate={item.timestamp}
      postText={item.text}
      postTag={item.tags}
      postMedia={item.media}
    />
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={backgroundStyle}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
          <Text style={{ flex: 1, fontSize: 28, fontWeight: 'bold' }}>Feed</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => { Linking.openURL('https://wa.me/31653742901') }}
              style={{ height: 42, width: 42, backgroundColor: '#32283b', borderRadius: 36 / 2, justifyContent: 'center', alignItems: 'center', marginEnd: 10 }}
            >
              <Image
                source={require("./src/assets/images/whatsapp_icon.png")}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { Linking.openURL('https://twitter.com/Spling_Labs') }}
              style={{ height: 42, width: 42, backgroundColor: '#32283b', borderRadius: 36 / 2, justifyContent: 'center', alignItems: 'center', marginEnd: 10 }}
            >
              <Image
                source={require("./src/assets/images/twitter_icon.png")}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { Linking.openURL('https://discord.gg/7e3QN3Hy64') }}
              style={{ height: 42, width: 42, backgroundColor: '#32283b', borderRadius: 36 / 2, justifyContent: 'center', alignItems: 'center' }}
            >
              <Image
                source={require("./src/assets/images/discord_icon.png")}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item, index) => index + item.postId.toString()}
          onEndReached={handleLoadMorePosts}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListFooterComponent={
            <View style={{ flexDirection: 'column', margin: 10, alignItems: 'center' }}>
              {loading && !refreshing &&
                <>
                  <ActivityIndicator size="large" color="#32283b" />
                  <Text>Loading...</Text>
                </>
              }
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default App;
