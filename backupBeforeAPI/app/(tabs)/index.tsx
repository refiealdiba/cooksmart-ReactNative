import { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BigCard from "../../components/BigCard";

import allRecipes from "@/constants/allRecipes.json";

export default function Index() {
    const [randomRecipes, setRandomRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(false);

    const tempData = JSON.parse(JSON.stringify(allRecipes));

    const handleSearch = () => {};

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>CookSmart</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.inputHeaderContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name="silverware-fork-knife"
                                size={40}
                                color="#fff"
                            />
                        </View>
                        <View>
                            <Text style={styles.inputHeaderTitle}>Let's Cook!</Text>
                            <Text style={styles.inputHeaderSubtitle}>
                                With more than 1000 recipes in our app from multiple countries
                                around the world
                            </Text>
                        </View>
                    </View>
                    <TextInput placeholder="Search" onChange={handleSearch} style={styles.input} />
                </View>
            </View>
            {/* Recipes List */}
            <Text
                style={{
                    marginHorizontal: 20,
                    marginTop: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                Recommendation
            </Text>
            <View style={styles.recipesContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    data={tempData}
                    numColumns={2}
                    key={2}
                    renderItem={({ item }) => <BigCard item={item} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    titleContainer: {
        paddingHorizontal: 20,
        width: "100%",
        height: 280,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "#2278ed",
    },
    titleText: {
        marginTop: 30,
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
    inputContainer: {
        // width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fefeff",
        borderRadius: 10,
    },
    inputHeaderContainer: {
        flexDirection: "row",
        gap: 10,
        width: 280,
        // paddingHorizontal: 10,
        marginBottom: 10,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        paddingLeft: 8,
        backgroundColor: "#2278ed",
        justifyContent: "center",
    },
    inputHeaderTitle: {
        fontSize: 17,
        fontWeight: "semibold",
    },
    inputHeaderSubtitle: {
        color: "#2278ed",
        fontSize: 12,
    },
    input: {
        width: "100%",
        backgroundColor: "#f4f2f5",
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    recipesContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 20,
        // flexDirection: "row",
        // gap: 20,
    },
});
