// src/server/db/schema.ts

// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

// Dicas do Igor:
// Indexar colunas: Sempre que você tiver uma coluna que será usada frequentemente para buscar dados. Por exemplo, em uma tabela de usuários, você quase sempre vai procurar usuários pelo email ou username. Criar um índice nessas colunas torna essas buscas quase instantâneas, mesmo com milhões de usuários. N

// sqliteTableCreator: Quando eu usaria isso? Imagine que sua empresa tem um único banco de dados gigante, mas vários projetos (o site, o app, um sistema interno). Para evitar que a tabela "users" do site conflite com a tabela "users" do app, você usaria prefixos: site_users, app_users. O sqliteTableCreator automatiza isso para você. É uma ótima prática para organização em projetos grandes ou em monorepos.


import { sql } from "drizzle-orm"; // O que é? É uma "saída de emergência" ou "escape hatch". Permite que você escreva um pedaço de código SQL bruto diretamente dentro da sua definição de schema do Drizzle.

import { index, sqliteTable, text, integer } from "drizzle-orm/sqlite-core"; // sqliteTable, que cria a tabela com o nome exato que você definir. É uma simplificação para focar no essencial. index ajuda a indexar e texto e inteiro servem para definir campos desse tipo nas tabelas

import { relations } from "drizzle-orm"; // relations é a argamassa que conecta as tabelas umas às outras.
// O que é? É uma função auxiliar do Drizzle que descreve as relações entre suas tabelas para o Query Builder do Drizzle. Isso não cria a relação no banco de dados SQL (quem faz isso é a chave estrangeira ou foreign key), mas "ensina" o Drizzle a fazer buscas complexas de forma muito fácil



/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const posts = sqliteTable(
	"post",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		name: text("name", { length: 256 }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
			() => new Date(),
		),
	},
	(example) => ({
		nameIndex: index("name_idx").on(example.name),
	}),
);