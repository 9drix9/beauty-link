-- Search Analytics
CREATE TABLE IF NOT EXISTS "search_queries" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "category" TEXT,
    "zone" TEXT,
    "user_id" TEXT,
    "result_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_queries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "search_queries_query_idx" ON "search_queries"("query");
CREATE INDEX "search_queries_created_at_idx" ON "search_queries"("created_at");

-- Professional Profile: Application data fields
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_city" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_state" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_service_radius" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_pricing_range" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_availability_type" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_current_platform" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_client_volume" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_is_student" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_school" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "application_website_url" TEXT;

-- Professional Profile: Neighborhood and address privacy
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "neighborhood" TEXT;
ALTER TABLE "professional_profiles" ADD COLUMN IF NOT EXISTS "hide_address_until_booked" BOOLEAN NOT NULL DEFAULT true;
