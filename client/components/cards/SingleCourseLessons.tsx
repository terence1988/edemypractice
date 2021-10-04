import { List, Avatar } from "antd";
import { Dispatch, SetStateAction } from "react";

//https://stackoverflow.com/questions/56028635/passing-usestate-as-props-in-typescript

interface SingleCourseLessonsProps {
	lessons: any[];
	setPreview: Dispatch<SetStateAction<string>>;
	showModal: Dispatch<SetStateAction<boolean>>;
	setShowModal: Dispatch<SetStateAction<boolean>>;
}

const SingleCourseLessons = ({
	lessons,
	setPreview,
	showModal,
	setShowModal,
}: SingleCourseLessonsProps) => {
	return (
		<div className="container">
			<div className="row">
				<ul className="col lesson-list">
					{lessons && <h4>{lessons.length} Lessons</h4>}
					<hr />
					<List
						itemLayout="horizontal"
						dataSource={lessons}
						renderItem={(item, index) => {
							return (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar>{index + 1}</Avatar>}
										title={item.title}
									></List.Item.Meta>
								</List.Item>
							);
						}}
					/>
				</ul>
			</div>
		</div>
	);
};

export default SingleCourseLessons;
