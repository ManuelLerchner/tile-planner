import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-stone-700 text-white">
      <h1 className="text-4xl font-bold">Tile Planner</h1>
      <div className="flex flex-row gap-4 items-center justify-center bg-white p-2 rounded-md hover:scale-105 my-12">
        <img
          className="w-6 h-6"
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google Logo"
        />
        <p
          className="text-md font-bold cursor-pointer text-black"
          onClick={login}
        >
          Login with Google
        </p>
      </div>
    </div>
  );
}
