import unauthorizedImage from "../assets/unauthorized.jpg";

function UnauthorizedPage(props) {
	return (
		<div className="h-[100vh] flex justify-center">
			<img
				src={unauthorizedImage}
				alt=""
				className="d-block"
				width={700}
			/>
		</div>
	);
}

export default UnauthorizedPage;
