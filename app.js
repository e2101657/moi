import { Hono } from "@hono/hono";
import postgres from "postgres";
 
const BANNED_WORDS = [
  "delete", "update", "insert", "drop", "alter", "create",
  "truncate", "replace", "merge", "grant", "revoke",
  "transaction", "commit", "rollback", "savepoint", "lock",
  "execute", "call", "do", "set", "comment"
];
 
const query = async (query) => {
  for (const word of BANNED_WORDS) {
    if (query.toLowerCase().includes(word)) {
      throw new Error(`You cannot ${word} data`);
    }
  }
 
  const sql = postgres({
    max: 2,
    max_lifetime: 10,
    host: "database.cs.aalto.fi",
    port: 54321,
    database: "dbee0713e4fba745",
    username: "dbee0713e4fba745",
    password: "dbb7af04c91f1c46",
  });
 
  return await sql.unsafe(query);
};
 
const app = new Hono();
 
app.get("/*", (c) => {
  return c.html(`
<html>
<head>
<title>Hello, world!</title>
</head>
<body>
<h1>Hello, world!</h1>
<p>Do simple queries like "SELECT 1 + 1".</p>
</body>
</html>
  `);
});
 
app.post("/*", async (c) => {
  const body = await c.req.json();
  const result = await query(body.query);
  return c.json({ result }); 
});
Deno.serve(app.fetch);
