#!/usr/bin/env node
/**
 * sql MCP server. One tool: `format`.
 *
 * Format SQL queries via `sql-formatter`. Supports most major dialects:
 * sql (generic), postgresql, mysql, mariadb, sqlite, bigquery, redshift,
 * snowflake, transactsql (MSSQL), db2, plsql, trino, hive, spark.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { format as sqlFormat } from 'sql-formatter';

const VERSION = '0.1.0';

export type Dialect =
  | 'sql'
  | 'postgresql'
  | 'mysql'
  | 'mariadb'
  | 'sqlite'
  | 'bigquery'
  | 'redshift'
  | 'snowflake'
  | 'transactsql'
  | 'db2'
  | 'plsql'
  | 'trino'
  | 'hive'
  | 'spark';

const DIALECTS: Dialect[] = [
  'sql', 'postgresql', 'mysql', 'mariadb', 'sqlite',
  'bigquery', 'redshift', 'snowflake', 'transactsql',
  'db2', 'plsql', 'trino', 'hive', 'spark',
];

export interface FormatOpts {
  dialect?: Dialect;
  tab_width?: number;
  uppercase?: boolean;
}

export function format(sql: string, opts: FormatOpts = {}): string {
  return sqlFormat(sql, {
    language: opts.dialect ?? 'sql',
    tabWidth: opts.tab_width ?? 2,
    keywordCase: opts.uppercase === false ? 'preserve' : 'upper',
  });
}

const server = new Server({ name: 'sql', version: VERSION }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'format',
    description:
      'Format a SQL query. Supports 14 dialects (Postgres, MySQL, SQLite, BigQuery, Snowflake, MSSQL, etc.). Default uppercases keywords.',
    inputSchema: {
      type: 'object',
      properties: {
        sql: { type: 'string' },
        dialect: { type: 'string', enum: DIALECTS, default: 'sql' },
        tab_width: { type: 'integer', default: 2, minimum: 0, maximum: 8 },
        uppercase: { type: 'boolean', default: true, description: 'Uppercase keywords (SELECT, FROM, etc.).' },
      },
      required: ['sql'],
    },
  },
] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    if (name !== 'format') return errorResult('unknown tool: ' + name);
    const a = args as unknown as { sql: string } & FormatOpts;
    return textResult(format(a.sql, a));
  } catch (err) {
    return errorResult('sql format failed: ' + (err as Error).message);
  }
});

function textResult(text: string) {
  return { content: [{ type: 'text', text }] };
}
function errorResult(message: string) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`sql MCP server v${VERSION} ready on stdio\n`);
}
