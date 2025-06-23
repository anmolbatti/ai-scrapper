import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";

const Layout = ({children}) => {
    return (
        <div className="main-wrapper">
            {/* <Header /> */}
                {children}
            {/* <Footer /> */}
        </div>

    );
}

export default Layout;