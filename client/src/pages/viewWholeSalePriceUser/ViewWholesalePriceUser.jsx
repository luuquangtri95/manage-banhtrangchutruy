import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../dashboard/Dashboard";
import UserApi from "../../api/userApi";
import { useTranslation } from "react-i18next";

function ViewWholesalePriceUser(props) {
	const { userInfo } = useContext(DashboardContext);
	const [userData, setUserData] = useState({});
	const { t } = useTranslation();

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			const _currentUser = userInfo ? userInfo : JSON.parse(localStorage.getItem("userInfo"));

			const res = await UserApi.findById(_currentUser.id);

			setUserData(res.metadata);
		} catch (error) {
			console.log("error", error);
		}
	};

	const renderPrices = () => {
		return userData?.wholesaleGroups?.map((_wg) => {
			return (
				<tr
					key={_wg.id}
					className="hover:bg-slate-50 border-b border-slate-200">
					<td className="p-4 py-5 font-semibold text-sm text-slate-800">{_wg.name}</td>
					<td className="p-4 py-5 font-semibold text-sm text-slate-800">
						<ul>
							{_wg.wholesalePrices.map((_wp) => {
								return _wp.products.map((_p) => {
									return <li key={_p.id}>{_p.name}</li>;
								});
							})}
						</ul>
					</td>
					<td className="p-4 py-5 font-semibold text-sm text-slate-800">
						<ul>
							{_wg.wholesalePrices.map((_wp) => {
								return <li key={_wp.id}>{_wp.name}</li>;
							})}
						</ul>
					</td>
				</tr>
			);
		});
	};

	return (
		<div>
			{userData?.wholesaleGroups?.map((_wg) =>
				_wg.wholesalePrices.map((_wp) => {
					return (
						<div
							key={_wg.id}
							className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg mb-3">
							<table className="w-full table-fixed text-left">
								<thead>
									<tr>
										{["group name", "wholesale price", "product"].map(
											(header, idx) => (
												<th
													key={idx}
													className="p-4 border-b border-slate-200 bg-main"
													style={{ width: `${100 / 6}%` }}>
													<p className="text-sm font-normal leading-none">
														{t(header)}
													</p>
												</th>
											)
										)}
									</tr>
								</thead>
								<tbody>{renderPrices(_wp)}</tbody>
							</table>
						</div>
					);
				})
			)}
		</div>
	);
}

export default ViewWholesalePriceUser;
