import React, { forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";

const Toast = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        show(options) {
          const { message = "Message Here!", type = "info", duration = 3000 } = options;
          toast[type](message, {
            position: "bottom-right",
            autoClose: duration,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            className: "scrapper-toast"
          });
        },
    }));

    return <div className="toastMessage" />;
});

export default Toast;