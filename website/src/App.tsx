import './App.css';
import { Routes, Route } from "react-router-dom";
import { SidebarLeft } from './containers/sidebarleft/SidebarLeft';
import { MainView } from './containers/mainview/mainView';
import { Modal } from './containers/modal/model';

export default function App() {

    return (
        <Routes>
            <Route path="/" element={
                <>
                    <SidebarLeft />        
                    <MainView />
                    <Modal />
                </>
            } />
        </Routes>
    );
}
