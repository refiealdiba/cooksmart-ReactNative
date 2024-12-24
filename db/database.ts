import * as SQLite from "expo-sqlite";
import { useState } from "react";

const db = SQLite.openDatabaseSync("favorite.db");
