import { useState, useEffect } from "react";
import {
    Text,
    View,
    Pressable,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    Modal,
    FlatList,
} from "react-native";
import { FontAwesome6, Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/api/api";
import { useSQLiteContext } from "expo-sqlite";

const Explore = () => {
    const [randomRecipe, setRandomRecipe] = useState({
        id: 0,
        title: "",
        image: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState<string[]>([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [searchResult, setSearchResult] = useState([
        {
            id: 0,
            title: "",
            image: "",
        },
    ]);
    const [errMsg, setErrMsg] = useState("");
    const toggleFilter = (item: string) => {
        setFilterQuery(
            (prev) =>
                prev.includes(item)
                    ? prev.filter((i) => i !== item) // Remove if already selected
                    : [...prev, item] // Add if not selected
        );
    };
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

    const fetchRandomRecipe = async () => {
        try {
            // Kosongkan random recipe sebelum memuat data baru
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

    const fetchSearchComplex = async (query: string) => {
        try {
            const response = await api.get("/recipes/complexSearch", {
                params: {
                    query: searchQuery,
                    diet: filterQuery.join(","),
                },
            });
            setSearchResult(response.data.results);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    useEffect(() => {
        fetchRandomRecipe();
        checkFavorite(randomRecipe.id.toString()); // Memuat random recipe saat komponen dirender pertama kali
    }, []);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            fetchSearchComplex(searchQuery); // Pastikan nilai terbaru digunakan
        } else {
            setSearchResult([]); // Kosongkan hasil pencarian jika input kosong
        }
    }, [searchQuery, filterQuery]); // Trigger pemanggilan saat searchQuery atau filterQuery berubah

    const router = useRouter();
    const handlerModalFilter = () => {
        setFilterModalVisible(!filterModalVisible);
    };

    // Eksekusi add DB
    const db = useSQLiteContext();
    const [liked, setLiked] = useState(false);
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
        try {
            if (liked) {
                // Jika sudah di-favorite, hapus dari database
                await removeFavoriteFromDb(id);
                setLiked(false);
            } else {
                // Jika belum di-favorite, tambahkan ke database
                await addFavoriteToDb(id, title, image);
                setLiked(true);
            }
            setTimeout(() => {
                fetchRandomRecipe(); // Fetch data baru setelah 1 detik
                setLiked(false);
            }, 700);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView style={styles.rootContainer}>
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingRight: 20,
                    justifyContent: "space-between",
                    marginBottom: 5,
                    position: "relative",
                }}
            >
                <TextInput
                    placeholder="Looking for something to cook?"
                    style={{ width: "80%" }}
                    onChangeText={(text) => setSearchQuery(text)} // Hanya memperbarui searchQuery
                />

                <Pressable onPress={handlerModalFilter}>
                    {filterModalVisible ? (
                        <FontAwesome6 name="filter" size={20} color="#2278ed" />
                    ) : (
                        <AntDesign name="filter" size={24} color="#2278ed" />
                    )}
                </Pressable>
                <Modal
                    visible={filterModalVisible}
                    transparent={true}
                    onRequestClose={handlerModalFilter}
                >
                    <View
                        style={{
                            position: "absolute",
                            width: 200,
                            top: 70,
                            right: 20,
                            backgroundColor: "#fff",
                            padding: 10,
                            borderRadius: 5,
                            // zIndex: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: "#2278ed",
                                fontWeight: "bold",
                                borderBottomColor: "#e0e7f1",
                                borderBottomWidth: 1,
                                paddingBottom: 5,
                            }}
                        >
                            Diet
                        </Text>
                        <View style={{ width: "100%", marginTop: 20, paddingHorizontal: 5 }}>
                            {diets.map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => toggleFilter(item)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: "#2278ed",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: 10,
                                        }}
                                    >
                                        {filterQuery.includes(item) && (
                                            <View
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: "#2278ed",
                                                }}
                                            />
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
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginBottom: 30,
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: "#2278ed",
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                        borderRadius: 20,
                        marginTop: 10,
                    }}
                    onPress={() => router.push("/ingredientSearch")}
                >
                    <Text style={{ color: "white" }}>Ingredients Search</Text>
                </Pressable>
            </View>
            <View>
                {searchResult.length > 0 ? (
                    <FlatList
                        scrollEnabled={false}
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
                ) : (
                    <>
                        <Text
                            style={{
                                marginBottom: 15,
                                marginTop: 10,
                                textAlign: "center",
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            You May Like
                        </Text>
                        <Pressable
                            style={{ height: 540, position: "relative", borderRadius: 20 }}
                            onPress={() => {
                                router.push(`/detail/${randomRecipe.id}`);
                            }}
                        >
                            <Image
                                source={{
                                    uri: randomRecipe.image,
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: 20,
                                }}
                            />
                            <LinearGradient
                                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    width: "100%",
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        padding: 20,
                                        fontSize: 24,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {randomRecipe.title}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                        <View
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                padding: 1,
                                justifyContent: "space-around",
                                marginTop: 15,
                            }}
                        >
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        position: "relative",
        padding: 20,
        backgroundColor: "#eef5ff",
    },
    container: {
        backgroundColor: "#2278ed",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
});

export default Explore;
