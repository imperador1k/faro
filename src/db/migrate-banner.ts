import { db } from "./drizzle";
import { sql } from "drizzle-orm";

async function run() {
  await db.execute(
    sql`ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS user_banner_src text;`,
  );
  console.log("Column added");
}
run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
