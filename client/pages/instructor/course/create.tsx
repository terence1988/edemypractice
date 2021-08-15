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
import { useRouter } from "next/router";

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
	const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
	const [image, setImage] = useState<any>({});

	//router
	const router = useRouter();

	const handleOnChange: ChangeEventHandler<any> = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setCourseMetaData({ ...courseMetaData, [e.currentTarget.name]: e.currentTarget.value });
	};

	//most generic/base type SyntheticEvent
	const handleImage: ChangeEventHandler<any> = (e: SyntheticEvent) => {
		let file = (e.currentTarget as HTMLInputElement).files[0];
		setPreview(window.URL.createObjectURL(file));
		setUploadButtonText(file.name);
		setCourseMetaData({ ...courseMetaData, loading: true });

		//resize image and store url in database
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
			try {
				let { data } = await axios.post("/api/course/upload-image", {
					image: uri,
				});
				console.log("Image Uploadeds", data);
				//Needs set image in state
				setImage(data);
				setCourseMetaData({ ...courseMetaData, loading: false });
				//There was error regards payload is too large -- 500KB, body-parser normally handle text
			} catch (err) {
				console.log(err);
				setCourseMetaData({ ...courseMetaData, loading: false });
				toast("Image upload failed. Try later");
			}
		});
	};

	const removeImage = async () => {
		try {
			setCourseMetaData({ ...courseMetaData, loading: true });
			const res = await axios.post("/api/course/remove-image", { image });
			setImage({});
			setPreview("");
			setUploadButtonText("Upload Image");
			setCourseMetaData({ ...courseMetaData, loading: false });
		} catch (err) {
			console.log(err);
			setCourseMetaData({ ...courseMetaData, loading: false });
			toast("Image upload failed. Try later");
		}
	};

	const handleSubmit: FormEventHandler<any> = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await axios.post("/api/course", {
				...courseMetaData,
				image,
			});
			console.log(data);
			toast("Now, you are ready!");
			router.push("/instructor");
		} catch (err) {}
	};

	const formProps = {
		handleSubmit,
		handleOnChange,
		handleImage,
		courseMetaData,
		setCourseMetaData,
		preview,
		uploadButtonText,
		setImage,
		removeImage,
	};

	return (
		<InstructorRoute>
			<h1 className="jumbotron text-center square">Create Course</h1>
			<div className="pt-3 pb-3">
				<CourseCreateForm {...formProps} />
			</div>
			<pre>{JSON.stringify(courseMetaData, null, 4)}</pre>
			<br />
			<pre>{JSON.stringify(image, null, 4)}</pre>
		</InstructorRoute>
	);
};

export default CreateCourse;
