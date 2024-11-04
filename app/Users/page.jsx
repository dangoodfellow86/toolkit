import React from "react";
import { CreateUser } from "../components/Auth/CreateUser/create-user";
import { UserList } from "../components/component/user-list";
import { UserListWithModal } from "../components/component/user-list-with-modal";

const Users = () => {
	return (
		<>
			<CreateUser />
			<UserListWithModal />
		</>
	);
};

export default Users;
