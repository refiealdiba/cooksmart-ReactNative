import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import BigCard from "@/components/BigCard";

type Props = {
    recommendations: [
        {
            id: number;
            title: string;
            image: string;
            readyInMinutes: number;
            cuisines: string[];
        }
    ];
};

export default function RecommendationList({ recommendations }: Props) {
    return (
        <View style={styles.container}>
            <FlatList
                data={recommendations}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <BigCard item={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
});
