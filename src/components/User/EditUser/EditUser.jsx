import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, } from "react";
import * as Yup from "yup"
import userService from "../../../services/user.service";
import { Button, Select, MenuItem, InputLabel, FormControl, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../../context/auth.context";
import { toast } from "react-toastify"
import { Formik } from "formik";
import editUserStyles from "./EditUserStyles.module.css"
export const EditUser = () => {
    const authContext = useAuthContext();
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState();
    const navigate = useNavigate(); 
    const initialValues = {
        id: 0,
        email: "",
        lastName: "",
        firstName: "",
        roleId: 3,
    };
    const [initialValueState, setInitialValueState] = useState(initialValues);
    const { id } = useParams();

    useEffect(() => {
        getRoles();
    }, []);

    useEffect(() => {
        if (id) {
        getUserById();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (user && roles.length) {
        const roleId = roles.find((role) => role.name === user?.role)?.id;
        setInitialValueState({
            id: user.id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            roleId,
            password: user.password,
        });
        }
    }, [user, roles]);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        roleId: Yup.number().required("Role is required"),
    });

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
        if (res) {
            setRoles(res);
        }
        });
    };

    const getUserById = () => {
        userService.getById(Number(id)).then((res) => {
        if (res) {
            setUser(res);
        }
        });
    };

    const onSubmit = (values) => {
        const updatedValue = {
        ...values,
        role: roles.find((r) => r.id === values.roleId).name,
        };
        userService
        .update(updatedValue)
        .then((res) => {
            if (res) {
            toast.success("Record updated successfully");
            navigate("/user");
            }
        })
        .catch((e) => toast.error("Record cannot be updated"));
    };
    return (
        <div className={editUserStyles.editUserWrapper}>
                <Typography variant="h4" sx={{fontWeight:"bold", color:"#414141"}}>Edit User</Typography>
                <div className={editUserStyles.underline}></div>
                <Formik
                initialValues={initialValueState}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}
                validator={() => ({})}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                    <div>
                        <div className={editUserStyles.twoFieldContainer}>
                            <div className={editUserStyles.singleField}>
                            First Name *
                            <TextField
                                id="first-name"
                                name="firstName"
                                variant="outlined"
                                inputProps={{ className: "small" }}
                                value={values.firstName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                size="small"
                                sx={{
                                    width:500,
                                    marginRight:5,
                                    marginBottom:5                                
                                }}
                            />
                            <span>
                                {errors.firstName && touched.firstName}
                            </span>
                            </div>
                            <div className={editUserStyles.singleField}>
                            Last Name *
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id="last-name"
                                name="lastName"
                                value={values.lastName}
                                variant="outlined"
                                size="small"
                                sx={{
                                    width:500,
                                    marginRight:5,
                                    marginBottom:5
                                }}
                            />
                            <span>
                                {errors.lastName && touched.lastName}
                            </span>
                            </div>
                        </div>
                        <div className={editUserStyles.twoFieldContainer}>
                            <div className={editUserStyles.singleField}>
                            Email *
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id="email"
                                name="email"
                                value={values.email}
                                variant="outlined"
                                inputProps={{ className: "small" }}
                                size="small"
                                sx={{
                                    width:500,
                                    marginRight:5,
                                    marginBottom:5 
                                }}
                            />
                            <span>
                                {errors.email && touched.email}
                            </span>
                            </div>
                            {values.id !== authContext.user.id && (
                            <div className={editUserStyles.singleField}>
                            Role*
                            <FormControl
                                variant="outlined"
                                disabled={values.id === authContext.user.id}
                                size="small"
                                sx={{
                                    width:500,
                                    marginRight:5,
                                    marginBottom:5
                                }}
                                >
                                {/* <InputLabel htmlFor="select">Roles</InputLabel> */}
                                <Select
                                    name="roleId"
                                    id={"roleId"}
                                    onChange={handleChange}
                                    disabled={values.id === authContext.user.id}
                                    value={values.roleId}
                                >
                                    {roles.length > 0 &&
                                    roles.map((role) => (
                                        <MenuItem value={role.id} key={"name" + role.id}>
                                        {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                </FormControl>
                            </div>
                            )}
                        </div>
                       
                    </div>
                    <div >
                        <Button
                        variant="contained"
                        type="submit"
                        disableElevation
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
                        type="button"
                        disableElevation
                        onClick={() => {
                            navigate("/user");
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
}
// export const EditUser = () => {
//     return(<h1>Edit User</h1>)
// }