import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	// Tạo mảng các số trang hiển thị
	const getPaginationNumbers = () => {
		const pages = [];

		if (totalPages <= 3) {
			// Nếu tổng số trang nhỏ hơn hoặc bằng 3, hiển thị toàn bộ
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Nếu tổng số trang lớn hơn 3
			pages.push(1, 2); // Luôn hiển thị 1 và 2

			if (currentPage > 3) {
				// Thêm dấu "..." khi trang hiện tại >= 4
				pages.push("...");
			}

			if (currentPage > 3 && currentPage < totalPages - 1) {
				// Nếu không ở trang đầu hoặc cuối, thêm trang hiện tại
				pages.push(currentPage);
			}

			if (currentPage === totalPages - 1) {
				// Nếu gần trang cuối, hiển thị trang gần cuối
				pages.push(currentPage);
			}

			if (currentPage === totalPages) {
				// Nếu là trang cuối cùng
				pages.push(totalPages - 1);
			}

			if (currentPage < totalPages - 1) {
				// Nếu chưa ở trang cuối, hiển thị "..."
				pages.push("...");
			}

			// Luôn hiển thị trang cuối
			pages.push(totalPages);
		}

		return pages;
	};

	const paginationNumbers = getPaginationNumbers();

	return (
		<div className="flex items-center gap-2">
			{/* Nút "Prev" */}
			<button
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300">
				Prev
			</button>

			{/* Các số trang */}
			{paginationNumbers.map((page, index) => (
				<React.Fragment key={index}>
					{page === "..." ? (
						<span className="px-3">...</span>
					) : (
						<button
							onClick={() => onPageChange(page)}
							className={`px-3 py-1 rounded-md ${
								page === currentPage
									? "bg-blue-500 text-white"
									: "bg-gray-100 hover:bg-gray-200"
							}`}>
							{page}
						</button>
					)}
				</React.Fragment>
			))}

			{/* Nút "Next" */}
			<button
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300">
				Next
			</button>
		</div>
	);
};

export default Pagination;
