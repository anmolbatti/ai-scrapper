import LayoutDashboard from "./LayoutDashboard";
import { useState, useRef, useEffect } from "react";
import { privateGet } from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const ScrappedData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    const toast = useRef(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const recordsPerPage = 20;

    const getData = async () => {
        try {
            const response = await privateGet(`/admin/get-scrapped-data?page=${currentPage}&limit=${recordsPerPage}`, navigate);

            if (response) {
                setData(response?.data);
                setTotalRecords(response?.total);
                setTotalPages(Math.ceil(response?.total/recordsPerPage))
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

    useEffect(() => {
        getData();
    }, [currentPage]);

    // Toggle the expanded state for a row
    const toggleExpand = (key) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <LayoutDashboard>
            <div className="dashboardWrapper">
                <div className="dashboard_main_inner">
                    <div className="dashboard_url_wrap scrapped_table">
                        <div className="dashboard_url_content">
                            <h2>Scrapped Data</h2>
                            <p>Here is a list of all scrapped urls</p>
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
                                        <th>Domain</th>
                                        <th>Url</th>
                                        <th>Records</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 && data.map((item, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div className="checkbox_wrap">
                                                    <input type="checkbox" name="item[]" value="1" />
                                                    <div className="Checkbox-visible"></div>
                                                </div>
                                            </td>
                                            <td>{new URL(item?.url || "").hostname}</td>
                                            <td>
                                                {item?.url ? (
                                                    <>
                                                        <span>
                                                            {expandedRows[key] ? item.url : item.url.substring(0, 50)}
                                                        </span>
                                                        {item.url.length > 50 && (
                                                            <span
                                                                style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                                                                onClick={() => toggleExpand(key)}
                                                            >
                                                                {expandedRows[key] ? 'Show Less' : 'Show More'}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td>{item?.bodyContent ? JSON.parse(item.bodyContent).length : ""}</td>
                                            <td><Link to={`/scrapped-data/${item._id}`}><Button label="View" /></Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data.length > 0 && (
                            <div className='pagination-container'>
                                <nav>
                                    <ol className="pagination_wrap">
                                        {currentPage > 1 && (

                                            <li data-page="prev" className="disable" onClick={() => setCurrentPage(currentPage -1)}>
                                                <span>
                                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.41 10.59L2.83 6L7.41 1.41L6 0L0 6L6 12L7.41 10.59Z" fill="black" />
                                                    </svg>
                                                </span>
                                            </li>
                                        )}
                                        
                                        {currentPage - 2 !== 0 && currentPage - 2 > 0 ? <li onClick={() => setCurrentPage(currentPage -2)}><span>{currentPage - 2}</span></li>  : ""}
                                        {currentPage - 1 !== 0  && currentPage - 1 > 0 ? <li onClick={() => setCurrentPage(currentPage -1)}><span>{currentPage - 1}</span></li>  : ""}

                                        <li className="active"><span>{currentPage}</span></li>

                                        {totalPages > (currentPage + 1) ? <li onClick={() => setCurrentPage(currentPage +1)}><span>{currentPage + 1}</span></li>  : ""}

                                        {totalPages > (currentPage + 2) ? <li onClick={() => setCurrentPage(currentPage +2)}><span>{currentPage + 2}</span></li>  : ""}
                                        {currentPage < (totalPages - 2) ? <li><span>...</span></li>  : ""}
                                        {currentPage !== totalPages ? <li onClick={() => setCurrentPage(totalPages)}><span>{totalPages}</span></li> : ""}

                                        {currentPage !== totalPages && (

                                            <li data-page="next" id="prev" onClick={() => setCurrentPage(currentPage +1)}>
                                                <span>
                                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.41 10.59L2.83 6L7.41 1.41L6 0L0 6L6 12L7.41 10.59Z" fill="black" />
                                                    </svg>
                                                </span>
                                            </li>
                                        )}
                                    </ol>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </LayoutDashboard>
    );
};

export default ScrappedData;
