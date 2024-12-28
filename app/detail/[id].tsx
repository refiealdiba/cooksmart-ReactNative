import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Pressable, FlatList } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { api } from "../../api/api";

import ModalRecipes from "../../components/ModalRecipe";

const Detail = () => {
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const [liked, setLiked] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("");
    const [recipe, setRecipe] = useState({
        image: "",
        title: "",
        readyInMinutes: "",
        cuisines: [],
        extendedIngredients: [
            {
                image: "",
                name: "",
                amount: 0,
                unit: "",
            },
        ],
        nutrition: {
            nutrients: [
                {
                    name: "",
                    amount: 0,
                    unit: "",
                },
            ],
        },
        analyzedInstructions: [
            {
                steps: [
                    {
                        step: "",
                    },
                ],
            },
        ],
        diets: [],
    });
    const [errMsg, setErrMsg] = useState("");

    // handle Modal
    const handleOpenModal = (type: string) => {
        setModalType(type);
        setModalVisible(true);
    };

    const handleCloseModal = () => setModalVisible(false);

    // Mengambil data recipe dari API
    const fetchRecipeDetail = async () => {
        try {
            const response = await api.get(`/recipes/${id}/information?includeNutrition=true`);
            setRecipe(response.data);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    // Eksekusi menambah favorite ke liked database
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

    // Menghapus recipe dari favorite DB
    const removeFavoriteFromDb = async (id: string) => {
        try {
            await db.runAsync("DELETE FROM favoriterecipe WHERE id = ?", [id]);
            console.log("Removed from favorite");
            console.log("Removed ID:", id);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const checkFavorite = async (id: string) => {
        try {
            const result = await db.getFirstAsync("SELECT * FROM favoriterecipe WHERE id = ?", [
                id,
            ]);
            if (result) {
                setLiked(true); // Recipe sudah ada di favorite
            } else {
                setLiked(false); // Recipe belum ada di favorite
            }
            console.log("Check favorite:", result);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const toggleFavorite = async (id: string, title: string, image: string) => {
        if (liked) {
            // Jika sudah di-favorite, hapus dari database
            await removeFavoriteFromDb(id);
            setLiked(false);
        } else {
            // Jika belum di-favorite, tambahkan ke database
            await addFavoriteToDb(id, title, image);
            setLiked(true);
        }
    };

    // Eksekusi check data dan hapus data dari mealplan
    const [added, setAdded] = useState<boolean>(false);
    const removeMealPlanDb = async (id: string) => {
        try {
            await db.runAsync("DELETE FROM mealplanrecipes WHERE id = ?", [id]);
            setAdded(false);
        } catch (e) {
            console.log(e);
        }
    };

    const checkMealPlanDb = async (id: string) => {
        try {
            const response = await db.getFirstAsync("SELECT * FROM mealplanrecipes WHERE id = ?", [
                id,
            ]);

            if (response) {
                setAdded(true);
            } else {
                setAdded(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecipeDetail();
            checkFavorite(id.toString());
            checkMealPlanDb(id.toString());
            console.log("ID recipe ori:", id.toString());
        }, [isModalVisible])
    );

    return (
        <ScrollView style={styles.rootContainer}>
            <Image
                source={{
                    uri: recipe.image,
                }}
                style={styles.image}
            />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{recipe.title}</Text>
                    <Pressable
                        onPress={() => toggleFavorite(id.toString(), recipe.title, recipe.image)}
                    >
                        {liked ? (
                            <AntDesign name="heart" size={24} color="red" />
                        ) : (
                            <AntDesign name="hearto" size={24} color="red" />
                        )}
                    </Pressable>
                </View>
            </View>
            <View style={styles.cardTextContainer}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, width: 100 }}>
                    <AntDesign name="clockcircle" size={14} color={"#2278ed"} />
                    <Text>{recipe.readyInMinutes} min</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, width: 100 }}>
                    <Ionicons name="flag" size={16} color={"#2278ed"} />
                    <Text>{recipe.cuisines.length > 0 ? recipe.cuisines[0] : "Universal"}</Text>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 10,
                    marginBottom: 20,
                }}
            >
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    data={recipe.diets}
                    horizontal
                    renderItem={({ item }) => (
                        <Text
                            style={{
                                color: "#2278ed",
                                backgroundColor: "#ecf0ff",
                                paddingHorizontal: 12,
                                paddingVertical: 5,
                                borderRadius: 20,
                                margin: 5,
                            }}
                        >
                            {item}
                        </Text>
                    )}
                />
            </View>

            <View style={styles.contentContainer}>
                {/* Ingredients */}
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 18,
                    }}
                >
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {/* Tombol untuk membuka modal */}
                    <Pressable onPress={() => handleOpenModal("ingredients")}>
                        <Text
                            style={{
                                fontSize: 13,
                                color: "#2278ed",
                                fontWeight: "bold",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                            }}
                        >
                            Show All
                        </Text>
                    </Pressable>
                </View>
                <FlatList
                    numColumns={2}
                    key={2}
                    scrollEnabled={false}
                    data={recipe.extendedIngredients.slice(0, 4)} // Tampilkan 5 pertama
                    renderItem={({ item }) => (
                        <View
                            style={{ flexDirection: "row", gap: 8, width: 200, marginBottom: 10 }}
                        >
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: "white",
                                    borderWidth: 1.5,
                                    borderColor: "#2278ed",
                                    borderRadius: 50,
                                }}
                            >
                                <Image
                                    source={{
                                        uri: `https://img.spoonacular.com/ingredients_100x100/${item.image}`,
                                    }}
                                    style={{ width: "100%", height: "100%", borderRadius: 50 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontWeight: "bold" }}>
                                    {item.name.length > 15
                                        ? `${item.name.substring(0, 18)}...`
                                        : item.name}
                                </Text>
                                <Text>
                                    {item.amount} {item.unit}
                                </Text>
                            </View>
                        </View>
                    )}
                />

                {/* Nutrition */}
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                        marginTop: 20,
                    }}
                >
                    <Text style={styles.sectionTitle}>Nutrients</Text>
                    {/* Tombol untuk membuka modal */}
                    <Pressable onPress={() => handleOpenModal("nutrients")}>
                        <Text
                            style={{
                                fontSize: 13,
                                color: "#2278ed",
                                fontWeight: "bold",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                            }}
                        >
                            Show All
                        </Text>
                    </Pressable>
                </View>
                <FlatList
                    style={{ paddingHorizontal: 12 }}
                    numColumns={2}
                    key={3}
                    scrollEnabled={false}
                    data={recipe.nutrition.nutrients.slice(0, 4)} // Tampilkan 5 pertama
                    renderItem={({ item }) => (
                        <Text style={{ width: 200, marginBottom: 7 }}>
                            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>: {item.amount}{" "}
                            {item.unit}
                        </Text>
                    )}
                />

                {/* Instructions */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Steps</Text>
                <FlatList
                    scrollEnabled={false}
                    data={recipe.analyzedInstructions[0].steps}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                width: 350,
                                marginVertical: 10,
                                paddingHorizontal: 12,
                            }}
                        >
                            <Text>{index + 1}.</Text>
                            <Text style={{ textAlign: "justify", marginLeft: 10 }}>
                                {item.step}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Modal */}
            <ModalRecipes
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                data={recipe}
                type={modalType}
            />
            <Pressable
                style={{
                    position: "absolute",
                    right: 20,
                    top: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    alignItems: "center",
                    padding: 7,
                    borderRadius: 10,
                }}
                onPress={() => {
                    if (!added) {
                        // Jika belum ada di meal plan
                        handleOpenModal("plan"); // Modal untuk menambahkan
                    } else {
                        // Jika sudah ada, hapus dari meal plan
                        removeMealPlanDb(id.toString());
                    }
                }}
            >
                {added ? (
                    <MaterialCommunityIcons name="clipboard-remove" size={24} color="red" />
                ) : (
                    <MaterialCommunityIcons name="clipboard-plus" size={24} color="#2278ed" />
                )}
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        position: "relative",
        backgroundColor: "#fff",
    },
    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    image: {
        width: "100%",
        height: 400,
        objectFit: "cover",
        backgroundColor: "#2278ed",
    },
    titleContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 10,
        marginBottom: 10,
    },
    title: {
        width: 300,
        fontSize: 20,
        fontWeight: "bold",
    },
    contentContainer: {
        width: "100%",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingBottom: 20,
    },
    sectionTitle: {
        width: 120,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 17,
        fontWeight: "bold",
        backgroundColor: "#2278ed",
        color: "#fff",
        borderRadius: 10,
    },
    cardTextContainer: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "flex-start",
        marginBottom: 3,
        paddingHorizontal: 20,
    },
});

export default Detail;
