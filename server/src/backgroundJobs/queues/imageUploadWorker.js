import { Worker } from "bullmq";
import imageUploadedQueue from "./imageUploadQueue";

const imageUploadWorker = new Worker(imageUploadedQueue, async () => {
	// Optionally report some progress
	await job.updateProgress(42);

	// Optionally sending an object as progress
	await job.updateProgress({ foo: "bar" });

	// Do something with job
	return "some value";
});

imageUploadWorker.on("completed", (job, returnvalue) => {
	// Do something with the return value.
});

export default imageUploadWorker;
