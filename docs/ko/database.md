<h1 align="center">DiscordJS v14 Template 데이터베이스</h1>
<p align="center">
  <a href="/docs/en-US/database.md">English</a>
  &nbsp;|&nbsp;
  <a href="/docs/ko/database.md">한국어</a>
</p>

이 템플릿은 쉬운 데이터베이스 사용을 위하여 [Drizzle ORM](https://orm.drizzle.team/)을 사용중입니다.<br>
이 템플릿은 [PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql) 데이터베이스를 기본으로 사용합니다.

> [!NOTE]
> [SQLite](https://orm.drizzle.team/docs/get-started-sqlite) 데이터베이스를 사용하여 로컬로 저장하고 싶으면 [로컬 저장 방법](#로컬-저장-방법)을 참고해주세요.<br>
> 다른 데이터베이스를 사용하고 싶다면 [Drizzle ORM 문서](https://orm.drizzle.team/docs/get-started)를 참고해주세요.

## 목차

- [설정 구성](#설정-구성)
  - [환경 변수](#환경-변수)
- [스키마](#스키마)
- [서비스](#서비스)
- [로컬 저장 방법](#로컬-저장-방법)
  - [패키지 변경](#패키지-변경)
  - [마이그레이션 폴더 제거](#마이그레이션-폴더-제거)
  - [설정 코드 수정](#설정-코드-수정)
  - [메인 코드 수정](#메인-코드-수정)
  - [스키마 코드 수정](#스키마-코드-수정)

## 설정 구성

### 환경 변수

<a style="color: gray;" href="/.env.example">.env.example</a> 파일 이름을 <a style="color: gray;" href="/.env">.env</a>로 바꿔준 후, 아래의 내용처럼 작성해줍니다.

```properties
BOT_TOKEN= # Discord Bot Token
DATABASE_URL=postgres://username:password@host:port/database
```

환경 변수 설정을 위의 코드처럼 작성하면 됩니다.

## 스키마

```js
const { pgTable, uuid, timestamp } = require('drizzle-orm/pg-core');

const example = pgTable('example', {
  id: uuid('id').primaryKey().defaultRandom(),
  created: timestamp('created', { withTimezone: true }).notNull().defaultNow(),
});

module.exports = { example };
```

<a style="color: gray;" href="/src/database/schema/example.js">/src/database/schema/example.js</a>

|  Field  |   Type   |  Null   |   Key   |        Default         |
| :-----: | :------: | :-----: | :-----: | :--------------------: |
|   id    | `string` | `false` | Primary |       랜덤 UUID        |
| created |  `Date`  | `false` |         | 데이터베이스 생성 시간 |

> [!NOTE]
> 위 코드는 스키마 코드의 예시이며, 위 테이블은 example 스키마의 구조입니다.<br>
> 더 많은 스키마 타입은 [문서](https://orm.drizzle.team/docs/column-types/pg)를 참고해주세요.

## 서비스

```js
const { and, asc, between, desc, eq } = require('drizzle-orm');
const { db } = require('..');
const {
  CreateExampleDto,
  defaultFindOption,
  FindExampleDto,
  UpdateExampleDto,
} = require('../types');
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
```

<a style="color: gray;" href="/src/database/service/example.js">/src/database/service/example.js</a>

> [!NOTE]
> 위의 코드는 example 스키마의 서비스 예시입니다.<br>
> 원하는 대로 데이터베이스에 관함 함수들을 추가하거나 제거하셔도 됩니다.

## 로컬 저장 방법

### 패키지 변경

로컬에 데이터베이스 저장을 위하여 [PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql) 대신 [SQLite](https://orm.drizzle.team/docs/get-started-sqlite) 패키지를 사용해야 합니다.

```bash
npm remove pg @types/pg
```

이 명령어를 사용하여 [PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql) 패키지를 제거한 후,

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

이 명령어를 사용하여 [SQLite](https://orm.drizzle.team/docs/get-started-sqlite) 패키지를 설치하면 됩니다.

### 마이그레이션 폴더 제거

새로운 스키마를 적용하기 위해 전에 사용하던 `./src/database/migration` 폴더를 지워주세요.

### 설정 코드 수정

```diff
require('dotenv/config');
const { defineConfig } = require('drizzle-kit');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing');

module.exports = defineConfig({
-   dialect: 'postgresql',
+   dialect: 'sqlite',
  schema: './src/database/schema/**/*.{js,ts}',
  out: './src/database/migration',
  dbCredentials: { url: process.env.DATABASE_URL },
});
```

<a style="color: gray;" href="/drizzle.config.js">/drizzle.config.js</a>

### 메인 코드 수정

```diff
- const { drizzle } = require('drizzle-orm/node-postgres');
- const { migrate } = require('drizzle-orm/node-postgres/migrator');
+ const { drizzle } = require('drizzle-orm/better-sqlite3');
+ const { migrate } = require('drizzle-orm/better-sqlite3/migrator');
const { Log } = require('../module');
- const { Client } = require('pg');
+ const Database = require('better-sqlite3');
const schema = require('./schema');

- const client = new Client(process.env.DATABASE_URL);
+ const client = new Database(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

const databaseInit = async () => {
  if (process.env.DATABASE_URL) {
-    await client.connect();
    await migrate(db, { migrationsFolder: `./src/database/migration` });
    Log.info('Database Connected');
  }
};

module.exports = { databaseInit, db };
```

<a style="color: gray;" href="/src/database/index.js">/src/database/index.js</a>

### 스키마 코드 수정

```diff
- const { pgTable, uuid, timestamp } = require('drizzle-orm/pg-core');
+ const { sqliteTable, text } = require('drizzle-orm/sqlite-core');

- const example = pgTable('example', {
-   id: uuid('id').primaryKey().defaultRandom(),
-   created: timestamp('created', { withTimezone: true }).notNull().defaultNow(),
+ const example = sqliteTable('example', {
+   id: text('id').$defaultFn(() => crypto.randomUUID()),
+   created: text('created').$type<Date>().$defaultFn(() => new Date()),
});

module.exports = { example };
```

<a style="color: gray;" href="/src/database/schema/example.js">/src/database/schema/example.js</a>

> [!NOTE]
> 더 많은 스키마 타입은 [문서](https://orm.drizzle.team/docs/column-types/sqlite)를 참고해주세요.
