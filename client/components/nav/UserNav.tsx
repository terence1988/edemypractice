import Link from "next/link";
import { useState, useEffect } from "react";

const UserNav = () => {
	const [currentActive, setCurrentActive] = useState("");

	useEffect(() => {
		process.browser && setCurrentActive(window.location.pathname);
	}, [process.browser && window.location.pathname]);
	return (
		<div className="nav flex-column nav-pills mt-2">
			<Link href="/user">
				<a className={`nav-link ${/user/g.test(window.location.pathname) ? "active" : null}`}>
					Dashboard
				</a>
			</Link>
		</div>
	);
};

export default UserNav;
