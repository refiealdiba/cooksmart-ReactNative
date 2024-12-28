import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    searchQuery: string;
    setSearchQuery: (text: string) => void;
    onSearch: (text: string) => void;
};

const SearchInputBox = ({ searchQuery, setSearchQuery, onSearch }: Props) => {
    return (
        <View style={styles.inputContainer}>
            <View style={styles.inputHeaderContainer}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={40} color="#fff" />
                </View>
                <View>
                    <Text style={styles.inputHeaderTitle}>Let's Cook!</Text>
                    <Text style={styles.inputHeaderSubtitle}>
                        With more than 1000 recipes in our app from multiple countries
                    </Text>
                </View>
            </View>
            <TextInput
                placeholder="Quick search"
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    onSearch(text);
                }}
                style={styles.input}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fefeff",
        borderRadius: 10,
    },
    inputHeaderContainer: {
        flexDirection: "row",
        gap: 10,
        width: 280,
        marginBottom: 10,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        paddingLeft: 8,
        backgroundColor: "#2278ed",
        justifyContent: "center",
    },
    inputHeaderTitle: {
        fontSize: 17,
        fontWeight: "semibold",
    },
    inputHeaderSubtitle: {
        color: "#2278ed",
        fontSize: 12,
    },
    input: {
        width: "100%",
        backgroundColor: "#f4f2f5",
        paddingHorizontal: 20,
        borderRadius: 10,
    },
});

export default SearchInputBox;
