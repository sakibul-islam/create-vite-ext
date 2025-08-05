import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import "@/styles/App.css";

type Props = {
  entryFile: string;
};

function App({ entryFile }: Props) {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">
      <div className="flex justify-center mb-4">
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={viteLogo}
            className='logo h-24 p-4'
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            className='logo h-24 p-4'
            alt='React logo'
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold">Vite + React</h1>
      <div className="p-8">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code className="bg-gray-700 px-1 rounded text-white">{entryFile}</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
