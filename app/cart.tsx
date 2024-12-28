import { useState, useEffect } from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Ingredient = {
    id: string;
    title: string;
    image: string;
    quantity: string;
    unit: string;
};

const Cart = () => {
    // Ekseskusi untuk mendapatkan semua ingredients di DB
    const router = useRouter();
    const db = useSQLiteContext();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const getAllIngredientsFromDb = async () => {
        try {
            const response = await db.getAllAsync("SELECT * FROM cart");
            setIngredients(response as Ingredient[]);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    const removeSingleIngredient = async (id: string) => {
        try {
            await db.runAsync("DELETE FROM cart WHERE id = $id", { $id: id });
        } catch (e) {
            console.log(e);
        }
    };

    const removeAllIngredients = async () => {
        try {
            await db.runAsync("DELETE FROM cart");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getAllIngredientsFromDb();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <MaterialCommunityIcons
                    name="cart"
                    size={40}
                    color="#2278ed"
                    style={{ width: 40 }}
                />
                <Text style={{ width: 50, fontSize: 20, fontWeight: "bold", color: "#2278ed" }}>
                    Cart
                </Text>
            </View>
            <View style={styles.subtitle}>
                <Text>Want to add some ingredient?</Text>
                <Pressable style={styles.subtitleButton} onPress={() => router.push("/explore")}>
                    <Text style={{ color: "#fff" }}>Explore</Text>
                </Pressable>
            </View>
            {ingredients.length > 0 ? (
                <>
                    <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                        <Pressable
                            style={styles.btnClear}
                            onPress={() => {
                                console.log("handle delete all ingredient from db");
                                removeAllIngredients();
                                getAllIngredientsFromDb();
                            }}
                        >
                            <Text style={{ textAlign: "center", color: "white" }}>Clear All</Text>
                        </Pressable>
                    </View>
                    <FlatList
                        style={{ paddingBottom: 20, paddingHorizontal: 20 }}
                        data={ingredients}
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
                                <View
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
                                                uri: `https://img.spoonacular.com/ingredients_100x100/${item.image}`,
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
                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                            {item.title}
                                        </Text>
                                    </View>
                                    <Text>
                                        {item.quantity} {item.unit}
                                    </Text>
                                </View>
                                <Pressable
                                    style={{
                                        borderRadius: "50%",
                                        backgroundColor: "#e8baba",
                                        padding: 5,
                                    }}
                                    onPress={() => {
                                        console.log("handle delete single ingredient from db");
                                        removeSingleIngredient(item.id.toString());
                                        getAllIngredientsFromDb();
                                    }}
                                >
                                    <Ionicons name="close-outline" size={24} color="red" />
                                </Pressable>
                            </View>
                        )}
                    />
                </>
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "gray",
                        }}
                    >
                        Found nothing in your cart
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 10,
    },
    subtitle: {
        width: "100%",
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    subtitleButton: {
        backgroundColor: "#2278ed",
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 5,
    },
    btnClear: {
        backgroundColor: "red",
        paddingHorizontal: 10,
        paddingVertical: 4,
        width: 80,
        borderRadius: 5,
    },
});

export default Cart;
