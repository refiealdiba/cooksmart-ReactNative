import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const DetailPlan = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>Detail Plan</Text>
        </View>
    );
};

export default DetailPlan;
