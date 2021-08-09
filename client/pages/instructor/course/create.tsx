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
import Resizer from "react-image-file-resizer";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import { CourseMetaData } from "../../../types/Course";
import { toast } from "react-toastify";

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
	const [uploadText, setUploadText] = useState("");

	const handleOnChange: ChangeEventHandler<any> = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setCourseMetaData({ ...courseMetaData, [e.currentTarget.name]: e.currentTarget.value });
	};

	//most generic/base type SyntheticEvent
	const handleImage: ChangeEventHandler<any> = (e: SyntheticEvent) => {
		let file = (e.currentTarget as HTMLInputElement).files[0];
		setPreview(window.URL.createObjectURL(file));
		setUploadText(file.name);
		setCourseMetaData({ ...courseMetaData, loading: true });

		//resize image and store url in database
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
			try {
				let { data } = await axios.post("api/corse/upload-image", {
					image: uri,
				});
				console.log(data);
				setCourseMetaData({ ...courseMetaData, loading: false });
			} catch (err) {
				console.log(err);
				setCourseMetaData({ ...courseMetaData, loading: false });
				toast("Image upload failed. Try later");
			}
		});
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
