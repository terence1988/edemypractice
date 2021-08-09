import Link from "next/link";
import { useState, useEffect } from "react";

const InstructorNav = () => {
	const [currentActive, setCurrentActive] = useState("");

	useEffect(() => {
		process.browser && setCurrentActive(window.location.pathname);
	}, [process.browser && window.location.pathname]);

	return (
		<div className="nav flex-column nav-pills mt-2">
			<Link href="/instructor">
				<a
					className={`nav-link mb-2 ${
						/^\/instructor$/g.test(currentActive) ? "active" : null
					}`}
				>
					Dashboard
				</a>
			</Link>
			<Link href="/instructor/course/create">
				<a
					className={`nav-link mb-2 ${
						/^\/instructor\/course\/create$/g.test(currentActive) ? "active" : null
					}`}
				>
					Create a new Course
				</a>
			</Link>
		</div>
	);
};

export default InstructorNav;
