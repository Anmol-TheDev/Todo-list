import { getAuth } from "firebase/auth";
import { useContext, useState } from "react";
import React from "react";
import { ProfileContext } from "./Home/todoPage";
function UserProfile() {
    const [contextVal,setContextVal] = useState();
  const [dropDown, setDropDown] = useState(false);
  function handleDropDown() { 
    if (dropDown == true) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
    console.log(contextVal)
  }

  function handleLogOut() {}
  return (
    <div className=" flex flex-col ">
      <button
        onClick={handleDropDown}
        className="text-2xl rounded-xl border p-1"
      >
        <i className="fa-solid fa-user"></i> Profile
      </button>
      {dropDown && (
        <div className=" rounded-lg absolute w-80 border bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-center bg-blend-normal bg-gray-200">
            <img
              className="h-32 rounded-[50%]  "
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
          </div>
          <h1>User name</h1>
          <ul>
            {/* <li>Total TODO : {todoCount} </li>
                        <li>Completed TODO : {completedTodo} </li> */}
          </ul>
          <button
            className="p-2 border-red-400 bg-red-200"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
