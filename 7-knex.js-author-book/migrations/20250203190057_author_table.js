/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("authors", (table) => {
    table.increments("id").primary();
    table.string("author").notNullable();
    table.integer("birthYear").notNullable();
    table.string("nationality").notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("authors");
}
