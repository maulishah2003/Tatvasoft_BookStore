import { useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup"
import categoryService from "../../../services/category.service";
import bookService from "../../../services/book.service";
import { Formik } from "formik";
import { Input } from "@mui/material";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { TextField, Select, Button, FormControl, InputLabel, MenuItem, Typography } from "@mui/material"
import editBookStyles from "./EditBookStyles.module.css"
export const EditBook = () => {
    const [categories, setCategories] = useState([]);
    const initialValues = {
        name: "",
        description: "",
        categoryId: 0,
        price:"",
        base64image:"",
    };
    const [initialValueState, setInitialValueState] = useState(initialValues);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if(id) getBookById();
        categoryService.getAll().then((res) => {
            setCategories(res);
        });
    },[]);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Book Name is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.number()
        .min(1,"Category is required")
        .required("Category is required"),
        price: Yup.number().required("Price is required"),
        base64image: Yup.string().required("Image is required"),

    });
    const getBookById = () => {
        bookService.getById(Number(id)).then((res) => {
            setInitialValueState({
                id: res.id,
                name: res.name,
                price: res.price, 
                categoryId: res.categoryId,
                description: res.description,
                base64image: res.base64image,
            });
        });
    };
    const onSubmitEdit = (values) => {
        console.log(values);
        bookService
        .save(values)
        .then((res) => {
            toast.success(
            values.id
                ? "Record created successfully"
                : "Record created successfully"
            );
            navigate("/booklisting");
        })
        .catch((e) => toast.error("Record cannot be updated"));
    };
    const onSelectFile = (e, setFieldValue, setFieldError) => {
        const files = e.target.files;
        if (files?.length) {
            const fileSelected = e.target.files[0];
            const fileNameArray = fileSelected.name.split(".");
            const extension = fileNameArray.pop();
            if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
                if (fileSelected.size > 50000) {
                    toast.error("File size must be less then 50KB");
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(fileSelected);
                reader.onload = function () {
                    setFieldValue("base64image", reader.result);
                };
                reader.onerror = function (error) {
                throw error;
                };
            } else {
                toast.error("only jpg,jpeg and png files are allowed");
            }
            } else {
            setFieldValue("base64image", "");
        }
      };
    return(
        <div className={editBookStyles.editBookWrapper}> 
            <Typography 
            variant="h4"
            sx={{
                fontWeight:"bold", 
                color:"#414141"}}
            >
                Edit Book
            </Typography>
            <div className={editBookStyles.underline}></div>      
            <Formik
            initialValues={initialValueState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={onSubmitEdit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setValues,
                    setFieldError,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className={editBookStyles.fieldsWrapper}>
                            <div className={editBookStyles.twoTextFieldContainer}>
                                <div className={editBookStyles.singleTextField}>
                                    <div>Book Name*</div>
                                    <TextField
                                        name="name"
                                        variant="outlined"
                                        value={values.name}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="small"
                                        sx={{
                                            width:500,
                                            marginRight:5
                                        }}
                                    />
                                    <span style={{
                                        color:"red",
                                        fontSize:13
                                    }}
                                    >
                                        {touched.name && errors.name}
                                    </span>
                                </div>
                                <div>
                                    <div>Price*</div>
                                    <TextField
                                        name="price"
                                        variant="outlined"
                                        value={values.price}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
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
                                        {touched.price  && errors.price}
                                    </span>
                                </div>
                            </div>
                            <div className={editBookStyles.twoTextFieldContainer}>
                                <div className={editBookStyles.description}>
                                Category*
                                <FormControl 
                                variant="outlined"
                                size="small"
                                sx={{
                                    width:500,
                                    marginRight:5
                                }}>
                                    <Select
                                    name={"categoryId"}
                                    id={"category"}
                                    onChange={handleChange}
                                    value={values.categoryId}
                                    >
                                    {categories?.map((rl) => (
                                        <MenuItem value={rl.id} key={"category" + rl.id}>
                                        {rl.name}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                </div>
                                <div style={{
                                    width:500
                                }}>
                                {!values.base64image && (
                                    <Input
                                        type="file"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            onSelectFile(e, setFieldValue, setFieldError);
                                        }}
                                        sx={{
                                            width:500,
                                            marginTop:3
                                        }}
                                    />
                                )}
                                    
                                    {values.base64image && (
                                        <div>
                                            <img style={{width:30}} src={values.base64image} alt="" />
                                        {" "}image{" "}
                                        <span
                                        style={{cursor:"pointer", fontSize:20}}
                                            onClick={() => {
                                            setFieldValue("base64image", "");
                                            }}
                                        >
                                            x
                                        </span>
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                            <div>
                                <div className={editBookStyles.description}>
                                    <TextField
                                        name="description"
                                        label="Description"
                                        variant="outlined"
                                        value={values.description}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        sx={{
                                            // width:1000,
                                            '& .MuiInputBase-input': {
                                                width:1015,
                                                height: '50px',
                                            },
                                        }}
                                    />
                                    <span style={{
                                        color:"red",
                                        fontSize:13
                                    }}
                                    >
                                        {touched.description && errors.description}
                                    </span>
                                </div>
                            </div>
                            <div>
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
                                type="button"
                                onClick={() => {
                                    navigate("/bookdetails");
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
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}