import { Outlet } from "react-router";

function AdminPage(props) {
	return (
		<div>
			<h1 className="text-[26px] font-bold">Welcome to Admin 😉</h1>
			<div className="w-[60px] h-[2px] bg-black"></div>
			<div className="admin-content">
				<Outlet />
			</div>
		</div>
	);
}

export default AdminPage;
