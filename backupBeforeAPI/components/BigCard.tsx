import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons, AntDesign } from "@expo/vector-icons";

type Props = {
    item: {
        id: number;
        image: string;
        title: string;
        cuisine: string;
        minute: string;
    };
};

const BigCard = ({ item }: Props) => {
    return (
        <Link href={`/detail`} asChild>
            <Pressable style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardText}>
                    {item.title.length > 15 ? item.title.substring(0, 18) + "..." : item.title}
                </Text>
                <View style={styles.cardTextContainer}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 5, width: 200 }}
                    >
                        <AntDesign name="clockcircle" size={14} color={"#2278ed"} />
                        <Text>{item.minute}</Text>
                    </View>
                    <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 5, width: 200 }}
                    >
                        <Ionicons name="flag" size={16} color={"#2278ed"} />
                        <Text>{item.cuisine}</Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 6,

        paddingBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 7,
        elevation: 3,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 100,
        objectFit: "cover",
    },
    cardTextContainer: {
        marginTop: 5,
        paddingLeft: 12,
    },
    cardText: {
        marginTop: 10,
        fontWeight: "bold",
        fontSize: 16,
        paddingLeft: 12,
    },
});

export default BigCard;
