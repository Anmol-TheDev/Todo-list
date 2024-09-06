import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onValue,
  remove,
  update,
  serverTimestamp,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebaseConfigure";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import UserProfile from "../profile";
import { Input } from "@/components/ui/input";
import { MenuBar } from "./menuBox";
import { TiStarFullOutline } from "react-icons/ti";
import { FaArrowTurnDown } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

export const ProfileContext = createContext();

function TodoPage() {
  const db = getDatabase(app);
  const [userId, setUserId] = useState();
  const auth = getAuth();
  const [title, setTitle] = useState("");
  const [todos, setTodo] = useState([]);
  let [todoCount, setTodoCount] = useState(0);
  let [completedTodo, setCompletedTodo] = useState(0);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    //fetching stored value from database

    if (!userId) return;
    const dataref = ref(db, userId);
    get(dataref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot?.val() || {};
          const temp = Object.values(data);
          temp.forEach((el, i) => {
            const subtodo = Object.values(el.subtodo || {});
            temp[i]["subtodo"] = subtodo;
          });
          setTodo(temp.sort((a,b)=>a.menu.priority-b.menu.priority));
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  useEffect(() => {
    setTodoCount(0);
    setCompletedTodo(0);
    if (todos) {
      setTodoCount(todos.length);
      todos.forEach((e) => {
        if (e?.completed == true) {
          setCompletedTodo(++completedTodo);
        }
      });
    }
  }, [todos]);

  const HandleSubmit = async (e) => {
    //setting data on submit
    e?.preventDefault();
    let dateRef = new Date();
    let temp = dateRef.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      week: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (title.trim() === "") return; // Prevent submitting empty todos
    const newTodoRef = push(ref(db, auth?.currentUser?.uid));
    set(newTodoRef, {
      todoTitle: title,
      completed: false,
      id: newTodoRef.key,
      time: temp,
      star: false,
      menu: {
        priority:4,
        priority_bg: "bg-slate-400",
      },
      subtodo: [],
    }).catch((error) => {
      console.error("Error adding new todo:", error);
    });
    handleDbChange();
    setTitle("");
  };
  // for Readign Updated data from DB
  const handleDbChange = () => {
    //refrasing the db data on any change

    const dataref = ref(db, userId);
    onValue(dataref, (snapshot) => {
      const data = snapshot.val();
      if(data===null) return (setTodo([]))
      let temp = Object.values(data);
      temp.forEach((el, i) => {
        const subtodo = Object.values(el.subtodo || {});
        temp[i]["subtodo"] = subtodo;
      });
      const array = Object.values(data)
      array.sort((a,b) => a.menu.priority - b.menu.priority)
      setTodo(array)
    });
  };
  const handleDelete = (argument) => {
    //function for deleting todo
    const dataref = ref(db, `${userId}/${argument}`);
    remove(dataref)
      handleDbChange();
  };
  const handleCheck = (argument, e) => {
    //checkbox in todo
    const newRef = ref(db, `${auth?.currentUser?.uid}/${argument.id}`);
    if (e?.target.checked) {
      const updatedTodo = todos.map((todo) =>
        argument.id == todo.id ? { ...todo, completed: true } : todo
      );
      setTodo(updatedTodo);
      update(newRef, {
        todoTitle: argument.todoTitle,
        completed: true,
        id: newRef.key,
        time: argument.time,
        star: argument.star,
        menu: {
          priority: argument.menu.priority,
          priority_bg: argument.menu.priority_bg,
        },
      });
    } else {
      const updatedTodo = todos.map((todo) =>
        argument.id == todo.id ? { ...todo, completed: false } : todo
      );
      setTodo(updatedTodo);
      update(newRef, {
        todoTitle: argument.todoTitle,
        completed: false,
        id: newRef.key,
        time: argument.time,
        star: argument.star,
        menu: {
          priority: argument.menu.priority,
          priority_bg: argument.menu.priority_bg,
        },
      });
    }
    setCompletedTodo(0);
  };

  function handleMenuChange(Id, color, priority) {
    // for changing Todo bg according to priority locally
    const updatedTodo = todos.map((todo) =>
      todo.id === Id
        ? {
            ...todo,
            menu: { ...todo.menu, priority: priority, priority_bg: color },
          }
        : todo
    );

    setTodo(updatedTodo.sort((a,b)=>a.menu.priority-b.menu.priority));
  }
  //updating star status in todos array
  function handleStar(status, Id) {
    const updatedTodo = todos.map((todo) =>
      todo.id == Id ? { ...todo, star: status } : todo
    );
    setTodo(updatedTodo);
  }
  const onSubtodoChecked = (subTodo, todo, e) => {
    console.log(todos);
    const Ref = ref(
      db,
      `${auth?.currentUser?.uid}/${todo.id}/subtodo/${subTodo.id}`
    );
    const checkStatus = subTodo.completed == true ? false : true;
    update(Ref, {
      title: subTodo.title,
      id: subTodo.id,
      completed: checkStatus,
    }).then(() => {
      const updatedTodo = todos.map((t) => {
        if (todo.id != t.id) {
          return t;
        }
        return {
          ...t,
          subtodo: t.subtodo.map((st) => {
            if (st.id !== subTodo.id) return st;
            return { ...st, completed: checkStatus };
          }),
        };
      });
      setTodo(updatedTodo);
    });
  };
console.log(todos)
  function deleteSubtodo(todoId, subtodoId) {
    const dataref = ref(db, `${userId}/${todoId}/subtodo/${subtodoId}`);
    remove(dataref).then(() => {
      handleDbChange();
    });
  }

  return (
    <ProfileContext.Provider value={{ todoCount, completedTodo }}>
      <div className="p-8 max-sm:p-3 ">
        <div className="flex flex-col gap-4 ">
          <div className="flex justify-between ">
            <h1 className="text-5xl self-center">TO DO </h1>
            <UserProfile />
          </div>
          <div className="flex justify-center">
            <form onSubmit={HandleSubmit} className="flex gap-7">
              <Input
                className="border-2 text-xl px-2  rounded-md"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e?.target.value);
                }}
                required
              />
              <Button>Add todo </Button>
            </form>
          </div>
          <div className="flex flex-wrap gap-4">
            {todos?.map((todo, i) => {
              // const subtodo = Object?.values(todo?.subtodo ?? {});
              return (
                <div
                  className={`border-2 p-4 px-8flex flex-col w-full rounded-md shadow-lg ${
                    todo?.menu ? todo.menu.priority_bg : "bg-slate-400"
                  } `}
                  key={todo?.id || i}
                >
                  <MenuBar
                    props={todo}
                    changeClr={handleMenuChange}
                    hndlStar={handleStar}
                    dbChange={handleDbChange}
                  />
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={todo?.completed}
                      onChange={(e) => handleCheck(todo, e)}
                    />
                    {todo?.star == true ? <TiStarFullOutline /> : ""}
                  </div>
                  <h1
                    className={`${
                      todo?.completed ? "line-through" : ""
                    } text-3xl`}
                  >
                    {todo?.todoTitle}
                  </h1>
                  <p>{todo?.completed ? "Completed" : "Incomplete"}</p>
                  <p>{todo?.time}</p>
                  <button
                    className="text-red-400 float-right pr-4"
                    onClick={() => handleDelete(todo?.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <Popover>
                    <PopoverTrigger>
                      <Toggle>
                        SubTodo <FaArrowTurnDown />{" "}
                      </Toggle>
                    </PopoverTrigger>
                    <PopoverContent
                      key={todo.id}
                      className={` border-gray-600 ml-8 ${todo?.menu?.priority_bg}`}
                    >
                      {todo.subtodo.map((subtodo) => (
                        <>
                          <div
                            key={subtodo.key}
                            className="flex text-lg w-full justify-between"
                          >
                            <div className="flex gap-3">
                              <input
                                type="checkbox"
                                checked={subtodo?.completed}
                                onChange={(e) => {
                                  onSubtodoChecked(subtodo, todo, e);
                                }}
                              />
                              <h1>{subtodo.title}</h1>
                            </div>
                            <button
                              className="text-red-400 text-sm  "
                              onClick={() => deleteSubtodo(todo.id, subtodo.id)}
                            >
                              {" "}
                              <i className="fa-solid fa-trash"></i>{" "}
                            </button>
                          </div>
                        </>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
export default TodoPage;
