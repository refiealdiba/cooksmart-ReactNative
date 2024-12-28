import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import SearchInput from "@/components/SearchInputBox";
import SearchResultList from "@/components/SearchResultList";
import RecommendationList from "@/components/RecommendationList";
import { api } from "@/api/api";

type searchResults = [
    {
        id: number;
        image: string;
        title: string;
    }
];

type recommendations = [
    {
        id: number;
        title: string;
        image: string;
        readyInMinutes: number;
        cuisines: string[];
    }
];

export default function Index() {
    const [randomRecipes, setRandomRecipes] = useState<recommendations>();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<searchResults | null>();
    const [errMsg, setErrMsg] = useState("");

    const fetchRandomRecipes = async () => {
        try {
            const response = await api.get("/recipes/random?number=10", {
                params: {
                    number: 10,
                },
            });
            setRandomRecipes(response.data.recipes);
        } catch (error) {
            setErrMsg(error as string);
        }
    };

    const fetchQuickSearch = async (query: string) => {
        if (query.trim() === "") {
            setSearchResult([]);
            return;
        }
        try {
            const response = await api.get(`/recipes/complexSearch`, {
                params: { query },
            });
            setSearchResult(response.data.results);
        } catch (error) {
            setErrMsg("Error fetching data");
        }
    };

    useEffect(() => {
        fetchRandomRecipes();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>CookSmart</Text>
                <SearchInput
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={fetchQuickSearch}
                />
            </View>
            {searchQuery.length > 0 ? (
                <SearchResultList searchResults={searchResult as searchResults} />
            ) : (
                <RecommendationList recommendations={randomRecipes as recommendations} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    headerContainer: {
        paddingHorizontal: 20,
        width: "100%",
        height: 280,
        backgroundColor: "#2278ed",
        justifyContent: "space-around",
    },
    title: {
        marginTop: 30,
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
});
