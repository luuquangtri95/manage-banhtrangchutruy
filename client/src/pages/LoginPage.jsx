import { useContext, useState } from "react";
import Logo from "../assets/logo_chutruy_food.jpeg";
import FormField from "../components/FormField";
import { AuthContext } from "../context/AuthContext";

function LoginPage(props) {
	const [userInfo, setUserInfo] = useState({
		email: {
			value: "",
			error: "",
			validate: (value) => {
				if (!value.trim()) return "Email is required.";
				if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format.";
				return "";
			},
		},
		password: {
			value: "",
			error: "",
			validate: (value) => {
				if (!value.trim()) return "Password is required.";
				if (value.length < 4) return "Password must be at least 4 characters.";
				return "";
			},
		},
	});

	const { onLogin } = useContext(AuthContext);

	const handleLogin = (e) => {
		e.preventDefault();
		let hasError = false;

		const newUserInfo = { ...userInfo };
		for (const key in newUserInfo) {
			const field = newUserInfo[key];
			const error = field.validate(field.value);
			if (error) {
				hasError = true;
				newUserInfo[key].error = error;
			}
		}

		setUserInfo(newUserInfo);

		// Nếu có lỗi, không gửi dữ liệu
		if (hasError) return;

		const submittedData = Object.keys(userInfo).reduce((acc, key) => {
			acc[key] = userInfo[key].value;
			return acc;
		}, {});

		onLogin(submittedData);
	};

	const handleChange = (name, event) => {
		const { value } = event.target;

		setUserInfo((prev) => ({
			...prev,
			[name]: { ...prev[name], value, error: "" },
		}));
	};

	return (
		<div className="flex flex-col lg:flex-row xl:flex-row lg:relative">
			<div className="w-full h-[15vh] bg-gradient-to-r from-slate-900 to-slate-700 relative mt-[60px] lg:h-[100vh] lg:w-[50%] lg:mt-0">
				<div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] ">
					<img
						src={Logo}
						alt=""
						className="d-block rounded-[50%]"
						width={200}
					/>
				</div>
			</div>
			<div className="flex-1">
				<div className="h-[100%] lg:h-[100vh] lg:relative">
					<div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-full p-4 mt-4 xs:w-[300px] sm:w-[450px] sm:mt-4 md:w-[450px] ">
						<div>
							<h3 className="text-[14px] font-bold text-center lg:text-[24px] lg:text-left">
								<span className="bg-gradient-to-b from-orange-300 to-slate-500 bg-clip-text text-transparent">
									Chào mừng bạn đến với chú Truý Food !
								</span>
							</h3>
							<p className="text-[11px] lg:text-[14px] text-center lg:text-left">
								"Chất lượng hàng đầu nha mấy shop ơi 🤣 !!! Em nói không với hàng
								kém chất lượng ạ"
							</p>
							<br />
						</div>

						<div>
							<form onSubmit={handleLogin}>
								<div className="form-control">
									<FormField
										label="Email"
										name="email"
										type="email"
										value={userInfo.email.value}
										onChange={(e) => handleChange("email", e)}
										error={userInfo.email.error}
									/>
								</div>

								<div className="form-control">
									<FormField
										label="Mật khẩu"
										name="password"
										type="password"
										value={userInfo.password.value}
										onChange={(e) => handleChange("password", e)}
										error={userInfo.password.error}
									/>
								</div>

								<div className="flex gap-2">
									<button
										onClick={handleLogin}
										className="bg-gradient-to-r from-slate-900 to-slate-700 text-[#ffffff] text-[14px] p-[8px] bg-[#ffe9cf] rounded-md mt-3 flex justify-center w-full ">
										Đăng nhập
									</button>

									<button
										disabled
										className="text-[14px] p-[8px] bg-[#eee] rounded-md mt-3 flex justify-center w-full">
										Đăng ký
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
