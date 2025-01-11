import { useState } from "react";

function BaseLayout({ children }) {
	const [isCollapse, setIsCollapse] = useState(false);

	const handleCollapse = () => {
		setIsCollapse(!isCollapse);
	};

	return (
		<div>
			<div className="top-bar h-[50px] bg-[#ffe9cf] p-2">
				<div className="flex justify-between items-center h-full">
					<div>Managerment Page</div>

					<div className="avatar w-[35px] h-[35px] rounded-[50%] bg-black"></div>
				</div>
			</div>

			<div className="flex">
				<div
					className={`shadow-lg h-[100vh] ${
						isCollapse ? "w-[250px]" : "w-[60px]"
					} p-2 transition-all`}>
					<div>
						<p className={`${isCollapse ? "text-right" : "text-center"}`}>
							{isCollapse ? (
								<button onClick={handleCollapse}>
									<svg
										width="40px"
										height="40px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M5 8H13.75M5 12H19M10.25 16L19 16"
											stroke="#464455"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							) : (
								<button onClick={handleCollapse}>
									<svg
										fill="#000000"
										width="15px"
										height="40px"
										viewBox="0 0 32 32"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"></path>
									</svg>
								</button>
							)}
						</p>

						<div className="divider w-full h-[1px] bg-[#eee]"></div>
					</div>

					<div className="mt-3">
						{isCollapse ? (
							<ul>
								<li className="">Quản lý đơn hàng</li>
								<li>Thống kê</li>
							</ul>
						) : (
							<div className="flex items-center flex-col gap-[15px]">
								<button>
									<svg
										width="25px"
										height="25px"
										viewBox="0 0 1024 1024"
										fill="#000000"
										class="icon"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M300 462.4h424.8v48H300v-48zM300 673.6H560v48H300v-48z"
											fill=""
										/>
										<path
											d="M818.4 981.6H205.6c-12.8 0-24.8-2.4-36.8-7.2-11.2-4.8-21.6-11.2-29.6-20-8.8-8.8-15.2-18.4-20-29.6-4.8-12-7.2-24-7.2-36.8V250.4c0-12.8 2.4-24.8 7.2-36.8 4.8-11.2 11.2-21.6 20-29.6 8.8-8.8 18.4-15.2 29.6-20 12-4.8 24-7.2 36.8-7.2h92.8v47.2H205.6c-25.6 0-47.2 20.8-47.2 47.2v637.6c0 25.6 20.8 47.2 47.2 47.2h612c25.6 0 47.2-20.8 47.2-47.2V250.4c0-25.6-20.8-47.2-47.2-47.2H725.6v-47.2h92.8c12.8 0 24.8 2.4 36.8 7.2 11.2 4.8 21.6 11.2 29.6 20 8.8 8.8 15.2 18.4 20 29.6 4.8 12 7.2 24 7.2 36.8v637.6c0 12.8-2.4 24.8-7.2 36.8-4.8 11.2-11.2 21.6-20 29.6-8.8 8.8-18.4 15.2-29.6 20-12 5.6-24 8-36.8 8z"
											fill=""
										/>
										<path
											d="M747.2 297.6H276.8V144c0-32.8 26.4-59.2 59.2-59.2h60.8c21.6-43.2 66.4-71.2 116-71.2 49.6 0 94.4 28 116 71.2h60.8c32.8 0 59.2 26.4 59.2 59.2l-1.6 153.6z m-423.2-47.2h376.8V144c0-6.4-5.6-12-12-12H595.2l-5.6-16c-11.2-32.8-42.4-55.2-77.6-55.2-35.2 0-66.4 22.4-77.6 55.2l-5.6 16H335.2c-6.4 0-12 5.6-12 12v106.4z"
											fill=""
										/>
									</svg>
								</button>

								<button>
									<svg
										fill="#000000"
										version="1.1"
										id="Capa_1"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
										width="35px"
										height="35px"
										viewBox="0 0 485.945 485.945"
										xml:space="preserve">
										<g>
											<path
												d="M477.705,380.304H428.01v-98.658c0-4.555-3.689-8.239-8.24-8.239h-51.785c-4.551,0-8.24,3.687-8.24,8.239v98.658h-30.512
		V115.957c0-4.547-3.689-8.24-8.238-8.24h-51.787c-4.551,0-8.24,3.693-8.24,8.24v264.347h-30.511V220.48
		c0-4.546-3.689-8.239-8.24-8.239h-51.787c-4.551,0-8.24,3.693-8.24,8.239v159.824h-30.51V156.047c0-4.546-3.689-8.24-8.24-8.24
		H71.652c-4.551,0-8.24,3.694-8.24,8.24v224.256H16.48V97.401c0-4.547-3.689-8.24-8.24-8.24c-4.55,0-8.24,3.693-8.24,8.24v291.143
		c0,4.547,3.69,8.24,8.24,8.24h63.411h51.787h46.991h51.787h46.991h51.787h46.99h51.787h57.936c4.551,0,8.238-3.693,8.238-8.24
		C485.945,383.989,482.256,380.304,477.705,380.304z M79.89,380.304V164.287h35.307v216.017H79.89z M178.668,380.304V228.72h35.306
		v151.583H178.668z M277.445,380.304V124.198h35.309v256.105H277.445z M376.225,380.304v-90.418h35.305v90.418H376.225z"
											/>
										</g>
									</svg>
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="p-2 flex-1 bg-[##fafafa]">
					<div>{children}</div>
				</div>
			</div>
		</div>
	);
}

export default BaseLayout;
