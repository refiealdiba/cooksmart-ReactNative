import { useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Pressable, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import receipesInfo from "@/constants/recipesInfo.json";

import ModalRecipes from "@/components/ModalRecipe";

const gambar = require("@/assets/images/react-logo.png");
const data = JSON.parse(JSON.stringify(receipesInfo));

const Detail = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("");

    const handleOpenModal = (type: string) => {
        setModalType(type);
        setModalVisible(true);
    };
    const handleCloseModal = () => setModalVisible(false);

    return (
        <ScrollView style={styles.rootContainer}>
            <Image
                source={{
                    uri: "https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                style={styles.image}
            />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{data.title}</Text>
                    <Pressable>
                        <AntDesign name="heart" size={24} color="red" />
                    </Pressable>
                </View>
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
                    data={data.extendedIngredients.slice(0, 4)} // Tampilkan 5 pertama
                    renderItem={({ item }) => (
                        <View
                            style={{ flexDirection: "row", gap: 8, width: 200, marginBottom: 10 }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: "black",
                                    borderRadius: 50,
                                }}
                            ></View>
                            <View>
                                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
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
                    data={data.nutrition.nutrients.slice(0, 4)} // Tampilkan 5 pertama
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
                    data={data.analyzedInstructions[0].steps}
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
                data={data}
                type={modalType}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        position: "relative",
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
        marginBottom: 20,
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
});

export default Detail;
