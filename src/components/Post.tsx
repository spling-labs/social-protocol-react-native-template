import { MediaData } from '@spling/social-protocol/dist/types';
import React, { memo, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

interface PostProps {
    username: string;
    userAvatar: string | null;
    postDate: number;
    postText: string;
    postTag: string[];
    postMedia: MediaData[];
}

const PostComponent: React.FC<PostProps> = ({
    username,
    userAvatar,
    postDate,
    postText,
    postTag,
    postMedia
}) => {
    const [imageLoaded, setImageLoaded] = useState(true)

    const hideImage = () => {
        setImageLoaded(false)
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.userContainer}>
                <Image
                    source={
                        userAvatar === null
                            ? require("../assets/images/default_avatar.png")
                            : { uri: userAvatar }
                    }
                    style={styles.userAvatar}
                />
                <View style={styles.userVerticalContainer}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.postDate}>{dayjs.unix(postDate).fromNow()}</Text>
                </View>
            </View>
            <Text style={styles.postText}>{postText}</Text>
            {postMedia.length > 0 && (
                <Image
                    source={{ uri: postMedia[0].file }}
                    style={[
                        styles.postImage,
                        (!imageLoaded && styles.hide)
                    ]}
                    onError={hideImage}
                />
            )}
            {postTag.length > 0 && <View style={{ width: "100%", alignItems: 'flex-end' }}>
                <Text style={styles.postTag}>#{postTag[0]}</Text>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
        padding: 10,
        backgroundColor: '#32283b',
        borderRadius: 10
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userVerticalContainer: {
        flexDirection: 'column',
        marginLeft: 10
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2
    },
    username: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    postDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10
    },
    postText: {
        color: 'white',
        marginTop: 10,
        fontSize: 14
    },
    postImage: {
        width: "100%",
        height: 200,
        marginTop: 10,
        borderRadius: 15
    },
    postTag: {
        color: 'white',
        fontSize: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingStart: 10,
        paddingEnd: 10,
        fontWeight: 'bold',
        borderRadius: 10,
        backgroundColor: '#271b2d'
    },
    hide: {
        display: 'none'
    }
});

export default memo(PostComponent);
