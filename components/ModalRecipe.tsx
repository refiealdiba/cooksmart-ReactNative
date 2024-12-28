import { useEffect, useState } from "react";
import { Modal, Text, View, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

type Props = {
    isVisible: boolean;
    onClose: () => void;
    data: any; // Data untuk nutrisi
    type: string;
};

type Day = {
    id: string;
    day: string;
};

type Ingredient = {
    id: string;
    title: string;
    image: string;
    quantity: string;
    unit: string;
};

const ModalRecipes = ({ isVisible, onClose, data = "", type }: Props) => {
    const db = useSQLiteContext();
    // Eksekusi menambah ingredient ke cart
    const addIngredientToCart = async (
        id: string,
        title: string,
        image: string,
        quantity: string,
        unit: string
    ) => {
        try {
            const response = await db.runAsync(
                "INSERT INTO cart (id, title, image, quantity, unit) VALUES(?, ?, ?, ?, ?)",
                [id, title, image, quantity, unit]
            );
            console.log(`list ingredients: ${response}`);
        } catch (e) {
            console.log(e);
        }
    };
    // Mengambil data days
    const [days, setDays] = useState<Day[]>([]);
    const getAllDays = async () => {
        try {
            const response = await db.getAllAsync("SELECT id, day FROM mealplan");
            setDays(response as Day[]);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getAllDays();
    });

    // Ekseskusi menambah ke meal plan
    const addToMealPlanDb = async (
        id: string,
        idDay: string,
        title: string,
        image: string,
        calories: string,
        protein: string
    ) => {
        try {
            await db.runAsync(
                "INSERT INTO mealplanrecipes (id, idday, title, image, calories, proteins) VALUES(?,?,?,?,?,?)",
                [id, idDay, title, image, calories, protein]
            );
            console.log(`${id} Added to DB day ${idDay}`);
            onClose();
        } catch (e) {
            console.log(e);
        }
    };

    // Mengecek Cart
    const checkCart = async (
        id: string,
        title: string,
        image: string,
        quantity: string,
        unit: string
    ) => {
        try {
            const response = await db.getFirstAsync<Ingredient>("SELECT * FROM cart WHERE id = ?", [
                id,
            ]);
            if (response) {
                await db.runAsync("UPDATE cart SET quantity = ? WHERE id = ?", [
                    parseInt(response.quantity) + parseInt(quantity),
                    id,
                ]);
            } else {
                addIngredientToCart(id, title, image, quantity, unit);
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.cardContainer}>
                    {/* Header Modal */}
                    <View style={styles.cardHeader}>
                        {type === "nutrients" && (
                            <Text style={styles.cardHeaderTitle}>Nutrients</Text>
                        )}
                        {type === "ingredients" && (
                            <Text style={styles.cardHeaderTitle}>Ingredients</Text>
                        )}
                        {type === "plan" && <Text style={styles.cardHeaderTitle}>Plan</Text>}
                        <Pressable onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>

                    {/* List Nutrients */}
                    {type === "nutrients" && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={styles.scrollableList}
                            data={data.nutrition.nutrients}
                            keyExtractor={(item, index) => `${item.name}-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listContainer}>
                                    <Text style={styles.nutritionName}>{item.name}:</Text>
                                    <Text>
                                        {item.amount} {item.unit}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                    {type === "ingredients" && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={styles.scrollableList}
                            data={data.extendedIngredients}
                            keyExtractor={(item, index) => `${item.name}-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listContainer}>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: 10,
                                                width: "70%",
                                                alignItems: "center",
                                            }}
                                        >
                                            <View style={{ width: 60, height: 60 }}>
                                                <Image
                                                    source={{
                                                        uri: `https://img.spoonacular.com/ingredients_100x100/${item.image}`,
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: 50,
                                                    }}
                                                />
                                            </View>
                                            <View>
                                                <Text style={styles.nutritionName}>
                                                    {item.name}
                                                </Text>
                                                <Text>
                                                    {item.amount} {item.unit}
                                                </Text>
                                            </View>
                                        </View>
                                        <Pressable
                                            onPress={() => {
                                                checkCart(
                                                    item.id,
                                                    item.name,
                                                    item.image,
                                                    item.amount.toString(),
                                                    item.unit
                                                );
                                            }}
                                        >
                                            <MaterialCommunityIcons
                                                name="cart-plus"
                                                size={24}
                                                color="#2278ed"
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                    {type === "plan" && (
                        <FlatList
                            data={days}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listContainer}>
                                    <Pressable
                                        onPress={() => {
                                            console.log(`pressing ${item.day}`);
                                            addToMealPlanDb(
                                                data.id.toString(),
                                                item.id.toString(),
                                                data.title,
                                                data.image,
                                                data.nutrition.nutrients[0].amount.toString(),
                                                data.nutrition.nutrients[10].amount.toString()
                                            );
                                        }}
                                    >
                                        <Text>{item.day}</Text>
                                    </Pressable>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Latar belakang transparan gelap
    },
    cardContainer: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        maxHeight: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    cardHeaderTitle: {
        fontSize: 20,
        color: "#2278ed",
        fontWeight: "bold",
    },
    scrollableList: {
        flexGrow: 0,
    },
    listContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    nutritionName: {
        fontWeight: "bold",
    },
});

export default ModalRecipes;
