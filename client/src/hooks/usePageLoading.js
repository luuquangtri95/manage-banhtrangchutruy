import { useState } from "react";

const usePageLoading = () => {
	const [isLoading, setIsLoading] = useState(false);

	const showLoading = () => setIsLoading(true);
	const hideLoading = () => setIsLoading(false);

	return { isLoading, showLoading, hideLoading };
};

export default usePageLoading;
