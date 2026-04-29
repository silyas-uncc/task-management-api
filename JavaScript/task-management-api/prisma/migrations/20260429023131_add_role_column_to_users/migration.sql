-- Add role column to users table
ALTER TABLE "users" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';