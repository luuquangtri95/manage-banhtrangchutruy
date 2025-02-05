const PageLoading = ({ isLoading }) => {
	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="flex flex-col items-center">
				<div className="animate-spin h-16 w-16 border-4 border-teal-500 border-t-transparent rounded-full"></div>
				<p className="text-white mt-4 text-lg font-semibold">Loading...</p>
			</div>
		</div>
	);
};

export default PageLoading;
