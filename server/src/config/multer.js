import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/tmp/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

export const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error("Only .jpg, .png files are allowed"), false);
		}
		cb(null, true);
	},
});
