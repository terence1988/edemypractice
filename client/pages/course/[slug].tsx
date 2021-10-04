import { useRouter } from "next/router";
import { IMongoCourse } from "@Itypes/Course";
import { useState } from "react";
import axios from "axios";
import SingleCourseJumbotron from "@components/cards/SingleCourseJumbotron";
import PreviewModal from "@components/modal/PreviewModal";
import SingleCourseLessons from "@components/cards/SingleCourseLessons";

const SingleCourse = ({ course }: { course: IMongoCourse }) => {
	const router = useRouter();
	const { slug } = router.query;
	const [showModal, setShowModal] = useState(false);
	const [preview, setPreview] = useState("");

	return (
		<>
			<SingleCourseJumbotron
				course={course}
				showModal={showModal}
				setShowModal={setShowModal}
				preview={preview}
				setPreview={setPreview}
			/>

			{showModal ? (
				<PreviewModal
					showModal={showModal}
					setShowModal={setShowModal}
					preview={preview}
				/>
			) : null}
			{course.lessons && (
				<SingleCourseLessons
					lessons={course.lessons}
					setPreview={setPreview}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

//(context) is available for it
export const getServerSideProps = async ({ query }) => {
	const { data } = await axios.get(
		`http://localhost:8000/api/course/${query.slug}`
	);
	return {
		props: {
			course: data,
		},
	};
};

export default SingleCourse;
