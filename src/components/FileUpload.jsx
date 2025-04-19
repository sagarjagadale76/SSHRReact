import React, { Component } from "react";
import axios from "axios";
import styles from "./FileUpload.module.css";
import  ReactDOM  from "react-dom/client";
//import  "./ShippingDetails";
import ShippingDetails from "./ShippingDetails";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
export default class FileUpload extends Component {
    state = {
        fileToUpload: undefined,
        uploadSuccess: undefined,
        error: undefined
    };

    

    uploadFile() {
        // Getting the signed url
        axios(
            {
                method: "GET",
                url: "https://3tv7s8t8tj.execute-api.eu-west-2.amazonaws.com/dev/signedurl?fileName=" +
                this.state.fileToUpload.name,
                headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
            }            
        ).then(response => {
            // Getting the url from response
            const url = response.data.uploadUrl;

            axios({
                method: "PUT",
                url: url,
                data: this.state.fileToUpload,
                headers: { "Content-Type": "multipart/form-data" }
            })
                .then(res => {
                    this.setState({
                        uploadSuccess: "File upload successfull",
                        error: undefined
                    });
                })
                .catch(err => {
                    this.setState({
                        error: "Error Occured while uploading the file",
                        uploadSuccess: undefined
                    });
                });
        });
    }

    render() {
        return (
            <div className={styles.fileUploadCont}>
                <div className={styles.header}>
                    File Upload to S3 with Lambda, And React axios Application
                </div>
                <div>
                    <form>
                        <div className="form-group">
                            <input
                                type="file"
                                className="form-control-file"
                                id="fileUpload"
                                onChange={e => {
                                    this.setState({
                                        fileToUpload: e.target.files[0]
                                    });
                                }}
                            />
                            {this.state.fileToUpload ? (
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={e => {
                                        // this.uploadFile();
                                        debugger;
                                        // <Router>
                                        //     <Routes>
                                        //         <Route  path="/ShippingDetails" />
                                        //     </Routes>
                                        // </Router>

                                        root.render(<ShippingDetails></ShippingDetails>);
                                    }}
                                >
                                    Upload your file
                                </button>
                            ) : null}

                            <div>
                                <span>
                                    {this.state.uploadSuccess
                                        ? "File Upload Successfully"
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
