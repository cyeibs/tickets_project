### Инструкция для Backend проекта Lupapp

Ниже — краткая, но исчерпывающая спецификация бэкенда, чтобы LLM быстро поняла проект, архитектуру, модели данных, API и правила разработки. Используй это как системный контекст при генерации кода/изменений.

### Общее описание

- Назначение: бэкенд для Telegram Mini App (продажа билетов, создание событий).
- Роли пользователей: обычный пользователь и организатор.
- Аутентификация: JWT (Bearer-токен).
- Хранение файлов: локально в `uploads/`, раздача по `/uploads/*`.
- База данных: PostgreSQL (ORM: Prisma).
- Сервер: Fastify v5 + плагины (`@fastify/jwt`, `@fastify/helmet`, `@fastify/cors`, `@fastify/multipart`, `@fastify/static`).
- Язык: TypeScript.

### Технологический стек

- **Runtime**: Node.js + TypeScript
- **Web framework**: Fastify v5
- **ORM**: Prisma v6 (PostgreSQL)
- **Валидация**: Zod
- **Логи**: Pino (через Fastify)
- **Сидирование**: Prisma `prisma/seed.ts`
- **Докер**: `server/docker-compose.yml` (Postgres)

### Структура проекта (backend)

- `server/`
  - `src/`
    - `app.ts` — сборка Fastify-приложения, плагины, статика, маршруты.
    - `index.ts` — точка входа; создание директорий, запуск сервера.
    - `routes.ts` — регистрация всех модульных маршрутов.
    - `config/env.ts` — загрузка `.env`, конфигурация.
    - `plugins/`
      - `prisma.ts` — интеграция Prisma-клиента с Fastify.
      - `auth.ts` — регистрация `@fastify/jwt`, `authenticate`-guard.
    - `modules/` — маршруты по доменам:
      - `auth/` — регистрация, логин, текущий пользователь.
      - `users/` — профили пользователей.
      - `organizations/` — организации (CRUD).
      - `events/` — события (CRUD, фильтры).
      - `dictionaries/` — справочники (категории, города, цвета, статусы, роли).
      - `reviews/` — отзывы к событиям (0–5).
      - `support/` — обращения в поддержку.
      - `purchases/` — покупки (создание/листинг).
      - `uploads/` — загрузка файлов, возврат `mediaId` и URL.
    - `types/fastify.d.ts` — расширения типов Fastify (prisma, jwt).
  - `prisma/`
    - `schema.prisma` — схема БД.
    - `seed.ts` — сиды.
  - `uploads/` — папка для загруженных файлов (создаётся автоматически).
  - `ENV_EXAMPLE` — шаблон `.env`.
  - `docker-compose.yml` — Postgres.
  - `package.json`, `tsconfig.json`, `README.md`

### Переменные окружения

- **Обязательные**
  - `DATABASE_URL` — строка подключения Postgres (пример в `ENV_EXAMPLE`).
  - `JWT_SECRET` — секрет для подписи JWT.
- **Опциональные**
  - `PORT` (по умолчанию 4001), `HOST` (по умолчанию `0.0.0.0`)
  - `JWT_EXPIRES_IN` (по умолчанию `7d`)
  - `UPLOAD_DIR` (по умолчанию `uploads`)
  - `MAX_FILE_SIZE_MB` (по умолчанию 10)

### Модели данных (связи и поля)

- **Role**: `id`, `code` (unique), `name`, `users[]`.
  - Значения: `user`, `organizer` (создаются в сидере).
- **Media**: `id`, `fileName`, `mimeType`, `size`, `storagePath`.
  - Связан с аватаром пользователя/организации, постером события.
- **Organization**: `id`, `name`, `description?`, `telephone?`, `socialUrl?`, `inn?`, `ogrn?`, `kpp?`, `licence?`, `avatarId?`.
  - Связи: `users[]`, `events[]`.
- **User**: `id`, `firstName`, `lastName`, `middleName?`, `telephone` (unique), `password`, `avatarId?`, `roleId`, `organizationId?`.
  - Связи: `role`, `organization?`, `purchases[]`, `reviews[]`, `supportRequests[]`.
- **EventCategory**: `id`, `name`, `slug?`, `events[]`.
- **City**: `id`, `name`, `slug?`, `events[]`.
- **EventColor**: `id`, `name`, `color`, `textColor`, `events[]`.
- **Event**: `id`, `organizationId`, `posterId?`, `name`, `description? (text)`, `categoryId`, `cityId`, `eventDate (Date)`, `startTime (string)`, `location (string)`, `maxQuantity (int)`, `price (Decimal 10,2)`, `colorId`.
  - Связи: `reviews[]`, `purchases[]`.
- **Review**: `id`, `eventId`, `authorId`, `text`, `rating (0..5)`, уникальный индекс `(eventId, authorId)`.
- **PurchaseStatus**: `id`, `code (unique)`, `name`, `purchases[]` (сидируются: `created`, `paid`, `canceled`, `refunded`).
- **Purchase**: `id`, `eventId`, `userId`, `firstName`, `lastName`, `price (Decimal 10,2)`, `serviceTax (Decimal 10,2)`, `statusId`.
- **SupportRequest**: `id`, `userId`, `subject`, `description`, `createdAt`.

### Принципы API

- REST без версии (пока). Возможен перенос под `/api/v1`.
- Ответы — JSON. Ошибки — c HTTP-статусами 4xx/5xx и объектом `{ error: string }` или zod-ошибкой.
- Валидация входных данных: Zod.
- Защита маршрутов: `preHandler: [app.authenticate]` (JWT).
- CORS: `origin: true`, `credentials: true`.
- Безопасность: `@fastify/helmet`.

### Аутентификация

- Регистрация: телефон + пароль; по умолчанию роль `user`.
- Логин: телефон + пароль, выдача JWT.
- Передача токена: заголовок `Authorization: Bearer <token>`.
- Доступ к защищённым маршрутам — только при валидном токене.
- Ролевая модель базовая (пока без комплексных RBAC-гардов на маршрутах).

### Загрузка файлов

- Маршрут: `POST /uploads` (multipart/form-data), требует JWT.
- Возврат: `{ id: mediaId, url: "/uploads/<fileName>" }`.
- Файлы сохраняются в `UPLOAD_DIR` (по умолчанию `uploads/`) и раздаются по `/uploads/*`.

### Справочники (для фильтров и UI)

- `GET /dictionaries/categories`
- `GET /dictionaries/cities`
- `GET /dictionaries/colors`
- `GET /dictionaries/purchase-statuses`
- `GET /dictionaries/roles`

### Обзор эндпоинтов (основные)

- **Health**
  - `GET /health` → `{ status: "ok" }`
- **Auth**
  - `POST /auth/register` body: `{ firstName, lastName, middleName?, telephone, password }` → `{ token }`
  - `POST /auth/login` body: `{ telephone, password }` → `{ token }`
  - `GET /auth/me` (JWT) → `{ user }`
- **Users**
  - `GET /users/:id` → `{ user }`
  - `PATCH /users/me` (JWT) body: частичное обновление профиля → `{ id }`
- **Organizations**
  - `POST /organizations` (JWT) → `{ id }`
  - `GET /organizations/:id` → `{ org }`
  - `PATCH /organizations/:id` (JWT) → `{ id }`
- **Events**
  - `POST /events` (JWT) → `{ id }`
  - `GET /events?cityId&categoryId&organizationId&dateFrom&dateTo` → `{ items }`
  - `GET /events/:id` → `{ event }`
  - `PATCH /events/:id` (JWT) → `{ id }`
- **Reviews**
  - `POST /reviews` (JWT) body: `{ eventId, text, rating(0..5) }` → `{ id }` (upsert по `(eventId, authorId)`)
  - `GET /events/:id/reviews` → `{ items }`
- **Support**
  - `POST /support` (JWT) body: `{ subject, description }` → `{ id }`
  - `GET /support` (JWT) → `{ items }`
- **Purchases**
  - `POST /purchases` (JWT) body: `{ eventId, firstName, lastName, price, serviceTax, statusCode }` → `{ id }`
  - `GET /purchases?eventId&statusCode` (JWT) → `{ items }`
- **Uploads**
  - `POST /uploads` (JWT, multipart) → `{ id, url }`

### Примеры запросов

- Логин:

```bash
curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "telephone": "+70000000001", "password": "password" }'
```

- Список событий:

```bash
curl "http://localhost:4001/events?cityId=<uuid>&categoryId=<uuid>"
```

- Создать отзыв (JWT):

```bash
curl -X POST http://localhost:4001/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "eventId": "<uuid>", "text": "Отлично!", "rating": 5 }'
```

### Локальная разработка

- Копировать env: `cp server/ENV_EXAMPLE server/.env`
- Запустить БД: `docker compose -f server/docker-compose.yml up -d`
- Установка: `cd server && yarn`
- Миграции: `yarn prisma:migrate`
- Сиды: `yarn db:seed`
- Дев-сервер: `yarn dev` → `http://localhost:4001/health`

### Команды

- `yarn dev` — запуск сервера разработки (HMR)
- `yarn prisma:migrate` — миграции в dev
- `yarn prisma:deploy` — миграции в prod
- `yarn db:seed` — сидирование
- `yarn db:reset` — сброс и повторное сидирование (non-interactive)
- `yarn start` — запуск собранного `dist/`

### Правила изменения/расширения функционала

- **Новые модели**:
  - Обнови `prisma/schema.prisma` → `yarn prisma:migrate`.
  - Добавь сиды в `prisma/seed.ts` (по необходимости).
- **Новые эндпоинты**:
  - Создай модуль в `src/modules/<domain>/routes.ts`, добавь в `src/routes.ts`.
  - Валидация через Zod. Для защищённых — `preHandler: [app.authenticate]`.
  - Используй Prisma-клиент из `fastify.prisma`.
- **Файлы**:
  - Для загрузок — `POST /uploads`. Храни только метаданные в БД (`Media`), файл — в `UPLOAD_DIR`.
- **Ошибки**:
  - Возвращай понятные статусы (400/401/403/404/409/422/500) и `{ error: string }`.
  - Не проглатывай исключения; логируй через Fastify logger.
- **Кодстайл**:
  - TypeScript strict, явные типы в публичных API, осмысленные имена.
  - Ранние возвраты, минимум глубокой вложенности.
  - Комментарии только к нетривиальной логике.

### Нефункциональные аспекты и замечания

- **Безопасность**: `@fastify/helmet`, JWT, ограничения на размер файлов (`MAX_FILE_SIZE_MB`).
- **CORS**: включён для интеграции с клиентом (Telegram WebApp).
- **Числа/денежные суммы**: `Decimal(10,2)` в БД; при работе в JS учитывай точность.
- **Временные зоны**: `eventDate` — `Date`, `startTime` — строка; привязка TZ решается на уровне клиента/отображения.
- **Производительность**: индексы Prisma генерируются из схемы; при добавлении фильтраций — добавляй индексы.

### Что уже предзаполнено сидером (упрощение тестирования)

- Роли: `user`, `organizer`
- Статусы покупки: `created`, `paid`, `canceled`, `refunded`
- Категории: Music, Sport
- Города: Moscow, Saint Petersburg
- Цвета: Red, Blue
- Организация: `Demo Org`
- Пользователи: `Alice` (user), `Bob` (organizer), пароль `password`
- Событие: `Demo Concert`
- Отзыв: от Alice на Demo Concert (5)
- Покупка: Alice → Demo Concert (paid)

### Дальнейшие улучшения (опционально)

- **RBAC-гварды** по ролям (организатор vs пользователь).
- **Пагинация**: `limit`, `offset`, сортировки для списков.
- **Документация OpenAPI**: `@fastify/swagger`.
- **S3-совместимое хранилище** для файлов (MinIO/AWS S3).
- **Метрики/трейсинг**: Prometheus/Otel.

Если LLM вносит изменения — пусть:

- сохраняет текущую структуру директорий и файлов,
- использует Zod для валидации,
- использует Prisma для БД,
- для защищённых маршрутов добавляет `preHandler: [app.authenticate]`,
- не меняет формат ответов и соглашения без необходимости.
