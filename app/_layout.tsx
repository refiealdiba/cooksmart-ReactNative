import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
    const createDbIfNeeded = async (db: SQLiteDatabase) => {
        console.log("Creating database if needed...");
        try {
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS favoriterecipe (id TEXT, title TEXT, image TEXT);
                CREATE TABLE IF NOT EXISTS cart(id TEXT, title TEXT, image TEXT, quantity TEXT, unit TEXT);
                DELETE FROM cart;`
            );
            console.log("Database created successfully");
        } catch (e) {
            console.error(`Error creating database:${e}`);
        }
    };
    return (
        <SQLiteProvider databaseName="cooksmarts.db" onInit={createDbIfNeeded}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="detail/[id]" />
                <Stack.Screen name="day/[id]" />
                <Stack.Screen name="ingredientSearch" />
                <Stack.Screen name="cart" />
                <Stack.Screen name="+not-found" />
            </Stack>
        </SQLiteProvider>
    );
}
