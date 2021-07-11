import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

//// file under the folder can make index.tsx directly available to the client
const UserRoute = ({ children }) => {
	const [showPage, setShowPage] = useState(true);
	const router = useRouter();
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await axios.get("/api/currentUser", { withCredentials: true });
				if (data.ok) setShowPage(true);
			} catch (err) {
				console.log(err);
				setShowPage(false);
				router.push("/login");
			}
		};
		fetchUser();
	}, []);

	return (
		<>
			{showPage ? (
				<>{children}</>
			) : (
				<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />
			)}
		</>
	);
};

export default UserRoute;

//moved to be used as wapper conponemt
