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

export default function SearchResultList({ searchResults }: Props) {
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
                    <Text>{item.title}</Text>
                </Pressable>
            )}
        />
    );
}

const styles = StyleSheet.create({
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
