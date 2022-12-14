import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./routes";

function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 3000,
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
