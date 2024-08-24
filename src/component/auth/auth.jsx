import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { useRef, useState } from "react";
import app from "../../firebase/firebaseConfigure";
import { useNavigate } from "react-router";
function SignIN() {
    const auth = getAuth(app);
    const email = useRef();
    const password = useRef();
    const confPass = useRef();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (event) => {
        event.preventDefault();
        if (password.current.value !== confPass.current.value) {
            setError("Passwords do not match");
            return;
        }
        
            createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredentials)=>{
                navigate("/todo")
                console.log(userCredentials);
            })
            .catch ((error)=> {
                console.log(email.current.value, password.current.value)
            console.log(error);
            setError(error.message);
        })
    };
    
    const handleLogin = async (event) => {
        event.preventDefault();
       
             signInWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredentials)=>{
                console.log(userCredentials)
                    navigate("/todo")
            })
              .catch ((error) => {
            console.log(error);
            setError("Problem in Email or Password");
        })
    };
    
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        
            await signInWithPopup(auth, provider)
            .then(()=>{
                    navigate("/todo")
            })
         .catch ((error) =>{
            console.log(error);
            setError(error.message);
        })
    };
    
    const handlePasswordReset = async (e) => {
        e.preventDefault()
            await sendPasswordResetEmail(auth, email.current.value)
            .then(()=>{
                alert("Password reset email sent!");
                setRender(LoginForm)
            }).catch((error)=>{
                    setError(error.message)
            })
    };
    
    const RegisterForm = (
        <div className="border-2 bg-gray-400 w-2/4 h-fit flex flex-col p-6 px-8 gap-4 rounded-md backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-10">
            <h1 className="text-center text-2xl">SignUp</h1>
            <form className="flex flex-col gap-2" onSubmit={handleRegister}>
                <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" ref={email} required className="border-b-2 px-2 p-1 focus:outline-none rounded-sm" placeholder="xyz@email.com" />
                </div>
                <div className="flex flex-col">

                <label htmlFor="password">Password</label>
                <input type="password" name="password" ref={password} className="border-b-2 px-2 p-1 w-full focus:outline-none rounded-sm" placeholder="Password" />
                </div>
                <div className="flex flex-col">
                <label htmlFor="confirm">Confirm Password</label>
                <input type="password" name="confirm" ref={confPass} className="border-b-2 px-2 p-1 focus:outline-none rounded-sm" placeholder="Repeat Password" />
                </div>
                <p className="text-sm px-2 hover:underline hover:cursor-pointer" onClick={() => setRender(LoginForm)}>Already have an account{"  >"}</p>
                 <span className="block border-2 bg-red-200 text-red-500">{error}</span>
                <button type="submit" className="bg-orange-300 rounded-sm p-1">Submit</button>
            </form>
            <button className="bg-green-300 rounded-md p-1" onClick={handleGoogleSignIn}>Google</button>
        </div>
    );

    const [render, setRender] = useState(RegisterForm);
    
    const LoginForm = (
        <div className="border-2 w-2/4 h-fit flex flex-col p-6 px-8 gap-3  rounded-md backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-10">
            <h1 className="text-center text-2xl">Login</h1>
            <form className="flex flex-col gap-2" onSubmit={handleLogin}>
                <div className="flex flex-col">
                <label>Email</label>
                <input type="email" ref={email} className="border-b-2 p-2 rounded-sm focus:outline-none" placeholder="xyz@email.com" />
                </div>
                <div className="flex flex-col">
                <label>Password</label>
                <input type="password" ref={password} className="border-b-2 px-2 p-2 w-full rounded-sm focus:outline-none" placeholder="Password" /> 
                </div>
                <div className="flex w-full justify-between hover: cursor-pointer">
                    <p className="text-sm  hover:underline" onClick={() => setRender(RegisterForm)}>{"< "}Back to registration</p>
                    <p className="text-sm  hover:underline" onClick={()=>setRender(ResetForm)}>Reset password {">"}</p>
                </div>
                <span className="block border-2 bg-red-200 text-red-500 rounded-sm border-none px-2">{error}</span>
                <button type="submit" className="bg-orange-300 rounded-md p-1">Submit</button>
            </form>
            <button className="bg-green-300 rounded-md p-1" onClick={handleGoogleSignIn}>Google</button>
        </div>
    );
    
    const ResetForm = (
        <div className="border-2 w-2/4 h-fit flex flex-col p-6 px-8 gap-3 rounded-md backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-10">
            <h1 className="text-center text-2xl">Reset your password </h1>
                <form className="flex flex-col gap-4" onSubmit={handlePasswordReset}>
                    <input type="text" required className="rounded-sm p-1 px-3" ref={email} />
                    <button className="bg-orange-300 p-1 rounded-md">Submit</button>
                <p  onClick={()=>{setRender(LoginForm)}} className=" cursor-pointer hover:underline text-sm" > {"<"} Back to Login</p>
                </form>
        </div>
    );

    return (
        <div className="w-dvw h-dvh flex justify-center items-center" style={{ backgroundImage: "url('authBackground.jpg')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
            {render }
        </div>
    );
}

export default SignIN;
