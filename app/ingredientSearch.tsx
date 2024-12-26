import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, StyleSheet, TextInput, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { api } from "@/api/api";

import INGREDIENTS_DATA from "@/constants/listIngredients.json";

const IngredientSearch = () => {
    const [searchResults, setSearchResults] = useState([
        {
            id: 0,
            image: "",
            title: "",
        },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState([
        {
            id: "",
            name: "",
        },
    ]);
    const [activeInputIndex, setActiveInputIndex] = useState(0);

    const handleAddField = () => {
        setIngredientsList([...ingredientsList, ""]);
    };

    const handleRemoveField = (index: number) => {
        const updatedList = ingredientsList.filter((_, i) => i !== index);
        setIngredientsList(updatedList);
    };

    const handleInputChange = (text: string, index: number) => {
        const updatedList = [...ingredientsList];
        updatedList[index] = text;
        setIngredientsList(updatedList);
        filterSuggestions(text);
        setActiveInputIndex(index);
    };

    const filterSuggestions = (text: string) => {
        if (text.length > 0) {
            const filtered = INGREDIENTS_DATA.filter((item) =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (name: string) => {
        const updatedList = [...ingredientsList];
        updatedList[activeInputIndex] = name;
        setIngredientsList(updatedList);
        setSuggestions([]);
    };

    const fetchSearchIngredients = async () => {
        try {
            const response = await api.get("/recipes/findByIngredients", {
                params: {
                    ingredients: ingredientsList.join(","),
                },
            });
            setSearchResults(response.data);
        } catch {
            console.log("Failed to fetch data");
        }
    };

    const router = useRouter();

    useEffect(() => {
        setSearchResults([]);
        setSuggestions([]);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: "#2278ed",
                    paddingVertical: 20,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <MaterialCommunityIcons
                    name="shopping-search"
                    size={25}
                    color={"white"}
                    style={{ marginRight: 8 }}
                />
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "white",
                    }}
                >
                    Ingredients Search
                </Text>
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
                <Pressable
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: "#2278ed",
                        width: 90,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            textAlign: "center",
                        }}
                    >
                        Search
                    </Text>
                </Pressable>
            </View>
            <View
                style={{ paddingHorizontal: 20, paddingBottom: 130, paddingTop: 10, marginTop: 10 }}
            >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={searchResults}
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

            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View
                        style={{
                            width: "80%",
                            backgroundColor: "#fff",
                            padding: 20,
                            borderRadius: 10,
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text
                                style={{
                                    width: "50%",
                                    marginBottom: 20,
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: "#2278ed",
                                }}
                            >
                                Ingredients
                            </Text>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </Pressable>
                        </View>
                        {ingredientsList.map((item, index) => (
                            <View key={index} style={styles.inputContainer}>
                                <TextInput
                                    value={item}
                                    onChangeText={(text) => handleInputChange(text, index)}
                                    placeholder="Ingredient.."
                                    style={styles.input}
                                />
                                <Pressable
                                    onPress={() => handleRemoveField(index)}
                                    style={styles.removeButton}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold" }}>-</Text>
                                </Pressable>
                                <View
                                    style={{
                                        position: "absolute",
                                        maxHeight: 200,
                                        backgroundColor: "#fff",
                                        top: 40,
                                        zIndex: 1,
                                    }}
                                >
                                    <FlatList
                                        data={suggestions}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                onPress={() => handleSelectSuggestion(item.name)}
                                            >
                                                <Text style={styles.suggestionItem}>
                                                    {item.name}
                                                </Text>
                                            </Pressable>
                                        )}
                                        keyExtractor={(item) => item.id.toString()}
                                    />
                                </View>
                            </View>
                        ))}

                        <Pressable onPress={handleAddField} style={styles.addButton}>
                            <Text style={{ color: "white", fontWeight: "bold" }}>+</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                fetchSearchIngredients();
                            }}
                            style={styles.doneButton}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Search</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        position: "relative",
    },
    input: {
        flex: 1,
        backgroundColor: "#eaeaea",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: "#ff6b6b",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        backgroundColor: "#fbc531",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    doneButton: {
        backgroundColor: "#2278ed",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
});

export default IngredientSearch;
