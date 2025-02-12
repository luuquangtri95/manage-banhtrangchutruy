import { Queue } from "bullmq";
import redisConnection from "~/config/redis";

const imageUploadedQueue = new Queue("imageUploaded", { connection: redisConnection });

export default imageUploadedQueue;
