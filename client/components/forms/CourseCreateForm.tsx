import { Button, Divider, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { CourseMetaData } from "../../types/Course";
import { ChangeEventHandler, FormEventHandler } from "react";
import Avatar from "antd/lib/avatar/avatar";

const CourseCreateForm = ({
	handleSubmit,
	handleOnChange,
	handleImage,
	courseMetaData,
	setCourseMetaData,
	preview,
}: {
	handleSubmit: FormEventHandler<any>;
	handleOnChange: ChangeEventHandler<any>;
	handleImage: ChangeEventHandler<any>;
	courseMetaData: CourseMetaData;
	setCourseMetaData: Function;
	preview: string;
}) => {
	const children = [];
	for (let i = 9.99; i <= 100; i += 10) {
		//9.99 += 80 > 99.99
		children.push(
			<Select.Option key={i.toFixed(2)} value={courseMetaData.price}>
				${i.toFixed(2)}
			</Select.Option>
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
								setCourseMetaData({ ...courseMetaData, paid: v });
							}}
						>
							<Select.Option value={"paid"}>Paid</Select.Option>
							<Select.Option value={"free"}>Free</Select.Option>
						</Select>
					</div>
				</div>
				{courseMetaData.paid === "paid" && (
					<div className="form-group">
						<Select
							defaultValue={9.99}
							style={{ width: "100%" }}
							onChange={(v) => setCourseMetaData({ ...courseMetaData, price: v })}
							tokenSeparators={[,]}
							size="large"
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
							{courseMetaData.loading ? "Uploading" : "Image Upload"}
							<input type="file" name="image" onChange={handleImage} accept="image/*" hidden />
						</label>
					</div>
					{preview && <Avatar style={{ width: "200" }} src={preview} />}
					{//preview is on src so it must only took local filepath instead of online one}
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

export default CourseCreateForm;
