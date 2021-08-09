import {
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	FormEventHandler,
	ChangeEventHandler,
	SyntheticEvent,
} from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import { CourseMetaData } from "../../../types/Course";

const CreateCourse = () => {
	const [courseMetaData, setCourseMetaData] = useState<CourseMetaData>({
		name: "",
		description: "",
		price: 9.99,
		uploading: false,
		paid: "free",
		loading: false,
		category: "",
	});

	const [preview, setPreview] = useState("");

	const handleOnChange: ChangeEventHandler<any> = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setCourseMetaData({ ...courseMetaData, [e.currentTarget.name]: e.currentTarget.value });
	};

	//most generic/base type SyntheticEvent
	const handleImage: ChangeEventHandler<any> = (e: SyntheticEvent) => {
		setPreview(window.URL.createObjectURL((e.currentTarget as HTMLInputElement).files[0]));
	};

	const handleSubmit: FormEventHandler<any> = (e: FormEvent) => {
		e.preventDefault();
		console.log(e);
	};

	const formProps = {
		handleSubmit,
		handleOnChange,
		handleImage,
		courseMetaData,
		setCourseMetaData,
		preview,
	};

	return (
		<InstructorRoute>
			<h1 className="jumbotron text-center square">Create Course</h1>
			<div className="pt-3 pb-3">
				<CourseCreateForm {...formProps} />
			</div>
			<pre>{JSON.stringify(courseMetaData)}</pre>
		</InstructorRoute>
	);
};

export default CreateCourse;
