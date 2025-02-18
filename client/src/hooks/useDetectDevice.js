import { useEffect, useState } from "react";

function useDetectDevice(props) {
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleWindowSizeChange = () => {
			setWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);

	return width;
}

export default useDetectDevice;
