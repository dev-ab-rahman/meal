import { buildRecordsFromRows, createMealRecordPayload } from "./meal-db";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message ?? `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

test("buildRecordsFromRows converts database rows into day meal records", () => {
  const rows = [
    {
      date_key: "2026-07-18",
      breakfast: 1,
      lunch: 0,
      dinner: 1,
      guest_count: 2,
    },
    {
      date_key: "2026-07-19",
      breakfast: 0,
      lunch: 1,
      dinner: 0,
      guest_count: 0,
    },
  ];

  const records = buildRecordsFromRows(rows);

  assertEqual(records["2026-07-18"], {
    breakfast: true,
    lunch: false,
    dinner: true,
  });
  assertEqual(records["2026-07-19"], {
    breakfast: false,
    lunch: true,
    dinner: false,
  });
});

test("createMealRecordPayload serializes meal values for sqlite writes", () => {
  const payload = createMealRecordPayload("2026-07-20", {
    breakfast: true,
    lunch: false,
    dinner: true,
  });

  assertEqual(payload, {
    date_key: "2026-07-20",
    breakfast: 1,
    lunch: 0,
    dinner: 1,
    guest_count: 0,
  });
});
