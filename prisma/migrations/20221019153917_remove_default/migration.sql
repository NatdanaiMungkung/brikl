-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "Task_order_seq";
