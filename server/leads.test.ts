/**
 * Regresión del bug "el formulario de /cumbre-digital no registra leads":
 * la migración 0007 nunca corrió en producción, así que cada INSERT en
 * `ca_leads` devolvía ER_NO_SUCH_TABLE → 500 → el lead se perdía.
 *
 * Estas pruebas usan un pool mysql2 falso, así que no necesitan una base real.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.DATABASE_URL = "mysql://fake:fake@127.0.0.1:4000/test";

const execute = vi.fn();
const query = vi.fn();

const fakePool = {
  execute,
  query,
  getConnection: async () => ({ release() {} }),
};

vi.mock("mysql2/promise", () => ({
  default: { createPool: () => fakePool },
}));

// createLead relee la fila insertada con drizzle; devolvemos una fila fija.
vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: () => ({
    select: () => ({
      from: () => ({
        where: () => ({ limit: async () => [{ id: 1, nombreCompleto: "Ada Lovelace" }] }),
      }),
    }),
  }),
}));

const db = await import("./db");

function noSuchTable() {
  const err: any = new Error("Table 'test.ca_leads' doesn't exist");
  err.code = "ER_NO_SUCH_TABLE";
  return err;
}

const LEAD = {
  nombreCompleto: "Ada Lovelace",
  whatsapp: "+52 5512345678",
  email: "ada@example.com",
  fuente: "cumbre-digital",
};

beforeEach(() => {
  execute.mockReset();
  query.mockReset();
  query.mockResolvedValue([{}]);
});

describe("createLead", () => {
  it("inserta el lead cuando la tabla ya existe", async () => {
    execute.mockImplementation(async (sql: string) => {
      if (sql.startsWith("INSERT INTO ca_leads")) return [{ insertId: 1 }];
      return [[]];
    });

    const lead = await db.createLead(LEAD);

    expect(lead).toBeDefined();
    const inserts = execute.mock.calls.filter(([sql]) => String(sql).startsWith("INSERT INTO ca_leads"));
    expect(inserts).toHaveLength(1);
    expect(inserts[0][1]).toEqual([LEAD.nombreCompleto, LEAD.whatsapp, LEAD.email, LEAD.fuente]);
  });

  it("crea ca_leads al vuelo y reintenta cuando la tabla no existe", async () => {
    let insertAttempts = 0;
    execute.mockImplementation(async (sql: string) => {
      if (String(sql).startsWith("INSERT INTO ca_leads")) {
        insertAttempts += 1;
        if (insertAttempts === 1) throw noSuchTable();
        return [{ insertId: 7 }];
      }
      return [[]]; // information_schema: el índice todavía no existe
    });

    const lead = await db.createLead(LEAD);

    expect(insertAttempts).toBe(2);
    expect(lead).toBeDefined();
    const ddl = query.mock.calls.map(([sql]) => String(sql)).join("\n");
    expect(ddl).toContain("CREATE TABLE IF NOT EXISTS `ca_leads`");
  });

  it("propaga errores que no sean 'tabla inexistente' sin reintentar", async () => {
    const err: any = new Error("connection lost");
    err.code = "PROTOCOL_CONNECTION_LOST";
    let insertAttempts = 0;
    execute.mockImplementation(async (sql: string) => {
      if (String(sql).startsWith("INSERT INTO ca_leads")) {
        insertAttempts += 1;
        throw err;
      }
      return [[]];
    });

    await expect(db.createLead(LEAD)).rejects.toThrow("connection lost");
    expect(insertAttempts).toBe(1);
  });

  it("no escribe datos personales del visitante en los logs", async () => {
    const logged: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((...args) => {
      logged.push(args.map(String).join(" "));
    });
    execute.mockImplementation(async (sql: string) =>
      String(sql).startsWith("INSERT INTO ca_leads") ? [{ insertId: 1 }] : [[]]
    );

    await db.createLead(LEAD);
    spy.mockRestore();

    const all = logged.join("\n");
    expect(all).not.toContain(LEAD.email);
    expect(all).not.toContain(LEAD.whatsapp);
    expect(all).not.toContain(LEAD.nombreCompleto);
  });
});

describe("ensureLeadsTable", () => {
  it("es idempotente: usa CREATE TABLE IF NOT EXISTS y salta índices ya presentes", async () => {
    execute.mockResolvedValue([[{ 1: 1 }]]); // el índice ya existe

    await expect(db.ensureLeadsTable()).resolves.toBe(true);

    const statements = query.mock.calls.map(([sql]) => String(sql));
    expect(statements.some((s) => s.includes("CREATE TABLE IF NOT EXISTS `ca_leads`"))).toBe(true);
    expect(statements.some((s) => s.includes("CREATE INDEX"))).toBe(false);
  });
});
