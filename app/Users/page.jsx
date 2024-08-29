import React from "react";
import { CreateUser } from "../components/Auth/CreateUser/create-user";
import { UserList } from "../components/component/user-list";

const Users = () => {
	return (
		<>
			<CreateUser />
			<UserList />
		</>
	);
};

export default Users;
