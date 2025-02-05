function AnalyticPage() {
	return (
		<div className=" bg-gradient-to-br from-white to-slate-100">
			<div className="flex flex-col justify-center max-w-6xl mx-auto p-5">
				<h1 className="mb-3 font-bold [font-size:_clamp(2rem,_8vw,_4rem)]">
					<svg
						className="block w-[clamp(2.5rem,_8vw,_6rem)] h-auto text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="currentColor"
						viewBox="0 0 256 256">
						<path d="M232,96a72,72,0,0,1-100.94,66L79,222.22c-.12.14-.26.29-.39.42a32,32,0,0,1-45.26-45.26c.14-.13.28-.27.43-.39L94,124.94a72.07,72.07,0,0,1,83.54-98.78,8,8,0,0,1,3.93,13.19L144,80l5.66,26.35L176,112l40.65-37.52a8,8,0,0,1,13.19,3.93A72.6,72.6,0,0,1,232,96Z"></path>
					</svg>
					Under Maintenance
				</h1>

				<hr className="mb-5 w-36 h-1 bg-teal border-0" />

				<p className="mb-5 text-xl sm:text-3xl">
					We are undergoing scheduled maintenance and upgrades.
				</p>
				<p className="mb-5 text-sm sm:text-base">
					We apologize for any inconvenience caused. Please retry shortly.
				</p>
				<p className="mb-5 text-sm sm:text-base">
					<strong>Expected duration:</strong>
					<br />
					Saturday, June 1, 7pm&ndash;8pm (Eastern Time)
				</p>
			</div>
		</div>
	);
}

export default AnalyticPage;
