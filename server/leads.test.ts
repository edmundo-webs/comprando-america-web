/**
 * `ca_leads` ya no se escribe (Tanda 1: los leads van al CMS por
 * POST /api/leads). Se conserva la prueba de ensureLeadsTable, que sigue
 * existiendo para leer lo que la tabla ya tiene.
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

beforeEach(() => {
  execute.mockReset();
  query.mockReset();
  query.mockResolvedValue([{}]);
});

describe("createLead", () => {
  it("ya no existe: el sitio no escribe leads en su base (CLAUDE.md §1)", () => {
    expect((db as Record<string, unknown>).createLead).toBeUndefined();
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
