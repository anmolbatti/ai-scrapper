import { useEffect, useState, useRef } from "react";
import Layout from "./Layout";
import { Link, useNavigate } from 'react-router-dom';
import { publicPost } from "../../utils/axios";
// import { Toast } from 'primereact/toast';
import Toast from "../../components/Toast";

const Login = () => {
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem("token");

    const signIn = async (e) => {
        e.preventDefault();

        if(email === "" || password === ""){
            toastRef.current.show({
                type: "error",
                message: "Email and password required!"
            });

            return false;
        }

        try {
            const user = await publicPost("/admin/login", {email, password}, navigate);
            if(user.status){
                toastRef.current.show({
                    type: "success",
                    message: "Logged In Successfully!"
                });

                localStorage.setItem("token", user.token)
                return navigate("/dashboard");
            }
        } catch (err) {
            console.log("err?.response?.data?.message: ",err?.response);
            toastRef.current.show({
                type: "error",
                message: err?.response?.data?.message || "An error occurred!"
            });
            console.error("Error while creating new user: ", err?.response);
        }
    }

    useEffect(() => {
        if(token){
            navigate("/dashboard");
        }
    }, [token])

    return (
        <Layout>
            <div className="loginWrapper">
                <section className="login">
                    <div className="login_box">
                        <div className="left">
                            <div className="contact">
                            <h3>ai scrapper</h3>
                                <form onSubmit={signIn}>
                                <div className="contact_title">
                                <h4>Sign In</h4>
                                <p>Access the Ai Scrapper panel using your email and passcode.</p>
                                </div>
                                <div className="login_field_wrap">
                                <div className="field_items">
                                    <label>Email Address</label>
                                    <div className="field_items_inner">
                                    <input 
                                        type="text" 
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="icon_wrap">
                                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_165_416)">
                                        <g clipPath="url(#clip1_165_416)">
                                        <g clipPath="url(#clip2_165_416)">
                                        <path d="M11.5 0H1.5C0.810625 0 0.25 0.560625 0.25 1.25V8.75C0.25 9.43937 0.810625 10 1.5 10H11.5C12.1894 10 12.75 9.43937 12.75 8.75V1.25C12.75 0.560625 12.1894 0 11.5 0ZM11.5 1.25V1.56938L6.5 5.45875L1.5 1.57V1.25H11.5ZM1.5 8.75V3.1525L6.11625 6.74312C6.22569 6.82909 6.36083 6.87582 6.5 6.87582C6.63917 6.87582 6.77431 6.82909 6.88375 6.74312L11.5 3.1525L11.5013 8.75H1.5Z" fill="#637381"/>
                                        </g>
                                        </g>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_165_416">
                                        <rect width="13" height="10" fill="white"/>
                                        </clipPath>
                                        <clipPath id="clip1_165_416">
                                        <rect width="13" height="10" fill="white"/>
                                        </clipPath>
                                        <clipPath id="clip2_165_416">
                                        <rect width="13" height="10" fill="white"/>
                                        </clipPath>
                                        </defs>
                                        </svg>
                                    </div>
                                    </div>
                                    </div>
                                    <div className="field_items">
                                    <label>Password</label>
                                    <div className="field_items_inner">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                     <div className="icon_wrap" onClick={() => setShowPassword(!showPassword)}>
                                        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.00488 10.2812C9.20801 10.2812 9.43652 10.2812 9.66504 10.2305L10.96 11.2461C10.3252 11.3984 9.66504 11.5 9.00488 11.5C5.88184 11.5 3.13965 9.69727 1.76855 7.00586C1.71777 6.9043 1.69238 6.77734 1.69238 6.625C1.69238 6.49805 1.71777 6.37109 1.76855 6.26953C2.02246 5.76172 2.35254 5.30469 2.70801 4.84766L5.37402 6.9043C5.50098 8.80859 7.0752 10.2812 9.00488 10.2812ZM16.9521 11.7793C17.0537 11.8555 17.1045 11.957 17.1045 12.084C17.1045 12.1855 17.0791 12.2617 17.0283 12.3379L16.5459 12.9727C16.4697 13.0742 16.3428 13.125 16.2158 13.125C16.1143 13.125 16.0381 13.0996 15.9619 13.0488L1.03223 1.49609C0.930664 1.41992 0.879883 1.31836 0.879883 1.19141C0.879883 1.08984 0.905273 1.01367 0.956055 0.9375L1.46387 0.302734C1.51465 0.201172 1.6416 0.150391 1.76855 0.150391C1.87012 0.150391 1.94629 0.175781 2.02246 0.226562L5.24707 2.71484C6.36426 2.10547 7.63379 1.77539 9.00488 1.75C12.1025 1.75 14.8447 3.57812 16.2158 6.26953C16.2666 6.37109 16.292 6.49805 16.292 6.65039C16.292 6.77734 16.2666 6.9043 16.2158 7.00586C15.708 7.99609 14.9971 8.88477 14.1592 9.5957L16.9521 11.7793ZM12.3057 8.17383C12.5088 7.69141 12.6611 7.18359 12.6611 6.625C12.6611 4.61914 11.0107 2.96875 9.00488 2.96875C8.11621 2.99414 7.30371 3.29883 6.66895 3.83203L8.54785 5.25391C8.57324 5.17773 8.57324 5.10156 8.59863 5C8.57324 4.74609 8.49707 4.49219 8.34473 4.28906C8.57324 4.23828 8.80176 4.1875 9.03027 4.1875C10.3506 4.1875 11.4424 5.2793 11.4424 6.59961C11.4424 6.625 11.4424 6.625 11.4424 6.625C11.417 6.9043 11.3916 7.1582 11.29 7.38672L12.3057 8.17383Z" fill="#939EA8"/>
                                        </svg>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    <div className="form_remember_wrap">
                                        <div className="form_remem_item">
                                            <div className="form_remem_inner">
                                                <input type="checkbox"/>
                                                <label>Remember me</label>
                                            </div>
                                        </div>
                                        <div className="form_remem_item">
                                            <div className="form_btn_inner">
                                                {/* <span className="forget_btn">Forgot Password?</span> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="submit_wrap">
                                        <button className="submit">Sign In</button>
                                        <p>New on our platform? <Link to={"/signup"}>Create an account</Link></p> 
                                    </div>
                                </form>
                                <div className="copyright_wrap">
                                    <p>Copyright © 2024 <a hre="">AI SCRAPPER</a>. All rights reserved</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                           
                        </div>
                    </div>
                </section>
            </div>
            <Toast ref={toastRef}/>
        </Layout>
    );
}

export default Login;