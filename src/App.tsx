import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { DataProvider } from './data/DataContext'
import Budget from './pages/Budget'
import Dashboard from './pages/Dashboard'
import Guests from './pages/Guests'
import Ideas from './pages/Ideas'
import Meals from './pages/Meals'
import Tasks from './pages/Tasks'
import TablesPage from './pages/TablesPage'
import Timeline from './pages/Timeline'
import Vendors from './pages/Vendors'
import Venues from './pages/Venues'

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="invites" element={<Guests />} />
            <Route path="lieux" element={<Venues />} />
            <Route path="repas" element={<Meals />} />
            <Route path="prestataires" element={<Vendors />} />
            <Route path="budget" element={<Budget />} />
            <Route path="plan-de-table" element={<TablesPage />} />
            <Route path="planning-jour-j" element={<Timeline />} />
            <Route path="retroplanning" element={<Tasks />} />
            <Route path="idees" element={<Ideas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
