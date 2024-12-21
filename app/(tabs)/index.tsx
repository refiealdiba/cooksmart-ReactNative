import { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import BigCard from "../../components/BigCard";
import allRecipes from "@/constants/allRecipes.json";
import { api } from "@/api/api";

export default function Index() {
    const router = useRouter();

    const [randomRecipes, setRandomRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([
        {
            id: 0,
            image: "",
            title: "",
        },
    ]);
    const [errMsg, setErrMsg] = useState("");

    const tempData = JSON.parse(JSON.stringify(allRecipes));

    const fetchRandomRecipes = async () => {
        try {
            const response = await api.get("/recipes/random?number=10", {
                params: {
                    number: 10,
                },
            });
            setRandomRecipes(response.data.recipes);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    const fetchQuickSearch = async (query: string) => {
        try {
            const response = await api.get(`/recipes/complexSearch`, {
                params: {
                    query,
                },
            });
            setSearchResult(response.data.results);
        } catch (error) {
            setErrMsg("Error fetching data");
        }
    };

    useEffect(() => {
        fetchRandomRecipes();
    }, []);

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
                    <TextInput
                        placeholder="Quick search"
                        onChangeText={(text) => {
                            setSearchQuery(text);

                            if (text.trim() === "") {
                                // Kosongkan hasil pencarian jika input kosong
                                setSearchResult([]);
                                return;
                            }

                            fetchQuickSearch(text); // Pastikan query dikirim dengan nilai terbaru
                        }}
                        style={styles.input}
                    />
                </View>
            </View>
            {searchQuery.length > 0 ? (
                <>
                    <Text
                        style={{
                            marginHorizontal: 20,
                            marginTop: 20,
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >
                        Result for "{searchQuery}"
                    </Text>
                    <View style={styles.searchResultContainer}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            data={searchResult}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => router.push(`/detail/${item.id}`)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 15,
                                        marginBottom: 20,
                                        backgroundColor: "#f4f2f5",
                                        borderRadius: 10,
                                        elevation: 5,
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderBottomLeftRadius: 10,
                                            borderTopLeftRadius: 10,
                                        }}
                                    />
                                    <Text>{item.title}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </>
            ) : (
                <>
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
                            data={randomRecipes}
                            numColumns={2}
                            key={2}
                            renderItem={({ item }) => <BigCard item={item} />}
                        />
                    </View>
                </>
            )}
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
    searchResultContainer: {
        flex: 1,
        paddingHorizontal: 30,
        marginTop: 20,
        flexDirection: "row",
        gap: 20,
    },
});
