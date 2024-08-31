import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarSub,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { HiDotsVertical } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { update,getDatabase,ref } from "firebase/database";
import app from "@/firebase/firebaseConfigure";


export function MenuBar ({props,changeClr,hndlStar}) {
    const auth = getAuth()
    const db = getDatabase(app) 
    
    function handlePiritoryInDb (argument,color) {
        const newRef = ref(db, `${auth?.currentUser?.uid}/${props.id}`);
            update(newRef, {
              todoTitle:props.todoTitle,
              completed: props.completed,
              id: props.id,
              time:props.time,
              menu: {
                priority:argument,
                priority_bg: color,
              },
              star:props.star
            }).then(()=>{
             changeClr(props.id,color,argument)
            }).catch((error)=>{
                console.log(error)
            })
              
    }

  const   handleStar = ( ) =>{
      const Ref = ref(db, `${auth?.currentUser?.uid}/${props.id}`);
      if(props.star==false){
        update(Ref,{
          todoTitle:props.todoTitle,
          completed: props.completed,
          id: props.id,
          time:props.time,
          menu: {
            priority:props.menu.priority,
            priority_bg: props.menu.priority_bg,
          },
          star:true,
        }).then(()=>hndlStar(true,props.id))
      } else{
        update(Ref,{
          todoTitle:props.todoTitle,
          completed: props.completed,
          id: props.id,
          time:props.time,
          menu: {
            priority:props.menu.priority,
            priority_bg: props.menu.priority_bg,
          },
          star:false,
        }).then(()=>hndlStar(false,props.id))
      }
  }



    return (
        <Menubar className=" float-right border-0" >
            <MenubarMenu>
                <MenubarTrigger><HiDotsVertical/></MenubarTrigger>
            <MenubarContent>
            <MenubarSub>
            <MenubarItem onClick={()=>{handleStar(props)}} > Star<FaRegStar/></MenubarItem>
          </MenubarSub>
            <MenubarSub>
            <MenubarSubTrigger>Piritory</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={()=>{handlePiritoryInDb("High","bg-red-200" )}} className=" focus:bg-red-300 ">High</MenubarItem>
              <MenubarItem onClick={()=>{handlePiritoryInDb("medium","bg-yellow-200")}} className="focus:bg-yellow-300">Medium</MenubarItem>
              <MenubarItem onClick={()=>{handlePiritoryInDb("low","bg-green-200")}} className="focus:bg-green-300">Low</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
