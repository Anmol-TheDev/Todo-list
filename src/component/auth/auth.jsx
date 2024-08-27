import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { useRef, useState } from "react";
import app from "../../firebase/firebaseConfigure";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { getDatabase,set,ref,push } from "firebase/database";
function SignIN() {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const email = useRef();
  const password = useRef();
  const name = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRegister = async (event) => {
    event.preventDefault();
      
    createUserWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .then((userCredentials) => {
        navigate("/todo");
        updateProfile(auth.currentUser,{
          displayName: name.current.value
        }).catch((err)=>{
          console.log(error)
        })
      })
      .catch((error) => {
       alert(error.message)
      console.log(error)
        event.target.reset();
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .then((userCredentials) => {
        navigate("/todo");
      })
      .catch(() => {
        alert("Problem with email or password");
        event.target.reset();
      });
  };

  const handleGoogleSignIn = async (event) => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then(() => {
        navigate("/todo");
      })
      .catch((error) => {
        alert(error.message)
        event.target.reset()
      });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, email.current.value)
      .then(() => {
        alert("Password reset email sent!");
        setRender(LoginForm);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const RegisterForm = (
    <div className="border-2 bg-gray-400 w-2/4 h-fit flex flex-col p-6 px-8 gap-4 rounded-md backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-10 max-sm:w-[90vw]">
      <h1 className="text-center text-2xl max-sm:text-3xl">SignUp</h1>
      <form className="flex flex-col gap-2" onSubmit={handleRegister}>
        <Label htmlFor="name">Name</Label>
        <Input type="text" ref={name} id="name" required placeholder="Enter your Name" />
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          ref={email}
          id="email"
          placeholder="Enter your email"
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          ref={password}
          id="password"
          placeholder="Enter your Password"
          required
        />
        <span
          className="text-sm hover:underline cursor-pointer"
          onClick={() => {
            setRender(LoginForm);
          }}
        >
          Already have an account
        </span>
        <Button className="text-lg">Submit</Button>
      </form>
      <Button onClick={handleGoogleSignIn} className="text-xl flex gap-4">
        {" "}
        <FcGoogle /> Sign In with Google
      </Button>
    </div>
  );

  const [render, setRender] = useState(RegisterForm);

  const LoginForm = (
    <div className="border-2 w-2/4 h-fit flex flex-col p-6 px-8 gap-3  rounded-md backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-10 max-sm:w-[80vw] text-[12px] ">
      <h1 className="text-center text-2xl">Login</h1>
      <form className="flex flex-col gap-2" onSubmit={handleLogin}>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          ref={email}
          id="email"
          placeholder="Enter your email"
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          ref={password}
          id="password"
          placeholder="Enter your Password"
          required
        />
        <div className="flex justify-between hover: cursor-pointer">
          <span onClick={() => setRender(RegisterForm)}>
            Back to registration
          </span>
          <span onClick={() => setRender(ResetForm)}>Reset password {">"}</span>
        </div>
        <Button className="text-lg">Submit</Button>
        <span className="block border-2 bg-red-200 text-red-500 rounded-sm border-none px-2">
          {error}
        </span>
      </form>
      <Button onClick={handleGoogleSignIn} className="text-xl flex gap-4">
        {" "}
        <FcGoogle /> Sign In with Google
      </Button>
    </div>
  );

  const ResetForm = (
    <div className="border-2 w-2/4 h-fit flex flex-col p-6 px-8 gap-3 rounded-md backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-10 max-sm:w-[80vw]">
      <h1 className="text-center text-2xl">Reset your password </h1>
      <form className="flex flex-col gap-4" onSubmit={handlePasswordReset}>
        <input
          type="text"
          required
          className="rounded-sm p-1 px-3"
          ref={email}
        />
        <Button>Submit</Button>
        <p
          onClick={() => {
            setRender(LoginForm);
          }}
          className=" cursor-pointer hover:underline text-sm"
        >
          {" "}
          {"<"} Back to Login
        </p>
      </form>
    </div>
  );

  return (
    <div
      className="w-dvw h-dvh flex justify-center items-center"
      style={{
        backgroundImage: "url('authBackground.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {render}
    </div>
  );
}

export default SignIN;
