import LayoutDashboard from "./LayoutDashboard";
import { useState, useRef, useEffect } from "react";
import { privateGet } from "../../utils/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const ScrappedData = () => {
    const [data, setData] = useState([]);
    const [apiRes, setApiRes] = useState([]);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    const toast = useRef(null);
    const {id} = useParams();
    const navigate = useNavigate();

    const getData = async () => {
        try {
            const response = await privateGet(`/admin/get-scrapped-data/${id}`, navigate);

            if (response) {
                setData(response?.data ? JSON.parse(response?.data?.bodyContent) : []);
                setFields(response?.data ? response?.data?.fields : []);
                console.log("response?.data: ", response?.data);
                setApiRes(response?.data);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error while scrapping the url: ", err);
            toast.current.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message, life: 3000 });
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
                            <h2>Scrapped Data</h2>
                            <p>{(!loading && apiRes?.url) && new URL(apiRes.url).hostname}</p>
                        </div>
                        <div className="dashboard_table_wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="checkbox_wrap">
                                                <input type="checkbox" name="checkAll" />
                                                <div className="Checkbox-visible"></div>
                                            </div>
                                        </th>
                                        {fields.length > 0 && fields.map((item, key) => (
                                            <th>{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 && data.map((dataItem, dataKey) => (
                                        <tr key={dataKey}>
                                            <td>
                                                <div className="checkbox_wrap">
                                                    <input type="checkbox" name="item[]" value="1" />
                                                    <div className="Checkbox-visible"></div>
                                                </div>
                                            </td>
                                            
                                            {fields.length > 0 && fields.map((item, key) => (
                                                <td>{dataItem[item]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* <div className='pagination-container'>
                            <nav>
                                <ol className="pagination_wrap">
                                    <li data-page="prev" className="disable">
                                        <span>
                                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.41 10.59L2.83 6L7.41 1.41L6 0L0 6L6 12L7.41 10.59Z" fill="black" />
                                            </svg>
                                        </span>
                                    </li>
                                    <li className="active"><span>1</span></li>
                                    <li><span>2</span></li>
                                    <li><span>3</span></li>
                                    <li><span>...</span></li>
                                    <li><span>20</span></li>
                                    <li data-page="next" id="prev">
                                        <span>
                                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.41 10.59L2.83 6L7.41 1.41L6 0L0 6L6 12L7.41 10.59Z" fill="black" />
                                            </svg>
                                        </span>
                                    </li>
                                </ol>
                            </nav>
                        </div> */}
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </LayoutDashboard>
    );
};

export default ScrappedData;
