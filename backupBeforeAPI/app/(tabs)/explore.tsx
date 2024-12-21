import { Text, View, Pressable, StyleSheet, Image, ScrollView, TextInput } from "react-native";
// import onion from "@/assets/images/onion.png";
import { FontAwesome6, Ionicons, AntDesign } from "@expo/vector-icons";

const Explore = () => {
    return (
        <ScrollView style={styles.rootContainer}>
            {/* <View style={styles.container}>
                <Pressable>
                    <Image
                        source={onion}
                        width={20}
                        height={20}
                        style={{ width: 40, height: 40 }}
                    />
                    <Text>Search by Ingredients</Text>
                </Pressable>
                <Pressable>
                    <FontAwesome6 name="searchengin" size={40} color={"white"} />
                    <Text>Advanced Search</Text>
                </Pressable>
            </View> */}
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
                    marginBottom: 20,
                }}
            >
                <TextInput placeholder="looking for something to cook?" />
                <AntDesign name="filter" size={24} color="#2278ed" />
            </View>
            <View
                style={{
                    width: 400,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
                    How About This
                </Text>
                <Text>Or</Text>
                <Pressable
                    style={{
                        backgroundColor: "#2278ed",
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 5,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: "white" }}>Search by Ingredients</Text>
                </Pressable>
            </View>
            <View>
                <View style={{ height: 540, position: "relative", borderRadius: 20 }}>
                    <Image
                        source={{
                            uri: "https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 20,
                        }}
                    />
                    <Text
                        style={{
                            position: "absolute",
                            bottom: 0,
                            color: "#fff",
                            padding: 20,
                            fontSize: 24,
                            fontWeight: "bold",
                        }}
                    >
                        Spaghetti Bolognese
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        padding: 1,
                        justifyContent: "space-around",
                        marginTop: 15,
                    }}
                >
                    <Pressable>
                        <Ionicons name="close" size={40} color="gray" />
                    </Pressable>
                    <Pressable>
                        <AntDesign name="heart" size={35} color="#ff0000" />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        position: "relative",
        padding: 20,
        // paddingTop: 0,
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
