import { useRouter } from "next/router";
import { IMongoCourse } from "@Itypes/Course";
import { useState, useContext, useEffect, SyntheticEvent } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import SingleCourseJumbotron from "@components/cards/SingleCourseJumbotron";
import PreviewModal from "@components/modal/PreviewModal";
import SingleCourseLessons from "@components/cards/SingleCourseLessons";
import { UserContext } from "contexts";
import { loadStripe } from '@stripe/stripe-js'; //client stripe core

const SingleCourse = ({ course }: { course: IMongoCourse; }) => {
	const router = useRouter();
	const { slug } = router.query;
	const [showModal, setShowModal] = useState(false);
	const [preview, setPreview] = useState("");
	const [loading, setLoading] = useState(false);
	const {
		state: { user }
	} = useContext(UserContext);
	const [enrolled, setEnrolled] = useState<{ status: boolean; course: IMongoCourse; }>({ status: false, course: null });

	useEffect(() => {
		if (user && course) {
			checkEnrollment();
		}
	}, [user, course]);

	const checkEnrollment = async () => {
		const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
		setEnrolled(data);
	};

	const handlePaidEnrollment = async (e) => {
		console.log('paid');
		try {
			setLoading(true);
			if (!user) return router.push('/login');
			if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);
			const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
			const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
			stripe.redirectToCheckout({ sessionId: data });
			setLoading(false);
		} catch (err) {
			toast('Enrolment failed');
			setLoading(false);
			console.log(err);
		}
	};

	const handleFreeEnrollment = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			//check if user log in
			//check if enrolled
			if (!user) return router.push('/login');
			if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);

			setLoading(true);
			const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
			toast(data.message);
			setLoading(false);
			if (data.course) return router.push(`/user/course/${data.course.slug}`);
		} catch (err) {
			toast(`Enrolment failed`);
			setLoading(false);
		}
	};

	return (
		<>
			<SingleCourseJumbotron
				course={course}
				showModal={showModal}
				setShowModal={setShowModal}
				preview={preview}
				setPreview={setPreview}
				user={user}
				loading={loading}
				setLoading={setLoading}
				handlePaidEnrollment={handlePaidEnrollment}
				handleFreeEnrollment={handleFreeEnrollment}
				enrolled={enrolled}
			/>

			{showModal ? (
				<PreviewModal showModal={showModal} setShowModal={setShowModal} preview={preview} />
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
	const { data } = await axios.get(`http://localhost:8000/api/course/${query.slug}`);
	return {
		props: {
			course: data
		}
	};
};

export default SingleCourse;
