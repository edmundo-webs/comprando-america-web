import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function seedAdmin() {
  const connection = await mysql.createConnection(DATABASE_URL);

  const email = "admin@comprandoamerica.com";
  const password = "Admin2026!";
  const name = "Administrador";
  const role = "admin";

  const passwordHash = await bcrypt.hash(password, 12);
  const openId = `cms-admin-${Date.now()}`;

  try {
    // Check if admin already exists
    const [rows] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      console.log("Admin user already exists. Updating password...");
      await connection.execute(
        "UPDATE users SET passwordHash = ?, loginMethod = 'email', role = 'admin' WHERE email = ?",
        [passwordHash, email]
      );
      console.log("Admin password updated successfully!");
    } else {
      await connection.execute(
        "INSERT INTO users (openId, name, email, passwordHash, loginMethod, role, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, ?, ?, 'email', ?, NOW(), NOW(), NOW())",
        [openId, name, email, passwordHash, role]
      );
      console.log("Admin user created successfully!");
    }

    console.log(`\nCredentials:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`\nLogin at: /cms/login`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

seedAdmin();
