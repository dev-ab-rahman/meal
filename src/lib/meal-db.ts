import * as SQLite from "expo-sqlite";

import type { DayMeals, MealSlot } from "@/types/meal";

export type MealRow = {
  date_key: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  guest_count: number;
};

const DB_NAME = "meal-tracker.db";
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function openDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }

  return dbPromise;
}

async function ensureClearedMonthsTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cleared_months (
      month_key TEXT PRIMARY KEY NOT NULL
    );
  `);
}

export async function initMealDatabase() {
  try {
    const db = await openDatabase();

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS meal_records (
        date_key TEXT PRIMARY KEY NOT NULL,
        breakfast INTEGER NOT NULL DEFAULT 0,
        lunch INTEGER NOT NULL DEFAULT 0,
        dinner INTEGER NOT NULL DEFAULT 0,
        guest_count INTEGER NOT NULL DEFAULT 0
      );
    `);

    try {
      await db.execAsync(`
        ALTER TABLE meal_records ADD COLUMN guest_count INTEGER NOT NULL DEFAULT 0;
      `);
    } catch (error) {
      if (!(error instanceof Error && /duplicate column name|already exists/i.test(error.message))) {
        throw error;
      }
    }

    await ensureClearedMonthsTable(db);
  } catch (error) {
    console.warn("Failed to initialize meal database", error);
  }
}

export function createMealRecordPayload(dateKey: string, meals: DayMeals, guestCount = 0) {
  return {
    date_key: dateKey,
    breakfast: meals.breakfast ? 1 : 0,
    lunch: meals.lunch ? 1 : 0,
    dinner: meals.dinner ? 1 : 0,
    guest_count: guestCount,
  };
}

export async function saveMealRecord(dateKey: string, meals: DayMeals, guestCount = 0) {
  try {
    const db = await openDatabase();
    const payload = createMealRecordPayload(dateKey, meals, guestCount);

    await db.runAsync(
      `
        INSERT INTO meal_records (date_key, breakfast, lunch, dinner, guest_count)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(date_key) DO UPDATE SET
          breakfast = excluded.breakfast,
          lunch = excluded.lunch,
          dinner = excluded.dinner,
          guest_count = excluded.guest_count;
      `,
      [payload.date_key, payload.breakfast, payload.lunch, payload.dinner, payload.guest_count],
    );
  } catch (error) {
    console.warn("Failed to save meal record", error);
  }
}

export async function loadMealRecords(): Promise<Record<string, DayMeals>> {
  try {
    const db = await openDatabase();
    const rows = await db.getAllAsync<MealRow>(
      `SELECT date_key, breakfast, lunch, dinner, guest_count FROM meal_records ORDER BY date_key ASC;`,
    );

    return buildRecordsFromRows(rows);
  } catch (error) {
    console.warn("Failed to load meal records", error);
    return {};
  }
}

export function buildRecordsFromRows(rows: MealRow[]): Record<string, DayMeals> {
  return rows.reduce<Record<string, DayMeals>>((acc, row) => {
    acc[row.date_key] = {
      breakfast: Boolean(row.breakfast),
      lunch: Boolean(row.lunch),
      dinner: Boolean(row.dinner),
      guestCount: row.guest_count ?? 0,
    } as DayMeals & { guestCount: number };
    return acc;
  }, {});
}

export async function getMealRecord(dateKey: string): Promise<DayMeals | null> {
  try {
    const db = await openDatabase();
    const row = await db.getFirstAsync<MealRow>(
      `SELECT date_key, breakfast, lunch, dinner, guest_count FROM meal_records WHERE date_key = ?;`,
      [dateKey],
    );

    if (!row) {
      return null;
    }

    return {
      breakfast: Boolean(row.breakfast),
      lunch: Boolean(row.lunch),
      dinner: Boolean(row.dinner),
      guestCount: row.guest_count ?? 0,
    } as DayMeals & { guestCount: number };
  } catch (error) {
    console.warn("Failed to get meal record", error);
    return null;
  }
}

export async function deleteMealRecord(dateKey: string) {
  try {
    const db = await openDatabase();
    await db.runAsync(`DELETE FROM meal_records WHERE date_key = ?;`, [dateKey]);
  } catch (error) {
    console.warn("Failed to delete meal record", error);
  }
}

export async function markMonthAsCleared(monthKey: string) {
  try {
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO cleared_months (month_key) VALUES (?) ON CONFLICT(month_key) DO NOTHING;`,
      [monthKey],
    );
  } catch (error) {
    console.warn("Failed to mark month as cleared", error);
  }
}

export async function isMonthCleared(monthKey: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    const row = await db.getFirstAsync<{ month_key: string }>(
      `SELECT month_key FROM cleared_months WHERE month_key = ?;`,
      [monthKey],
    );
    return Boolean(row);
  } catch (error) {
    console.warn("Failed to check cleared month", error);
    return false;
  }
}

export async function unmarkMonthAsCleared(monthKey: string) {
  try {
    const db = await openDatabase();
    await db.runAsync(`DELETE FROM cleared_months WHERE month_key = ?;`, [monthKey]);
  } catch (error) {
    console.warn("Failed to unmark cleared month", error);
  }
}

export function createEmptyDayMeals(): DayMeals {
  return {
    breakfast: false,
    lunch: false,
    dinner: false,
  };
}

export function toggleMealSlot(meals: DayMeals, slot: MealSlot): DayMeals {
  return { ...meals, [slot]: !meals[slot] };
}
