import { useState, useEffect, ChangeEvent, SyntheticEvent, FormEvent } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { Button, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const CreateCourse = () => {
	const [courseMetaData, setCourseMetaData] = useState({
		name: "",
		description: "",
		price: 9.99,
		uploading: false,
		paid: "free",
		loading: false,
		imagePreview: "",
	});

	const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setCourseMetaData({ ...courseMetaData, [e.currentTarget.name]: e.currentTarget.value });
	};

	const handleImage = () => {};

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		console.log(e);
	};

	const courseForm = () => {
		return (
			<form onSubmit={handleSubmit} className="form-group">
				<input
					type="text"
					name="name"
					className="form-control"
					placeholder="name"
					value={courseMetaData.name}
					onChange={handleOnChange}
				/>
				<div>
					<textarea
						name="description"
						cols={7}
						rows={7}
						className="form-control"
						placeholder="description"
						value={courseMetaData.description}
						onChange={handleOnChange}
					/>
				</div>
				<div className="form-row">
					<div className="col">
						<div className="form-group">
							<Select
								defaultValue={courseMetaData.paid}
								style={{ width: "100%" }}
								size="large"
								onChange={(v: string) => {
									setCourseMetaData({ ...courseMetaData, paid: v });
								}}
							>
								<Select.Option value={"paid"}>Paid</Select.Option>
								<Select.Option value={"free"}>Free</Select.Option>
							</Select>
						</div>
					</div>
				</div>
				<div className="form-row">
					<div className="col">
						<div className="form-group">
							<label className="btn btn-outlined-secondary btn-block text-left">
								{courseMetaData.loading ? "Uploading" : "Image Upload"}
								<input type="file" name="image" onChange={handleImage} accept="image/*" hidden />
							</label>
						</div>
						<div className="row">
							<div className="col">
								<Button
									onClick={handleSubmit}
									disabled={courseMetaData.loading || courseMetaData.uploading}
									className="btn btn-primary"
									icon={<SaveOutlined />}
								>
									{courseMetaData.loading ? "Saving..." : "Save & Continue"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
	};

	return (
		<InstructorRoute>
			<h1 className="jumbotron text-center square">Create Course</h1>
		</InstructorRoute>
	);
};

export default CreateCourse;
