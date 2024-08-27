import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import React from "react";
import { ProfileContext } from "./Home/todoPage";
import { Popover ,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import { CgProfile } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { AlertDialog,AlertDialogTrigger, AlertDialogContent, } from "@/components/ui/alert-dialog";
function UserProfile() {
  const contextVal = useContext(ProfileContext);
  const [dropDown, setDropDown] = useState(false);
  const auth = getAuth()
  const user = auth?.currentUser;
  const navigate = useNavigate()
  function handleDropDown() {
    if (dropDown == true) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
  }
  function handleLogOut() {
    signOut(auth).then(()=>{
      navigate('/auth')
    }).catch((error)=>{
        console.log(error)
    })
  }
  return(
    <Popover>
      <PopoverTrigger className="flex text-xl" >
        <CgProfile className="text-3xl" /> Profile
      </PopoverTrigger>
      <PopoverContent className="p-8 shadow-xl w-[30vw] max-sm:w-[70vw]">
        <div className="flex justify-center">
          <FaUserCircle className="text-9xl"/>
        </div>
        <div className="text-lg">
        <p><b>Name :</b> {user?.displayName  } </p>
        <p><b>Email :</b> {user?.email} </p>
        <p><b>Total TODO :</b> {contextVal.todoCount} </p>
        <p><b>Completed TODO :</b> {contextVal.completedTodo} </p>
        </div>
        <div className=" flex justify-center p-4">
        <Button onClick={handleLogOut} className=" bg-red-400 shadow-lg hover:bg-red-500 hover:shadow-2xl hover:top-[-20px]">Logout</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserProfile;
