import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
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

const RecommendationList = ({ recommendations }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Recommendation</Text>
            <FlatList
                data={recommendations}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <BigCard item={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    text: {
        fontWeight: "bold",
        fontSize: 20,
        marginHorizontal: 10,
        marginVertical: 7,
    },
});

export default RecommendationList;
