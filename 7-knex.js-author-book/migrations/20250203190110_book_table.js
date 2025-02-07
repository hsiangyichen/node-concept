/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("books", (table) => {
    table.increments("id").primary();
    table.string("title", 100).notNullable();
    table.integer("published").unsigned();
    table
      .integer("author_id")
      .unsigned()
      .notNullable()
      .references("authors.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("books");
}
