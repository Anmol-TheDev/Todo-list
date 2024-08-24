import {getDatabase,ref,set,get,push,onValue,remove,update} from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebaseConfigure";
import { createContext, useEffect, useState } from "react";
import { useNavigate , useLocation } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "../profile";

export const ProfileContext = createContext();

function TodoPage() {
  const db = getDatabase(app);
  const [userId,setUserId]= useState()
  const auth = getAuth();
  const [title, setTitle] = useState("");
  const [todos, setTodo] = useState([]);
  const [checkStyle,setCheckStyle] = useState();
  let [todoCount,setTodoCount] = useState(0);
  let [completedTodo,setCompletedTodo]= useState(0);
useEffect(()=>{
  onAuthStateChanged(auth,(user)=>{
    if(user){
        setUserId(user.uid)
    }
})
},[])

useEffect(() => { //fetching stored value from database 

    if(!userId) return
    const dataref = ref(db,userId );
    get(dataref).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot?.val() || {};
        setTodo(Object.values(data));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  },[userId]);

  useEffect(()=>{
  setTodoCount(0);
  setCompletedTodo(0);
    if(todos){
      todos.forEach((e)=>{
        setTodoCount(todoCount++);
        if(e.completed==true){
          setCompletedTodo(completedTodo++);
        }
      })
    }
  },[todos])

  const  HandleSubmit = async(e) => {   //setting data on submit
    e.preventDefault();
    if (title.trim() === "") return; // Prevent submitting empty todos
    const newTodoRef = push(ref(db, auth?.currentUser?.uid));
    set(newTodoRef, {
      todoTitle: title,
      completed: false,
      id: newTodoRef.key,
      time:Date()
    }).catch((error) => {
      console.error("Error adding new todo:", error);
    })
    handleDbChange()
    setTitle("");
  };

  const handleDbChange = () => {  //refrasing the db data on any change
    const dataref = ref(db,userId)
    setTodo([])
    onValue(dataref, (snapshot) => {
      const data = snapshot.val();
      setTodo(Object.values(data));
    });
  }
  const handleDelete = (argument) => {  //function for deleting todo
    const dataref = ref(db,`${userId}/${argument}`)
    remove(dataref).then(()=>{
      handleDbChange()
    })
  }
  const handleCheck = (argument,e) => {  //checkbox in todo
    const newRef = ref(db, `${auth?.currentUser?.uid}/${argument.id}`);
if(e.target.checked){
    update(newRef, {
      todoTitle:argument.todoTitle,
      completed: true,
      id: newRef.key,
      time:argument.time
    })
    setCheckStyle({textDecoration:'line-through'})
  } else {
    update(newRef, {
      todoTitle:argument.todoTitle,
      completed: false,
      id: newRef.key,
      time:argument.time
    })   
    setCheckStyle()
  }
  handleDbChange()
  }
  return (
    <ProfileContext.Provider value={{todoCount,completedTodo}}>
    <div className="p-8 ">console.log(info)
      <div className="flex flex-col gap-4">
        <div className="flex justify-between pl-[40%]">
        <h1 className="text-5xl self-center">TO DO </h1>
          < UserProfile />
        </div>
        <div className="flex justify-center">
          <form onSubmit={HandleSubmit} className="flex gap-7">
            <input className="border-2 text-xl px-2  rounded-md"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
            <button className="bg-orange-200 p-1 rounded-md">Add todo </button> 
          </form>
        </div>
        <div className="flex flex-wrap gap-4">
          {todos?.map((todo) => (
            <div className="border-2 p-4 px-8flex flex-col w-full rounded-md "key={todo.id} draggable >
              <input type="checkbox" checked={todo.completed} onChange={(e)=>handleCheck(todo,e)}/>
              <h1  className={`${todo.completed ? "line-through" : ""} text-3xl`}>{todo.todoTitle}</h1>
              <p>{todo.completed ? "Completed" : "Incomplete"}</p>
              <p>{todo.time}</p>
              <button className="text-red-300 float-right " onClick={()=>handleDelete(todo.id)}><i className="fa-solid fa-trash"></i></button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ProfileContext.Provider>
  );
}
export default TodoPage;
