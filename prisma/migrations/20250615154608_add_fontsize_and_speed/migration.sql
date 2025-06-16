-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnnouncementSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "borderColor" TEXT NOT NULL,
    "borderSize" TEXT NOT NULL,
    "fontSize" TEXT NOT NULL DEFAULT '18px',
    "speed" TEXT NOT NULL DEFAULT '15s'
);
INSERT INTO "new_AnnouncementSettings" ("bgColor", "borderColor", "borderSize", "id", "text", "textColor") SELECT "bgColor", "borderColor", "borderSize", "id", "text", "textColor" FROM "AnnouncementSettings";
DROP TABLE "AnnouncementSettings";
ALTER TABLE "new_AnnouncementSettings" RENAME TO "AnnouncementSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
