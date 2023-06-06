import { useContext, useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useAuthContext, AuthContext } from "../../context/auth.context";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service";
import updateProfileStyles from "./UpdateProfileStyles.module.css";
export const UpdateProfile = () => {
    const { user } = useContext(AuthContext);
    const authContext = useAuthContext();
    const navigate = useNavigate();
  

  const initialValueState = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    newPassword: "",
    confirmPassword: ""
  }

  // const [initialValueState, setinitialValueState] = useState({
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     newPassword: "",
  //     confirmPassword: ""
  //   }
  // );
  const [updatePassword, setUpdatePassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    newPassword: Yup.string().min(5, "Minimum 5 charactor is required"),
    confirmPassword: updatePassword
      ? Yup.string()
          .required("Must required")
          .oneOf([Yup.ref("newPassword")], "Passwords is not match")
      : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
  });

  const onSubmit = async (values) => {
        const password = values.newPassword ? values.newPassword : user.password;
        delete values.confirmPassword;
        delete values.newPassword;
        const data = Object.assign(user, { ...values, password });
        delete data.__v;
        delete data._id;
        console.log(data); 
        const res = await userService.updateProfile(data);
        if (res) {
            authContext.setUser(res);
            toast.success("Record updated successfully");
            navigate("/");
        }
  };

  return (
    <div className={updateProfileStyles.updateProfileWrapper}>
            <Typography variant="h4" sx={{fontWeight:"bold", color:"#414141"}}>Update Profile</Typography>
            <div className={updateProfileStyles.underline}></div>
            <Formik
            initialValues={initialValueState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={onSubmit}
            // validator={() => ({})}
            >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
            }) => (
                <form  onSubmit={handleSubmit}>
                    <div className={updateProfileStyles.twoTextFieldsContainer}>
                        <div className={updateProfileStyles.singleTextFieldContainer}>
                            First Name *
                            <TextField
                            id="first-name"
                            name="firstName"
                            variant="outlined"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                            sx={{
                                width:500,
                            }}
                            />
                            <span style={{
                                color:"red",
                                fontSize:13
                            }}
                            >
                                {touched.firstName && errors.firstName}
                            </span>
                        </div>
                        <div className={updateProfileStyles.singleTextFieldContainer}>
                            Last Name *
                            <TextField
                            id="last-name"
                            name="lastName"
                            variant="outlined"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                            sx={{
                                width:500,
                            }}
                            />
                            <span style={{
                                color:"red",
                                fontSize:13
                            }}
                            >
                                {touched.lastName && errors.lastName}
                            </span>
                        </div>
                    </div>
                    <div className={updateProfileStyles.twoTextFieldsContainer}>
                        <div className={updateProfileStyles.singleTextFieldContainer}>
                            Email *
                            <TextField
                            id="email"
                            name="email"
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                            sx={{
                                width:500,
                            }}
                            />
                            <span style={{
                                color:"red",
                                fontSize:13
                            }}
                            >
                                {touched.email && errors.email}
                            </span>
                        </div>
                        <div className={updateProfileStyles.singleTextFieldContainer}>
                            New Password *
                            <TextField
                            id="newPassword"
                            name="newPassword"
                            variant="outlined"
                            value={values.newPassword}
                            onChange={(e) => {
                                e.target.value !== ""
                                ? setUpdatePassword(true)
                                : setUpdatePassword(false);
                                handleChange(e);
                            }}
                            onBlur={handleBlur}
                            size="small"
                            sx={{
                                width:500,
                            }}
                            />
                            <span style={{
                                color:"red",
                                fontSize:13
                            }}
                            >
                                {touched.newPassword && errors.newPassword}
                            </span>
                        </div>
                    </div>
                    <div className={updateProfileStyles.twoTextFieldsContainer}>
                        <div className={updateProfileStyles.singleTextFieldContainer}>
                            Confirm Password *
                            <TextField
                            id="confirmPassword"
                            name="confirmPassword"
                            variant="outlined"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="small"
                            sx={{
                                width:500,
                            }}
                            />
                            <span style={{
                                color:"red",
                                fontSize:13
                            }}
                            >
                                {touched.confirmPassword && errors.confirmPassword}
                            </span>
                        </div>
                    </div>
                    <div >
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor:"#80BF32",
                                width:100,
                                height:40,
                                marginRight:1,
                                textTransform:"capitalize",
                                fontSize:17,
                                '&:hover': {
                                backgroundColor: '#548814', // Adjust the desired background color on hover
                                color: 'white', // Adjust the desired text color on hover
                                },
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={() => {
                            navigate("/");
                        }}
                        sx={{
                            backgroundColor:"#f14d54",
                            width:100,
                            height:40,
                            textTransform:"capitalize",
                            fontSize:17,
                            '&:hover': {
                                backgroundColor: '#FF101B', // Adjust the desired background color on hover
                                color: 'white', // Adjust the desired text color on hover
                            },
                        }}
                        >
                        Cancel
                    </Button>
                    </div>
                </form>
            )}
            </Formik>
    </div>
  );
};
