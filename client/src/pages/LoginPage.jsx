import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function LoginPage(props) {
	const [userInfo, setUserInfo] = useState({
		email: "",
		password: "",
	});

	const { onLogin } = useContext(AuthContext);

	const handleLogin = () => {
		onLogin(userInfo);
	};

	const handleChange = (name, event) => {
		setUserInfo((prev) => ({
			...prev,
			[name]: event.target.value,
		}));
	};

	return (
		<div className="flex">
			<div className="w-[50%] h-[100vh] bg-[#ffe9cf] relative">
				<div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] ">
					<img
						src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/466734656_122102191430609836_1008743901343252919_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1HuZg_oM8nsQ7kNvgF3pxt_&_nc_oc=AdgAVlGCtSqMfpmaFhgC-dS6X0_26o0EEPpgc0Rr0p67u5hMOkTRU0PHQPliBVlHCIjVKpE4AtcT0jHWIpbUIKFw&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AmpcR1u8352sKxQvk669TDo&oh=00_AYD3n_K5qnIbO5FHltIWCHdKKmt6eJaZZjk3zUTpbthf5w&oe=6787160C"
						alt=""
						className="d-block rounded-[50%]"
						width={200}
					/>
				</div>
			</div>
			<div className="flex-1">
				<div className="relative  h-[100vh]">
					<div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[450px]">
						<div>
							<h3 className="text-[24px] font-bold">
								Chào mừng bạn đến với bánh tráng chú Truý !
							</h3>
							<p className="text-xs">
								"Đăng nhập vào đi nè, chúng mình cùng nhau bán hàng cùng nhau phát
								triển bạn nhé, nếu chưa có tài khoản tạo ngay bên dưới nhé bạn yêu
								😉"
							</p>
							<br />
						</div>

						<div>
							<div className="form-control">
								<label
									htmlFor=""
									className="text-[14px]">
									Email:
								</label>
								<br />
								<input
									className="form-field border w-full rounded-md p-2"
									type="email"
									value={userInfo.email}
									onChange={(e) => handleChange("email", e)}
								/>
							</div>

							<div className="form-control">
								<label
									htmlFor=""
									className="text-[14px]">
									Mật khẩu:
								</label>
								<br />
								<input
									className="form-field border w-full rounded-md p-2"
									type="password"
									value={userInfo.password}
									onChange={(e) => handleChange("password", e)}
								/>
							</div>

							<div className="flex gap-2">
								<button
									onClick={handleLogin}
									className="p-2 bg-[#ffe9cf] rounded-md mt-3 flex justify-center w-full">
									Đăng nhập
								</button>

								<button
									disabled
									className="p-2 bg-[#eee] rounded-md mt-3 flex justify-center w-full">
									Đăng ký
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
