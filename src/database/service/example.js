const { and, asc, between, desc, eq } = require('drizzle-orm');
const { db } = require('..');
const { defaultFindOption } = require('../types');
const { example } = require('../schema');

class ExampleService {
  static async find(data) {
    const { id, created, sort, page, limit, from, to } = {
      ...defaultFindOption(),
      ...data,
    };
    return db.query.example.findMany({
      where: and(
        id ? eq(example.id, id) : undefined,
        created
          ? eq(example.created, created)
          : between(example.created, from, to),
      ),
      orderBy: sort == 'asc' ? [asc(example.created)] : [desc(example.created)],
      offset: (page - 1) * limit,
      limit,
    });
  }

  static async get(id) {
    return db.query.example.findFirst({
      where: eq(example.id, id),
    });
  }

  static async create(data) {
    return (
      await db.insert(example).values(data).onConflictDoNothing().returning()
    )[0];
  }

  static async update(id, data) {
    return (
      await db.update(example).set(data).where(eq(example.id, id)).returning()
    )[0];
  }

  static async delete(id) {
    await db.delete(example).where(eq(example.id, id));
  }
}

module.exports = { ExampleService };
