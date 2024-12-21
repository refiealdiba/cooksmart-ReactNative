import { Text, View, FlatList, StyleSheet, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import allRecipes from "@/constants/allRecipes.json";

const Liked = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recipes That You Liked</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={allRecipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Link href="/detail" style={{ marginBottom: 20 }}>
                        <View style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <LinearGradient
                                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
                                style={styles.recipeTitle}
                            >
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                                    {item.title}
                                </Text>
                            </LinearGradient>
                        </View>
                    </Link>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eef5ff", // Background warna biru lembut
        paddingHorizontal: 10,
        paddingVertical: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#34495e", // Warna teks utama
        marginVertical: 20,
        marginLeft: 10,
    },
    listContent: {
        flexDirection: "column",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff", // Warna dasar kartu putih
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: "100%",
        marginBottom: 20,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: "100%",
        height: 150,
        objectFit: "cover",
    },
    textContainer: {
        padding: 15,
    },
    recipeTitle: {
        width: "100%",
        // Warna teks judul
        marginBottom: 5,
        position: "absolute",
        bottom: -5,
        paddingHorizontal: 20,
        paddingVertical: 10, // Warna latar
    },
    recipeInfo: {
        fontSize: 14,
        color: "#7f8c8d", // Warna teks informasi tambahan
    },
});

export default Liked;
