import { router } from "expo-router";
import { Pressable, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
    item: {
        id: number;
        image: string;
        title: string;
    };
};

const FullCard = ({ item }: Props) => {
    return (
        <Pressable
            style={{ height: 540, position: "relative", borderRadius: 20 }}
            onPress={() => {
                router.push(`/detail/${item.id}`);
            }}
        >
            <Image
                source={{
                    uri: item.image,
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
                    {item.title}
                </Text>
            </LinearGradient>
        </Pressable>
    );
};

export default FullCard;
