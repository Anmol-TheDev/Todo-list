import { getAuth,onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";
import { useState } from "react";
export function Home() {
const navigate = useNavigate()
const [btnTitle,setBtnTitle] = useState("Get start >")
const auth = getAuth();
const [userStatus,setUserStatus]= useState(false);
  onAuthStateChanged(auth,(user)=>{
    if(user){
      setBtnTitle("Lets add TODO ->")
      setUserStatus(true)
    }
  })
  const handleClick = () => {
    if(userStatus){
      navigate("/todo")
    }
    else{
      navigate("/auth")
    }
  }
  return (
    <>
      <div className=" w-dvw h-dvh flex justify-center flex-col gap-20 select-none items-center font-display bg-center bg-cover " style={{backgroundImage:"url('background2.png')"}}>
        <div className="text-8xl flex flex-col items-center gap-4 max-sm:text-6xl">
          <h1 className="underline-offset-auto ">TO DO</h1>
          <h1 className="font-light text-center">Your EveryDay Plans Here</h1>
        </div>
        <button className="text-2xl bg-orange-300 p-3 rounded-lg max-sm:text-xl" onClick={handleClick} >{btnTitle}</button>
      </div>
    </>
  );
}
