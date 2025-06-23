import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import Sidebar from "../../components/admin/Sidebar";

const LayoutDashboard = ({children}) => {
    return (
        <div className="main-wrapper">
            <div className="main_header_wrap">
            <Header />
                <Sidebar />
                </div>
                {children}
            <Footer />
        </div>

    );
}

export default LayoutDashboard;