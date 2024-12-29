import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";

type Recipe = {
    id: string;
    image: string;
    title: string;
    calories: string;
    proteins: string;
};

type Day = {
    id: string;
    day: string;
};

const DetailPlan = () => {
    const db = useSQLiteContext();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [day, setDay] = useState<string>("");

    // Fungsi untuk mengambil nama hari berdasarkan id
    const getDayName = async () => {
        try {
            const response = await db.getFirstAsync<Day>("SELECT day FROM mealplan WHERE id = ?", [
                id.toString(),
            ]);
            if (response) {
                setDay(response.day);
            }
        } catch (error) {
            console.log("Error fetching day name:", error);
        }
    };

    // Fungsi untuk mengambil semua resep dari mealplanrecipes berdasarkan id day
    const getAllRecipeFromDb = async () => {
        try {
            const response = await db.getAllAsync("SELECT * FROM mealplanrecipes WHERE idday = ?", [
                id.toString(),
            ]);
            setRecipes(response as Recipe[]);
        } catch (error) {
            console.log("Error fetching recipes:", error);
        }
    };

    // Fungsi untuk menghapus resep dari mealplanrecipes DB
    const removeRecipeFromMealPlan = async (id: string) => {
        try {
            await db.runAsync("DELETE FROM mealplanrecipes WHERE id = ?", [id]);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getDayName();
        getAllRecipeFromDb();
    }, [recipes]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{day} Plan</Text>
            <FlatList
                style={{ paddingBottom: 20, paddingHorizontal: 20 }}
                data={recipes}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: "100%",
                            marginBottom: 20,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Pressable
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: "#fff",
                                boxShadow: "2px 14px 30px -9px rgba(0,0,0,0.48)",
                            }}
                            onPress={() => router.push(`/detail/${item.id}`)}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 15,
                                    maxWidth: "60%",
                                }}
                            >
                                <Image
                                    source={{
                                        uri: item.image,
                                    }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: "#fff",
                                        borderRadius: 50,
                                        objectFit: "contain",
                                        borderWidth: 1.5,
                                        borderColor: "#2278ed",
                                    }}
                                />
                                <View>
                                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                        {item.title}
                                    </Text>
                                    <Text>Calories: {item.calories}</Text>
                                    <Text>Proteins: {item.proteins}g</Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable
                            style={{
                                borderRadius: "50%",
                                backgroundColor: "#e8baba",
                                padding: 5,
                            }}
                            onPress={() => {
                                console.log("handle delete single ingredient from db");
                                removeRecipeFromMealPlan(item.id);
                            }}
                        >
                            <Ionicons name="close-outline" size={24} color="red" />
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    header: {
        color: "#2278ed",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    image: {
        width: 80,
        height: 80,
    },
    recipeCard: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
});

export default DetailPlan;
