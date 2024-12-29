import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, TextInput, Modal } from "react-native";
import { FontAwesome6, Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "@/api/api";
import { useSQLiteContext } from "expo-sqlite";
import FullCard from "@/components/FullCard";
import SearchResultList from "@/components/SearchResultList";

type searchResults = {
    id: number;
    image: string;
    title: string;
};

const Explore = () => {
    const router = useRouter();
    const [randomRecipe, setRandomRecipe] = useState({
        id: 0,
        title: "",
        image: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState<string[]>([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [searchResult, setSearchResult] = useState<searchResults[]>([]);
    const [liked, setLiked] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const diets = [
        "gluten free",
        "ketogenic",
        "vegetarian",
        "lacto-vegetarian",
        "ovo-vegetarian",
        "vegan",
        "pescetarian",
        "paleo",
        "primal",
        "low fodmap",
        "whole30",
    ]; // Diet items
    const db = useSQLiteContext();

    // Random Recipe
    const fetchRandomRecipe = async () => {
        try {
            const response = await api.get("/recipes/random", {
                params: {
                    number: 1,
                },
            });
            setRandomRecipe(response.data.recipes[0]);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    // Search
    const fetchSearchComplex = async (query: string) => {
        try {
            const response = await api.get("/recipes/complexSearch", {
                params: {
                    query: query,
                    diet: filterQuery.join(","),
                },
            });
            setSearchResult(response.data.results);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    // Filter
    const handlerModalFilter = () => {
        setFilterModalVisible(!filterModalVisible);
    };
    const toggleFilter = (item: string) => {
        setFilterQuery(
            (prev) =>
                prev.includes(item)
                    ? prev.filter((i) => i !== item) // Remove if already selected
                    : [...prev, item] // Add if not selected
        );
    };

    // Eksekusi DB
    const addFavoriteToDb = async (id: string, title: string, image: string) => {
        try {
            await db.runAsync("INSERT INTO favoriterecipe (id, title, image) VALUES (?, ?, ?)", [
                id,
                title,
                image,
            ]);
            console.log("Added to favorite");
            console.log("Added ID:", id);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const removeFavoriteFromDb = async (id: string) => {
        try {
            await db.runAsync("DELETE FROM favoriterecipe WHERE id = ?", [id]);
            console.log("Removed from favorite");
            console.log("Removed ID:", id);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    // Button dan Check Favorite dari DB
    const checkFavorite = async (id: string) => {
        try {
            const result = await db.getFirstAsync("SELECT * FROM favoriterecipe WHERE id = ?", [
                id,
            ]);
            if (result) {
                setLiked(true);
            } else {
                setLiked(false);
            }
            console.log("Check favorite:", result);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const toggleFavorite = async (id: string, title: string, image: string) => {
        try {
            if (liked) {
                await removeFavoriteFromDb(id);
                setLiked(false);
            } else {
                await addFavoriteToDb(id, title, image);
                setLiked(true);
            }
            setTimeout(() => {
                fetchRandomRecipe();
                setLiked(false);
            }, 700);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchRandomRecipe();
        checkFavorite(randomRecipe.id.toString());
    }, []);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            fetchSearchComplex(searchQuery);
        } else {
            setSearchResult([]);
        }
    }, [searchQuery, filterQuery]);

    return (
        <View style={styles.rootContainer}>
            <View style={styles.headerContainer}>
                <TextInput
                    placeholder="Looking for something to cook?"
                    style={{ width: "80%" }}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                {/* Modal Filter Button */}
                <Pressable onPress={handlerModalFilter}>
                    {filterModalVisible ? (
                        <FontAwesome6 name="filter" size={20} color="#2278ed" />
                    ) : (
                        <AntDesign name="filter" size={24} color="#2278ed" />
                    )}
                </Pressable>
                {/* Modal Filter */}
                <Modal
                    visible={filterModalVisible}
                    transparent={true}
                    onRequestClose={handlerModalFilter}
                >
                    <View style={styles.containerModal}>
                        <Text style={styles.filterTitle}>Diet</Text>
                        <View style={{ width: "100%", marginTop: 20, paddingHorizontal: 5 }}>
                            {diets.map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => toggleFilter(item)}
                                    style={styles.buttonModal}
                                >
                                    <View style={styles.modalContainer}>
                                        {filterQuery.includes(item) && (
                                            <View style={styles.radioButton} />
                                        )}
                                    </View>
                                    <Text>{item}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <Pressable
                            onPress={handlerModalFilter}
                            style={{ backgroundColor: "#2278ed", padding: 7, borderRadius: 5 }}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>Done</Text>
                        </Pressable>
                    </View>
                </Modal>
            </View>
            <View style={styles.ingredientButtonContainer}>
                <Pressable
                    style={styles.ingredientButton}
                    onPress={() => router.push("/ingredientSearch")}
                >
                    <Text style={{ color: "white" }}>Ingredients Search</Text>
                </Pressable>
            </View>
            {/* Content */}
            <View style={{ flex: 1 }}>
                {searchResult.length > 0 ? (
                    <SearchResultList searchResults={searchResult as [searchResults]} />
                ) : (
                    <>
                        <Text style={styles.subtitle}>You May Like</Text>
                        <FullCard item={randomRecipe} />
                        <View style={styles.bottomButtonContainer}>
                            <Pressable
                                onPress={() => {
                                    fetchRandomRecipe();
                                    console.log("handle only looking for new recipe");
                                }}
                            >
                                <Ionicons name="close" size={40} color="gray" />
                            </Pressable>
                            <Pressable
                                onPress={async () => {
                                    await toggleFavorite(
                                        randomRecipe.id.toString(),
                                        randomRecipe.title,
                                        randomRecipe.image
                                    );
                                    console.log("handle add recipe to fav");
                                }}
                            >
                                {liked ? (
                                    <AntDesign name="heart" size={35} color="red" />
                                ) : (
                                    <AntDesign name="hearto" size={35} color="red" />
                                )}
                            </Pressable>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        position: "relative",
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: "#eef5ff",
    },
    container: {
        backgroundColor: "#2278ed",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    headerContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 20,
        justifyContent: "space-between",
        marginBottom: 5,
        position: "relative",
    },
    containerModal: {
        position: "absolute",
        width: 200,
        top: 70,
        right: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        // zIndex: 10,
    },
    buttonModal: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    modalContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#2278ed",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    filterTitle: {
        color: "#2278ed",
        fontWeight: "bold",
        borderBottomColor: "#e0e7f1",
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    radioButton: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#2278ed",
    },
    ingredientButtonContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginBottom: 30,
    },
    ingredientButton: {
        backgroundColor: "#2278ed",
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 20,
        marginTop: 10,
    },
    subtitle: {
        marginBottom: 15,
        marginTop: 10,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
    },
    bottomButtonContainer: {
        flexDirection: "row",
        marginTop: 20,
        padding: 1,
        justifyContent: "space-around",
    },
});

export default Explore;
