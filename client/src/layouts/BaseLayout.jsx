function BaseLayout({ children }) {
	return (
		<div>
			<div className="top-bar h-[50px] bg-[#ffe9cf] p-2">
				<div className="flex justify-between items-center h-full">
					<div>
						<button>collapse</button>
					</div>

					<div className="avatar w-[35px] h-[35px] rounded-[50%] bg-black"></div>
				</div>
			</div>

			<div className="p-2">{children}</div>
		</div>
	);
}

export default BaseLayout;
