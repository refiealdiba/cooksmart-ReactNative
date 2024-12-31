# 📄Documentation

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Buat file .env untuk autentikasi API dengan struktur

    ```
    EXPO_PUBLIC_API_URL=https://api.spoonacular.com
    EXPO_PUBLIC_API_KEY=yourkey
    ```

2. Tambahkan perintah SQL berikut dibawah perintah SQL pembuatan table untuk membuat data hari pada Database ketika pertama dibuild

    **NOTE**: jika sudah ada dan sudah pernah dibuild menggunakan **npx expo start** atau **npm run start** hapus perintah sql berikut agar data hari tidak tertumpuk.

    ```sql
    INSERT INTO mealplan (id, day, sumcal, sumprot)
    VALUES
        ('1', 'Monday', '0','0'),
        ('2', 'Tuesday', '0','0'),
        ('3', 'Wednesday', '0','0'),
        ('4', 'Thursday', '0','0'),
        ('5', 'Friday', '0','0'),
        ('6', 'Saturday', '0','0'),
        ('7', 'Sunday', '0','0');
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Start the app

    ```bash
     npx expo start
    ```

    or

    ```bash
    npm run start
    ```

## API Usage

**BASE API**
menggunakan axios untuk melakukan pemanggilan API dan mengatur base url dan key untuk autentikasi API yang didapat dari file _**.env**_

```typescript
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
    params: {
        apiKey: apiKey,
    },
});
```

1.  **Mendapatkan semua recipe berdasarkan keyword biasa**

    ```typescript
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<searchResults | null>();

    const fetchQuickSearch = async (query: string) => {
        if (query.trim() === "") {
            setSearchResult(null);
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
    ```

    Contoh kode di atas terletak pada file **_index.tsx_**

    Saat _fetchQuickSearch_ dijalankan maka variable _response_ akan berisi daftar recipes yang memiliki nama yang sama dengan _parameter_ dari state _query_ kemudian akan disimpan dalam _state searchResult_ .

    _URL API:_  
    https://api.spoonacular.com/recipes/complexSearch?={query}

2.  **Mendapatkan random recipe dengan limit**

    ```typescript
    const [randomRecipes, setRandomRecipes] = useState<recommendations>();

    const fetchRandomRecipes = async () => {
        try {
            const response = await api.get("/recipes/random?number=10");
            setRandomRecipes(response.data.recipes);
        } catch (error) {
            setErrMsg(error as string);
        }
    };
    ```

    Contoh kode di atas terletak pada file **_index.tsx_**

    Saat _fetchRandomRecipes_ dijalankan maka variable _response_ akan berisi daftar random recipes denga limit data yang didapat adalah 10. Hasil dari pemanggilan API akan disimpan pada state _randomRecipes_ yang nantinya akan ditampilkan sebagai recommendation.

    _URL API:_
    https://api.spoonacular.com/recipes/random?number=10

3.  **Mendapatkan detail dari Recipe**

    ```typescript
    const { id } = useLocalSearchParams();
    const [recipe, setRecipe] = useState({
        image: "",
        title: "",
        readyInMinutes: "",
        cuisines: [],
        extendedIngredients: [
            {
                image: "",
                name: "",
                amount: 0,
                unit: "",
            },
        ],
        nutrition: {
            nutrients: [
                {
                    name: "",
                    amount: 0,
                    unit: "",
                },
            ],
        },
        analyzedInstructions: [
            {
                steps: [
                    {
                        step: "",
                    },
                ],
            },
        ],
        diets: [],
    });

    const fetchRecipeDetail = async () => {
        try {
            const response = await api.get(`/recipes/${id}/information?includeNutrition=true`);
            setRecipe(response.data);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };
    ```

    Contoh kode di atas terletak pada **_detail/[id].tsx_**

    Saat _fetchRecipeDetail_ dijalankan maka variabel _response_ akan berisi detail recipe dengan _id_ yang didapat dari parameter url menggunakan _useLocalSearchParams_ dengan parameter tambahan yaitu _includeNutrition=true_ agar data yang didapat lengkap dengan kandungan nutrisi dari recipe. Kemudian disimpan pada state _recipe_ dengan ketentuan hanya mengambil beberapa data yang diperlukan.

    _URL API:_
    https://api.spoonacular.com/recipes/{id}/information?includeNutrition=true

4.  **Mendapatkan daftar Recipes dengan filter diet**

    ```typescript
    const [searchResult, setSearchResult] = useState<searchResults[]>([]);
    const [filterQuery, setFilterQuery] = useState<string[]>([]);

    const toggleFilter = (item: string) => {
        setFilterQuery(
            (prev) =>
                prev.includes(item)
                    ? prev.filter((i) => i !== item) // Remove if already selected
                    : [...prev, item] // Add if not selected
        );
    };

    const fetchSearchComplex = async (query: string) => {
        try {
            const response = await api.get("/recipes/complexSearch", {
                params: {
                    query: query,
                    diet: filterQuery.join(","),
                },
            });
            setSearchResult(response.data.results);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };
    ```

    Contoh kode di atas terletak pada file _**explore.tsx**_

    Saat _fetchSearchComplex_ dijalankan maka variabel _response_ akan berisi hasil dari pemanggilan API untuk pencarian dengan parameter tambahan yaitu _query_ dan _filterQuery_ untuk filter diet. State _filterQuery_ berisi kumpulan string yang didapatkan ketika ada tombol pilihan filter yang ditekan.

    _URL_API:_ https://api.spoonacular.com/recipes/complexSearch?query={query}&diet={filterQuery}

5.  **Mendapatkan list Recipes dengan bahan**

    ```typescript
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState([
        {
            id: 0,
            image: "",
            title: "",
        },
    ]);

    // Fungsi untuk menambahkan field input
    const handleAddField = () => {
        setIngredientsList([...ingredientsList, ""]);
    };

    // Fungsi untuk menghapus field input
    const handleRemoveField = (index: number) => {
        const updatedList = ingredientsList.filter((_, i) => i !== index);
        setIngredientsList(updatedList);
    };

    // Fungsi untuk mengubah value input
    const handleInputChange = (text: string, index: number) => {
        const updatedList = [...ingredientsList];
        updatedList[index] = text;
        setIngredientsList(updatedList);
    };

    // Fungsi untuk fetch data dari API mencari recipes berdasarkan ingredients
    const fetchSearchIngredients = async () => {
        try {
            const response = await api.get("/recipes/findByIngredients", {
                params: {
                    ingredients: ingredientsList.join(","),
                },
            });
            setSearchResults(response.data);
        } catch {
            console.log("Failed to fetch data");
        }
    };
    ```

    Contoh kode di atas terletak pada file _**ingredientSearch.tsx**_

    Saat _fetchIngredients_ dijalankan maka response akan berisi list recipes yang mengandung bahan dari parameter _ingredients_ yang diambil dari state _ingredientsList_, lalu akan disimpan pada state _searchResult_. Untuk pengambilan data ingredient menggunakan beberapa field sesuai dengan kebutuhan dari user dan dikumpulkan dalam state _ingredientsList_.

    _URL API:_ https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredientsList}
