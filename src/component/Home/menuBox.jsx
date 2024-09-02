import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarSub,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { update, getDatabase, ref,push,set } from "firebase/database";
import app from "@/firebase/firebaseConfigure";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MenuBar({ props, changeClr, hndlStar,dbChange }) {
  const auth = getAuth();
  const db = getDatabase(app);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textRef,setTextRef] = useState()
  var Ref = ref(db, `${auth?.currentUser?.uid}/${props.id}`);
  function handlePiritoryInDb(argument, color) {
    update(Ref, {
      todoTitle: props.todoTitle,
      completed: props.completed,
      id: props.id,
      time: props.time,
      menu: {
        priority: argument,
        priority_bg: color,
      },
      star: props.star,
    })
      .then(() => {
        changeClr(props.id, color, argument);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleStar = () => {
    if (props.star == false) {
      update(Ref, {
        todoTitle: props.todoTitle,
        completed: props.completed,
        id: props.id,
        time: props.time,
        menu: {
          priority: props.menu.priority,
          priority_bg: props.menu.priority_bg,
        },
        star: true,
      }).then(() => hndlStar(true, props.id));
    } else {
      update(Ref, {
        todoTitle: props.todoTitle,
        completed: props.completed,
        id: props.id,
        time: props.time,
        menu: {
          priority: props.menu.priority,
          priority_bg: props.menu.priority_bg,
        },
        star: false,
      }).then(() => hndlStar(false, props.id));
    }
  }
  const handleSubTodo = ( ) => {
    const subTodoRef = push(ref(db, `${auth?.currentUser?.uid}/${props.id}/subtodo`));
        if(textRef==""){
         
        } else {
          console.log("else")
          set(subTodoRef, {
                title:textRef,
                completed:false,
                id:subTodoRef.key
            
          }).then(()=>dbChange())
        }
    }
  return (
    <>
      <Menubar className=" float-right border-0">
        <MenubarMenu>
          <MenubarTrigger>
            <HiDotsVertical />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarItem
                onClick={() => {
                  handleStar(props);
                }}
              >
                <p className="pr-3">Star</p>
                <FaRegStar />
              </MenubarItem>
            </MenubarSub>
            <MenubarSub>
              <MenubarItem
                onClick={() => {
                  isModalOpen == true
                    ? setIsModalOpen(false)
                    : setIsModalOpen(true);
                }}
              >
                SubTodo <MdSubdirectoryArrowLeft />
              </MenubarItem>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Piritory</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem
                  onClick={() => {
                    handlePiritoryInDb("High", "bg-red-200");
                  }}
                  className=" focus:bg-red-300 "
                >
                  High
                </MenubarItem>
                <MenubarItem
                  onClick={() => {
                    handlePiritoryInDb("medium", "bg-yellow-200");
                  }}
                  className="focus:bg-yellow-300"
                >
                  Medium
                </MenubarItem>
                <MenubarItem
                  onClick={() => {
                    handlePiritoryInDb("low", "bg-green-200");
                  }}
                  className="focus:bg-green-300"
                >
                  Low
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Enter You Todo Title</DialogTitle>
            <DialogDescription className="p-2">
              <Input placeholder="Enter your ToDo Title" onChange={(e)=>setTextRef(e.target.value)} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={()=>{handleSubTodo(),setIsModalOpen(false)}} >Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
