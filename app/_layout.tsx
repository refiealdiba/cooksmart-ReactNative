import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
    const createDbIfNeeded = async (db: SQLiteDatabase) => {
        console.log("Creating database if needed...");
        try {
            await db.execAsync(
                `
                CREATE TABLE IF NOT EXISTS favoriterecipe (id INTEGER, title TEXT, image TEXT);
                CREATE TABLE IF NOT EXISTS cart(id INTEGER, title TEXT, image TEXT, quantity INTEGER, unit TEXT);
                CREATE TABLE IF NOT EXISTS mealplan(id INTEGER, day TEXT, sumcal INTEGER, sumprot INTEGER);
                CREATE TABLE IF NOT EXISTS mealplanrecipes(id INTEGER, idday INTEGER, title TEXT, image TEXT, calories INTEGER, proteins INTEGER, FOREIGN KEY(idday) REFERENCES mealplan(id));                                           
                `
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
