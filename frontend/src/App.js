import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {HelloWorldPage} from "./pages/HelloWorldPage";
import {HelloNamePage} from "./pages/HelloNamePage";
import {Layout} from "./components/Layout";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path={'/hello_name/'} element={<HelloNamePage/>}/>
                    <Route path={'*'} element={<HelloWorldPage/>}/>
                </Route>
            </Routes>
        </Router>
    );
}