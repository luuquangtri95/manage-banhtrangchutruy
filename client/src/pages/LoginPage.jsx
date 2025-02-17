import { useContext, useState } from "react";
import Logo from "../assets/logo_chutruy_food.jpeg";
import FormField from "../components/FormField";
import { AuthContext } from "../context/AuthContext";

const INIT_LOGIN_INFO = {
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
};

const INIT_REGISTER_INFO = {
	...INIT_LOGIN_INFO,
	confirmPassword: {
		value: "",
		error: "",
		validate: (value, allValues) => {
			if (!value.trim()) return "Confirm Password is required.";
			if (value !== allValues.password.value) {
				return "Passwords do not match.";
			}
			return "";
		},
	},
	username: {
		value: "",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Full name is required.";
			return "";
		},
	},
	phone: {
		value: "",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Số điện thoại là bắt buộc.";
			if (!/^\d{9,11}$/.test(value)) {
				return "Số điện thoại không hợp lệ (chỉ chứa 9-11 chữ số).";
			}
			return "";
		},
	},
};

function LoginPage() {
	const { onLogin, onRegister } = useContext(AuthContext);

	const [isLogin, setIsLogin] = useState(true);

	const [userInfo, setUserInfo] = useState(isLogin ? INIT_LOGIN_INFO : INIT_REGISTER_INFO);

	const handleToggleMode = () => {
		setIsLogin(!isLogin);
		setUserInfo(isLogin ? INIT_REGISTER_INFO : INIT_LOGIN_INFO);
	};

	const validateAllFields = (fields) => {
		let hasError = false;
		const newFields = { ...fields };

		for (const key in newFields) {
			const field = newFields[key];
			// Nếu hàm validate có dạng (value, allValues) => ta truyền allValues vào
			const error = field.validate ? field.validate(field.value, newFields) : "";
			newFields[key].error = error;
			if (error) {
				hasError = true;
			}
		}
		return { newFields, hasError };
	};

	// Submit form
	const handleSubmit = (e) => {
		e.preventDefault();

		// Validate
		const { newFields, hasError } = validateAllFields(userInfo);
		setUserInfo(newFields);

		if (hasError) return;

		// Lấy dữ liệu gửi đi
		const submittedData = Object.keys(newFields).reduce((acc, key) => {
			acc[key] = newFields[key].value;
			return acc;
		}, {});

		if (!isLogin) {
			delete submittedData.confirmPassword;
		}

		// Tuỳ theo chế độ mà gọi onLogin hay onRegister
		if (isLogin) {
			onLogin(submittedData);
		} else {
			onRegister(submittedData);
		}
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
			{/* Cột chứa logo */}
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
			{/* Cột chứa form */}
			<div className="flex-1">
				<div className="h-[100%] lg:h-[100vh] lg:relative">
					<div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-full p-4 mt-4 xs:w-[300px] sm:w-[450px] sm:mt-4 md:w-[450px] ">
						\dsadsakljdjsakldsaljkdasljk
						<div>
							<h3 className="text-[14px] font-bold text-center lg:text-[24px] lg:text-left">
								<span className="bg-gradient-to-b from-orange-300 to-slate-500 bg-clip-text text-transparent">
									Chào mừng bạn đến với Chú Truý Food!
								</span>
							</h3>
							<p className="text-[11px] lg:text-[14px] text-center lg:text-left">
								"Chú Truý Food ngoài bánh tráng còn rất nhiều mặt hàng giá sỉ chất
								lượng cao - mục tiêu xây dựng sản phẩm ngon chất lượng với giá tốt
								nhất dành cho đối tác"
							</p>
							<br />
						</div>
						<div>
							<form onSubmit={handleSubmit}>
								{/* Email */}
								<FormField
									label="Email (*)"
									name="email"
									type="email"
									value={userInfo.email.value}
									onChange={(e) => handleChange("email", e)}
									error={userInfo.email.error}
								/>

								{/* Mật khẩu */}
								<FormField
									label="Mật khẩu (*)"
									name="password"
									type="password"
									value={userInfo.password.value}
									onChange={(e) => handleChange("password", e)}
									error={userInfo.password.error}
								/>

								{/* Nếu là chế độ đăng ký => Hiển thị thêm confirmPassword, fullName, phoneNumber */}
								{!isLogin && (
									<>
										<FormField
											label="Xác nhận mật khẩu (*)"
											name="confirmPassword"
											type="password"
											value={userInfo.confirmPassword.value}
											onChange={(e) => handleChange("confirmPassword", e)}
											error={userInfo.confirmPassword.error}
										/>

										<FormField
											label="Họ và tên (*)"
											name="username"
											type="text"
											value={userInfo.username.value}
											onChange={(e) => handleChange("username", e)}
											error={userInfo.username.error}
										/>

										<FormField
											label="Số điện thoại (*)"
											name="phone"
											type="text"
											value={userInfo.phone.value}
											onChange={(e) => handleChange("phone", e)}
											error={userInfo.phone.error}
										/>
									</>
								)}

								<div className="flex gap-2 mt-3">
									<button
										type="submit"
										className="bg-gradient-to-r from-slate-900 to-slate-700 text-white text-[14px] p-[8px] rounded-md flex justify-center w-full">
										{isLogin ? "Đăng nhập" : "Đăng ký"}
									</button>

									{/* Nút chuyển chế độ */}
									<button
										type="button"
										onClick={handleToggleMode}
										className="text-[14px] p-[8px] rounded-md flex justify-center w-full">
										{isLogin ? (
											<p>
												Chưa có tài khoản ?{" "}
												<span className="underline "> Đăng ký</span>
											</p>
										) : (
											<p>
												Đã có tài khoản ?{" "}
												<span className="underline"> Đăng Nhập</span>
											</p>
										)}
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
