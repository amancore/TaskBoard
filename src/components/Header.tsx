import React from "react";
import Ti from './Ti';
const Header: React.FC = () => {
	return (
		<header className="header fixed bg-columnBackgroundColor text-rose-500 p-2 shadow-md shadow-white z-50 ">
			<div className="flex bold">
			<Ti/>
			<h1>Task Board</h1>
			</div>
		</header>
	);
};

export default Header;