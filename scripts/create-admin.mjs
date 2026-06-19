import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL no está configurado en .env");
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

async function createAdmin() {
  let email = process.argv[2];
  let password = process.argv[3];
  let name = process.argv[4] ?? "Administrador";

  if (!email || !password) {
    console.log("\n── Crear usuario administrador del CMS ──\n");
    email = email ?? await ask("Email: ");
    password = password ?? await ask("Contraseña: ");
    name = await ask(`Nombre (Enter para "${name}"): `) || name;
  }
  rl.close();

  const connection = await mysql.createConnection(DATABASE_URL);
  const passwordHash = await bcrypt.hash(password, 12);
  const openId = `cms-admin-${Date.now()}`;

  try {
    const [rows] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      await connection.execute(
        "UPDATE users SET name = ?, passwordHash = ?, loginMethod = 'email', role = 'admin' WHERE email = ?",
        [name, passwordHash, email]
      );
      console.log("\n✓ Usuario admin actualizado correctamente.");
    } else {
      await connection.execute(
        "INSERT INTO users (openId, name, email, passwordHash, loginMethod, role, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, ?, ?, 'email', 'admin', NOW(), NOW(), NOW())",
        [openId, name, email, passwordHash]
      );
      console.log("\n✓ Usuario admin creado correctamente.");
    }

    console.log(`\n  Email:     ${email}`);
    console.log(`  Password:  ${password}`);
    console.log(`  Login en:  /cms/login\n`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createAdmin();
