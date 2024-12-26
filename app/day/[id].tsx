import { useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const DetailPlan = () => {
    const { id } = useLocalSearchParams();
    // Eksekusi untuk mendapatkan recipe dengan idday = id
    const db = useSQLiteContext();
    const [recipes, setRecipes] = useState();
    const getAllRecipeFromDb = async (id: string) => {
        try {
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View>
            <Text>Detail Plan</Text>
        </View>
    );
};

export default DetailPlan;
