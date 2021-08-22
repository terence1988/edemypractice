import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import Avatar from "antd/lib/avatar/avatar";
import { MongoCourse } from "../../../../types/Course";
import { Button, Tooltip } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";

const CourseView = () => {
	const [course, setCourse] = useState<MongoCourse>();
	const router = useRouter();
	console.log(router);
	const { slug } = router.query;
	useEffect(() => {
		fetchCourse();
		console.log(slug);
	}, [slug]);

	const fetchCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);
		setCourse(data);
	};

	return (
		<InstructorRoute>
			<div className="container-fluid pt-3">
				{course && (
					<div className="container-fluid pt-1">
						<Avatar size={80} src={course.image ? course.image.Location : "/course.png"} />
						<div className="media-body pl-2">
							<div className="row">
								<div className="col-10">
									<h5 className="mt-2 text-primary">{course.name}</h5>
									<p style={{ marginTop: "-1em" }}>
										{course.lessons && course.lessons.length} Lessons
									</p>
									<p style={{ marginTop: "-1rem", fontSize: "0.8rem" }}>{course.category}</p>
								</div>
								<div className="d-flex col-2">
									<Tooltip
										title="Edit"
										children={<EditOutlined className="h5 pointer text-warning mr-4" />}
									/>
									<Tooltip
										title="Publish"
										children={<CheckOutlined className="h5 pointer text-warning mr-4" />}
									/>
								</div>
							</div>
							<hr />
							<div className="row">
								<ReactMarkdown className="col" children={course.description} />
							</div>
						</div>
					</div>
				)}
			</div>
		</InstructorRoute>
	);
};

export default CourseView;
