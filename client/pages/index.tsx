import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "@components/cards/CourseCard";

const Index = ({ courses }) => {
	return (
		<>
			<h1 className="jumbotron text-center bg-primary square">Online Education Marketplace</h1>
			<div className="container-fluid">
				<div className="row">
					{courses.map((course) => (
						<CourseCard key={course._id} course={course} />
					))}
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps() {
	const { data } = await axios.get(`http://localhost:8000/api/courses`);
	return {
		props: {
			courses: data
		}
	};
}

export default Index;
