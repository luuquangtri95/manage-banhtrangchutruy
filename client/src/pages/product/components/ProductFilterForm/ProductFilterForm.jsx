import { useRef, useState } from "react";
import FormField from "../../../../components/FormField";

function ProductFilterForm({ onSubmit }) {
	const [searchTerm, setSearchTerm] = useState("");

	const typingTimoutRef = useRef(null);

	const handleSearchTermChange = (e) => {
		const { value } = e.target;
		setSearchTerm(value);

		if (!onSubmit) return;

		if (typingTimoutRef.current) {
			clearTimeout(typingTimoutRef.current);
		}

		typingTimoutRef.current = setTimeout(() => {
			const formValues = {
				searchTerm: value,
			};

			onSubmit(formValues);
		}, 500);
	};

	return (
		<FormField
			value={searchTerm}
			placeholder="Tim kiếm sản phẩm"
			onChange={handleSearchTermChange}
		/>
	);
}

export default ProductFilterForm;
