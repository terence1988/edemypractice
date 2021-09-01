import { useState, useEffect, Fragment } from "react";
import axios from "axios";

import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar } from "antd";
import { IMongoCourse } from "../../types/Course";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const CurrentInstructor = () => {
	const [courses, setCourses] = useState<IMongoCourse[]>([]);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		const { data } = await axios.get("/api/instructor-courses");
		setCourses(data);
	};

	const myStyle = { marginTop: "-10px", fontSize: "10px" };

	const courseInfo = (course: IMongoCourse) => {
		return course.lessons.length < 5 ? (
			<p style={myStyle} className="text-info">
				At lease 5 lessons are required to publish a course
			</p>
		) : course.published ? (
			<p style={myStyle} className="text-success">
				Your course is live in the marketplkace
			</p>
		) : (
			<p style={myStyle} className="text-warning">
				Your course is ready to be published
			</p>
		);
	};

	return (
		<InstructorRoute>
			<h1 className="jumbotron text-center square">Instructor dashboard</h1>
			{/* {<pre>{JSON.stringify(courses, null, 4)}</pre>} */}

			{courses.length > 0
				? courses.map((course: IMongoCourse) => (
						<Fragment key={course._id}>
							<div className="media pt-2">
								<Avatar
									size={80}
									src={course.image ? course.image.Location : "/asset/course.png"}
								/>
								{/* Size=large is probably not an option and we need to have the circle so the width and height must be specified */}
								<div className="media-body pl-2">
									<div className="row">
										<div className="col" style={{ cursor: "pointer" }}>
											<Link href={`/instructor/course/view/${course.slug}`}>
												<a className="h5 mt-2">
													<h5 className="pt-2">{course.name}</h5>
												</a>
											</Link>
											<p style={{ marginTop: "-0.5rem" }}>{course.lessons.length} Lessons</p>
											{courseInfo(course)}
										</div>
										<div className="col-md-3 mt-3 text-center">
											{course.published ? (
												<div>
													<CheckCircleOutlined className="h5 pointer text-success" />
												</div>
											) : (
												<div>
													<CloseCircleOutlined className="h5 pointer text-warning" />
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</Fragment>
				  ))
				: null}
		</InstructorRoute>
	);
};

export default CurrentInstructor;
