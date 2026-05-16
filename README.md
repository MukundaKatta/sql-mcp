# sql-mcp

[![npm](https://img.shields.io/npm/v/@mukundakatta/sql-mcp.svg)](https://www.npmjs.com/package/@mukundakatta/sql-mcp)
[![mcp](https://img.shields.io/badge/protocol-MCP-blue.svg)](https://modelcontextprotocol.io)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

MCP server: format SQL queries. Backed by `sql-formatter`, supports 14
dialects.

## Tool

### `format`

```json
{ "sql": "select id, name from users where age > 21 order by id", "dialect": "postgresql" }
```

→

```
SELECT
  id,
  name
FROM
  users
WHERE
  age > 21
ORDER BY
  id
```

| Field        | Default | Notes                                                                                  |
|--------------|---------|----------------------------------------------------------------------------------------|
| `dialect`    | `sql`   | `postgresql`, `mysql`, `mariadb`, `sqlite`, `bigquery`, `redshift`, `snowflake`, `transactsql`, `db2`, `plsql`, `trino`, `hive`, `spark` |
| `tab_width`  | 2       | 0-8                                                                                    |
| `uppercase`  | true    | Uppercase keywords (SELECT, FROM, …)                                                   |

## Configure

```json
{ "mcpServers": { "sql": { "command": "npx", "args": ["-y", "@mukundakatta/sql-mcp"] } } }
```

## License

MIT.
