// import { useState } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrescriptionResult from "./pages/PrescriptionResult";
import PrescriptionHistory from "./pages/PrescriptionHistory";

import Landing from './pages/Landing'
import Upload from "./pages/Upload";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Landing />} />
          <Route path="/register" element={<Landing />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/prescription-result" element={<PrescriptionResult />} />
          <Route path="/prescription-history" element={<PrescriptionHistory />}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
