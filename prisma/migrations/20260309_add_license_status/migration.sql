-- CreateEnum
CREATE TYPE "license_status" AS ENUM ('LICENSE_VERIFIED', 'LICENSE_DECLARED', 'NOT_PROVIDED');

-- AlterTable: add new columns
ALTER TABLE "professional_profiles"
  ADD COLUMN "license_status" "license_status" NOT NULL DEFAULT 'NOT_PROVIDED',
  ADD COLUMN "license_expiration" TIMESTAMP(3),
  ADD COLUMN "license_verified_at" TIMESTAMP(3),
  ADD COLUMN "license_verified_by" TEXT;

-- Migrate existing data: if licenseType+licenseNumber exist, mark as LICENSE_DECLARED
UPDATE "professional_profiles"
  SET "license_status" = 'LICENSE_DECLARED'
  WHERE "license_type" IS NOT NULL AND "license_number" IS NOT NULL;

-- Migrate licenseExpiry -> licenseExpiration for existing rows
UPDATE "professional_profiles"
  SET "license_expiration" = "license_expiry"
  WHERE "license_expiry" IS NOT NULL;

-- Drop old column after data migrated
ALTER TABLE "professional_profiles" DROP COLUMN IF EXISTS "license_expiry";

-- Change license_type from enum to text (drop the enum constraint)
ALTER TABLE "professional_profiles"
  ALTER COLUMN "license_type" TYPE TEXT;

-- CreateIndex
CREATE INDEX "professional_profiles_license_status_idx" ON "professional_profiles"("license_status");
