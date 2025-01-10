import axios from "axios";
import { toast } from "react-toastify";

let authorizedAxiosInstance = axios.create({
	baseURL: "http://localhost:8017/v1",
});

//#region [Thời gian chờ tối đa của 1 request: 10p]
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;
//#endregion

//#region [withCrendentials : sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi req lên BE (phục vụ trường hợp nếu chúng ta lưu JWT tokens (refresh and access) vào trong httpOnly Cookie của trình duyệt)]
authorizedAxiosInstance.defaults.withCredentials = true;
//#endregion

// - Can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use(
	(config) => {
		// Làm gì đó trước khi request dược gửi đi
		return config;
	},
	(error) => {
		// Làm gì đó với lỗi request
		return Promise.reject(error);
	}
);

// - Can thiệp vào giữa những response API
authorizedAxiosInstance.interceptors.response.use(
	(response) => {
		// Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
		// Làm gì đó với dữ liệu response
		return response;
	},
	(error) => {
		// Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
		// Làm gì đó với lỗi response

		//#region [- xử lý mã GONE để phục vụ việc refresh_token]

		//#endregion

		if (error.response?.status !== 410) {
			toast.error(error.response?.data?.message || error?.message);
		}

		return Promise.reject(error);
	}
);

export default authorizedAxiosInstance;
