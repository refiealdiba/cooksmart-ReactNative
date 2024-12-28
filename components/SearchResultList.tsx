import React from "react";
import { FlatList, Pressable, Image, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Props = {
    searchResults: [
        {
            id: number;
            image: string;
            title: string;
        }
    ];
};

const SearchResultList = ({ searchResults }: Props) => {
    const router = useRouter();

    return (
        <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() => router.push(`/detail/${item.id}`)}
                    style={styles.resultItem}
                >
                    <Image source={{ uri: item.image }} style={styles.resultImage} />
                    <Text>
                        {item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title}
                    </Text>
                </Pressable>
            )}
            style={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    resultItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
    },
    resultImage: {
        width: 80,
        height: 80,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
});

export default SearchResultList;
