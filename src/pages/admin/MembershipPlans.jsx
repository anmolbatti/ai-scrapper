import LayoutDashboard from "./LayoutDashboard";
import { useState, useRef, useEffect } from "react";
import { privateGet } from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

const MembershipPlans = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toastRef = useRef();

    const getData = async () => {
        try {
            const response = await privateGet(`/admin/memberships`, navigate);

            if (response) {
                setData(response?.data);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error while scrapping the url: ", err);
            toastRef.current.show({
                type: "error",
                message: "Membership Plans not found!"
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <LayoutDashboard>
            <div className="dashboardWrapper">
                <div className="dashboard_main_inner">
                    <div className="dashboard_url_wrap scrapped_table">
                        <div className="dashboard_url_content">
                            <h2>Membership Plans</h2>
                            <p>Here is a list of all membership plans</p>
                        </div>
                        <div className="dashboard_memberships_wrap">
                            {data.length > 0 && data.map(item => (
                                <div className="singleMembership">
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                    <h4>${item.price} per {item.durationType}</h4>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toastRef} />
        </LayoutDashboard>
    );
};

export default MembershipPlans;
