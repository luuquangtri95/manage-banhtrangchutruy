import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../dashboard/Dashboard";
import UserApi from "../../api/userApi";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../helpers/formatPrice";

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

	const renderWholesalePrice = () => {
		let flatData = userData?.wholesaleGroups?.flatMap((group) =>
			group.wholesalePrices.map((price) => ({
				id: price.id,
				name: price.name,
				price: price.price,
				min_quantity: price.min_quantity,
				products: price.products,
				groupId: group.id,
				groupName: group.name,
			}))
		);

		return flatData?.map((_item) => {
			return _item.products.map((__item) => {
				return (
					<tr
						key={__item.id}
						className="hover:bg-slate-50 border-b border-slate-200">
						<td className="p-4 py-5 font-semibold text-sm text-slate-800">
							{__item.name}
						</td>
						<td className="p-4 py-5 font-semibold text-sm text-slate-800">
							{_item.min_quantity}
						</td>
						<td className="p-4 py-5 font-semibold text-sm text-slate-800">
							{formatPrice(_item.price)}
						</td>
					</tr>
				);
			});
		});
	};

	return (
		<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg mb-3">
			<table className="w-full table-fixed text-left">
				<thead>
					<tr>
						{["product apply", "min quantity apply", "wholesale price"].map(
							(header, idx) => (
								<th
									key={idx}
									className="p-4 border-b border-slate-200 bg-main"
									style={{ width: `${100 / 6}%` }}>
									<p className="text-sm font-normal leading-none">{t(header)}</p>
								</th>
							)
						)}
					</tr>
				</thead>
				<tbody>{renderWholesalePrice()}</tbody>
			</table>
		</div>
	);
}

export default ViewWholesalePriceUser;
