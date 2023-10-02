import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Theme } from '@radix-ui/themes';

import '@radix-ui/themes/styles.css';

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <html>
      <body>
      <Theme appearance="dark">
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<h1>About</h1>} />
            </Routes>
          </Router>
        </Theme>
      </body>
    </html>
  )
}


export default App;
