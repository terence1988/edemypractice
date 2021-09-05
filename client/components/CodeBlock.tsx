// components/codeblock.js
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

//TODO:What is props here?
//children must be string in MD but className?
// interface CodeBlockProps {
// 	className: string;
// 	children: string;
// }

const CodeBlock = {
	code({ className, children }: any) {
		// Removing "language-" because React-Markdown already added "language-"
		const language = className.replace("language-", "");
		return language ? (
			<SyntaxHighlighter style={dracula} language={language} children={children[0]} />
		) : (
			<code className={className}>{children}</code>
		);
	},
};

export default CodeBlock;
