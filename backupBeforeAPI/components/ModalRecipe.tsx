import { useState } from "react";
import { Modal, Text, View, FlatList, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import recipesInfo from "@/constants/recipesInfo.json";

// const data = JSON.parse(JSON.stringify(recipesInfo));

type Props = {
    isVisible: boolean;
    onClose: () => void;
    data: any; // Data untuk nutrisi
    type: string;
};

const ModalRecipes = ({ isVisible, onClose, data, type }: Props) => {
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
                        {type === "nutrients" ? (
                            <Text style={styles.cardHeaderTitle}>Nutrients</Text>
                        ) : (
                            <Text style={styles.cardHeaderTitle}>Ingredients</Text>
                        )}
                        <Pressable onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>

                    {/* List Nutrients */}
                    {type === "nutrients" ? (
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
                    ) : (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={styles.scrollableList}
                            data={data.extendedIngredients}
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
