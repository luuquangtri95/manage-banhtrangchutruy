import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../dashboard/Dashboard";
import UserApi from "../../api/userApi";

function ViewWholesalePriceUser(props) {
	const { userInfo } = useContext(DashboardContext);
	const [prices, setPrices] = useState([]);

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			const _currentUser = userInfo ? userInfo : JSON.parse(localStorage.getItem("userInfo"));

			const res = await UserApi.findById(_currentUser.id);

			console.log("res.metadata", res.metadata);
		} catch (error) {
			console.log("error", error);
		}
	};

	return <div>ViewWholesalePriceUser</div>;
}

export default ViewWholesalePriceUser;
