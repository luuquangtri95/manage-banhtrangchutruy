import { Outlet } from "react-router";

function AdminPage(props) {
	return (
		<div>
			<h1 className="text-[24px] font-bold">Chào mừng bạn đến trang quản trị admin</h1>
			<div className="admin-content">
				<Outlet />
			</div>
		</div>
	);
}

export default AdminPage;
