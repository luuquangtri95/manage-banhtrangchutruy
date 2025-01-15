import { Outlet } from "react-router";

function UserPage(props) {
	return (
		<div>
			<h1 className="text-[24px] font-bold">Chào mừng bạn đến trang dành cho thanh viên</h1>
			<div className="admin-content">
				<Outlet />
			</div>
		</div>
	);
}

export default UserPage;
