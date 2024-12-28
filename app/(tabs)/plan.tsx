import { useCallback, useEffect, useState } from "react";
import { Text, View, Pressable, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";

type Plan = {
    id: string;
    day: string;
    sumcal: string;
    sumprot: string;
};

type PlanDetail = {
    idday: string;
    sumcal: string;
    sumprot: string;
};

const Plan = () => {
    const router = useRouter();
    // Eksekusi mengambil semua data recipe
    const [plans, setPlans] = useState<Plan[]>([]);
    const [plansDetail, setPlansDetail] = useState<PlanDetail[]>([]);
    const db = useSQLiteContext();
    const getAllPlanInfo = async () => {
        try {
            const response = await db.getAllAsync("SELECT * FROM mealplan");
            setPlans(response as Plan[]);
            console.log("succes getting all info");
        } catch (error) {
            console.log(error);
        }
    };

    const getAllPlanByIdDay = async () => {
        try {
            const response = await db.getAllAsync(
                "SELECT idday, SUM(calories) as sumcal, SUM(proteins) as sumprot FROM mealplanrecipes GROUP BY idday"
            );
            setPlansDetail(response as PlanDetail[]);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getAllPlanInfo();
            getAllPlanByIdDay();
        }, [db])
    );
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#eef5ff" }}>
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    marginTop: 20,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                }}
            >
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "#34495e",
                        width: "80%",
                    }}
                >
                    Meal Plan
                </Text>
                <Pressable
                    style={{
                        backgroundColor: "#3498db",
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 20,
                        alignSelf: "flex-end",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        router.push("/cart");
                    }}
                >
                    <Image
                        source={{
                            uri: "https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png",
                        }}
                        style={{ width: 16, height: 16, marginRight: 8 }}
                    />
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Cart</Text>
                </Pressable>
            </View>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    paddingBottom: 60,
                }}
            >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    numColumns={2}
                    key={1}
                    data={plans}
                    keyExtractor={(item) => item.day}
                    renderItem={({ item }) => (
                        <Pressable
                            style={{
                                width: 170,
                                backgroundColor: "#fff",
                                paddingVertical: 20,
                                paddingHorizontal: 10,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 10,
                                borderRadius: 10,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                            onPress={() => router.push(`/day/${item.id}`)}
                        >
                            <Image
                                source={{
                                    uri: `https://img.icons8.com/fluency/96/meal.png`,
                                }}
                                style={{ width: 50, height: 50, marginBottom: 10 }}
                            />
                            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#2c3e50" }}>
                                {item.day.toUpperCase()}
                            </Text>
                            <Text style={{ fontSize: 13, color: "#34495e", marginTop: 8 }}>
                                Calories:{" "}
                                {plansDetail[parseInt(item.id) - 1]?.sumcal
                                    ? Math.round(
                                          parseInt(plansDetail[parseInt(item.id) - 1]?.sumcal)
                                      )
                                    : "0"}
                            </Text>
                            <Text style={{ fontSize: 13, color: "#34495e", marginTop: 8 }}>
                                Calories:{" "}
                                {plansDetail[parseInt(item.id) - 1]?.sumprot
                                    ? Math.round(
                                          parseInt(plansDetail[parseInt(item.id) - 1]?.sumprot)
                                      )
                                    : "0"}
                                g
                            </Text>
                        </Pressable>
                    )}
                />
            </View>
        </View>
    );
};

export default Plan;
