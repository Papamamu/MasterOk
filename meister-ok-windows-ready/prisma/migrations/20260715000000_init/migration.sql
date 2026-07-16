CREATE TABLE "Admin" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

CREATE TABLE "Product" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "oldPrice" INTEGER,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  "condition" TEXT NOT NULL DEFAULT 'NEW',
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER,
  "frameSize" TEXT,
  "wheelSize" TEXT,
  "color" TEXT,
  "specs" TEXT,
  "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "images" TEXT NOT NULL DEFAULT '[]',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

CREATE TABLE "Request" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "number" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "bike" TEXT,
  "bikeType" TEXT NOT NULL,
  "issue" TEXT NOT NULL,
  "preferredDate" TEXT,
  "contactMethod" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "internalNote" TEXT,
  "estimatedPrice" TEXT,
  "proposedVisit" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Request_number_key" ON "Request"("number");
CREATE UNIQUE INDEX "Request_token_key" ON "Request"("token");

CREATE TABLE "Message" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "requestId" INTEGER NOT NULL,
  "author" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "image" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SiteSettings" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
  "phone" TEXT NOT NULL DEFAULT '+49 000 0000000',
  "whatsapp" TEXT NOT NULL DEFAULT '490000000000',
  "email" TEXT NOT NULL DEFAULT 'info@meister-ok.de',
  "address" TEXT NOT NULL DEFAULT 'Адрес будет добавлен позже',
  "hours" TEXT NOT NULL DEFAULT 'Пн–Пт 09:00–18:00 · Сб 10:00–15:00',
  "heroText" TEXT NOT NULL DEFAULT 'Мы готовим велосипеды для города, спорта и приключений. Каталог скоро появится, а записаться на ремонт можно уже сейчас.',
  "comingSoon" BOOLEAN NOT NULL DEFAULT true
);
