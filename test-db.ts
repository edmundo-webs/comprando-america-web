import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { blogPosts } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function main() {
  const pool = mysql.createPool({
    uri: "mysql://user:badpass@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test",
  });
  const db = drizzle(pool);
  try {
    const res = await db.select().from(blogPosts).where(eq(blogPosts.status, "published"));
    console.log("Success, count:", res.length);
  } catch (err: any) {
    console.error("FAILED ERROR MESSAGE:", err.message);
  }
  process.exit(0);
}
main();
