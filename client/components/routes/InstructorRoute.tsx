import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

import InstructorNav from "../nav/InstructorNav";

//// file under the folder can make index.tsx directly available to the client
const InstructorRoute = ({ children }) => {
	const [showPage, setShowPage] = useState(true);
	const router = useRouter();
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await axios.get("/api/current-instructor", { withCredentials: true });
				console.log(data);
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
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-2">
							<InstructorNav />
						</div>
						<div className="col-md-10">{children}</div>
					</div>
				</div>
			) : (
				<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />
			)}
		</>
	);
};

export default InstructorRoute;

//this route always require new login
//Something is not right
