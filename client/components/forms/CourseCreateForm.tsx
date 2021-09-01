import { Button, Select, Badge, Avatar } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { ICourseMetaData } from "../../types/Course";
import { ChangeEventHandler, FormEventHandler, MouseEventHandler } from "react";

const { Option } = Select;

const CourseCreateForm = ({
	handleSubmit,
	handleOnChange,
	handleImage,
	courseMetaData,
	setCourseMetaData,
	preview,
	uploadButtonText,
	removeImage,
	editPage = false,
}: {
	handleSubmit: FormEventHandler<any>;
	handleOnChange: ChangeEventHandler<any>;
	handleImage: ChangeEventHandler<any>;
	courseMetaData: ICourseMetaData;
	setCourseMetaData: Function;
	removeImage: MouseEventHandler<any>;
	preview: string;
	uploadButtonText: string;
	editPage: boolean;
}) => {
	const children = [];
	for (let i = 9.99; i <= 100; i += 10) {
		//9.99 += 80 > 99.99
		children.push(
			<Option key={i.toFixed(2)} value={Number(i.toFixed(2))}>
				${i.toFixed(2)}
			</Option>
		);
	}

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
							value={courseMetaData.paid}
							onChange={(v: string) => {
								setCourseMetaData({ ...courseMetaData, paid: v, price: 0 });
							}}
						>
							<Option value={"paid"}>Paid</Option>
							<Option value={"free"}>Free</Option>
						</Select>
					</div>
				</div>
				{courseMetaData.paid === "paid" && (
					<div className="form-group">
						<Select
							defaultValue={9.99}
							value={courseMetaData.price}
							style={{ width: "100%" }}
							tokenSeparators={[,]}
							size="large"
							onChange={(v: number) => {
								setCourseMetaData({ ...courseMetaData, price: v });
							}}
						>
							{children}
						</Select>
					</div>
				)}
			</div>
			<div className="form-group">
				<input
					type="text"
					name="category"
					className="form-control"
					placeholder="Category"
					value={courseMetaData.category}
					onChange={handleOnChange}
				/>
			</div>
			<div className="form-row">
				<div className="col">
					<div className="form-group">
						<label className="btn btn-outline-secondary btn-block text-left">
							{uploadButtonText}
							<input type="file" name="image" onChange={handleImage} accept="image/*" hidden />
						</label>
					</div>
				</div>
				{preview && (
					<div onClick={removeImage}>
						<Badge count="X" style={{ cursor: "pointer" }}>
							<Avatar style={{ width: "200" }} src={preview} />
						</Badge>
					</div>
				)}
				{/*preview is on src so it must only took local filepath instead of online one*/}
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
		</form>
	);
};

export default CourseCreateForm;
