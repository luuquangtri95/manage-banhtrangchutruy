export const formatDateWithIntl = (isoString) => {
	const date = new Date(isoString);
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	};

	return new Intl.DateTimeFormat("en-GB", options).format(date); // "en-GB" hiển thị theo định dạng dd/MM/yyyy
};
