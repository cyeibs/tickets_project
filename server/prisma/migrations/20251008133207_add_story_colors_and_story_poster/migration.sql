-- AlterTable
ALTER TABLE "OrganizationStory" ADD COLUMN     "posterId" TEXT;

-- AlterTable
ALTER TABLE "OrganizerApplication" ADD COLUMN     "organizationId" TEXT;

-- CreateTable
CREATE TABLE "StoryColor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,

    CONSTRAINT "StoryColor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationStory" ADD CONSTRAINT "OrganizationStory_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizerApplication" ADD CONSTRAINT "OrganizerApplication_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
