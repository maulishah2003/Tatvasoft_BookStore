import { TextField, Typography, Select, MenuItem, Input, InputAdornment, Button } from "@mui/material"
import addBookStyles from "./AddBookStyles.module.css"
import { Field, Formik } from "formik"
import * as Yup from "yup"
import { useEffect, useState } from "react"
import categoryService from "../../services/category.service"
import bookService from "../../services/book.service"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
    export const AddBook = () => {
    // const [categories, setCatogries] = useState([]);
    // useEffect(()=>{
    //     getAllCategories();
    // });
    const [image, setImage] = useState();
    const navigate = useNavigate();
    const categories = [
        {
          "id": 2,
          "name": "Horror",
        },
        {
          "id": 3,
          "name": "Literature",
        },
        {
          "id": 4,
          "name": "Science & technology",
        },
        {
          "id": 5,
          "name": "Self improvements",
        },
        {
          "id": 6,
          "name": "Business",
        },
        {
          "id": 7,
          "name": "IT",
        },
        {
          "id": 8,
          "name": "Test Category",
        },
        {
            "id": 9,
            "name": "New Update Category",
        },
        {
            "id": 10,
            "name": "Love Story",
        },
        {
            "id": 11,
            "name": "Tourist Place",
        },
      ]
    const uploadImage = async (e) => {
        console.log(e.target.files);
        const file = e.target.files[0];
        setImage(await convertBase64(file));
    }
    const convertBase64 = (file) => {
        console.log(file);
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    const redirectToBookListing = () => {
        navigate("/booklisting");
    }
    const initialValues = {
        name:"",
        description:"",
        price: 0,
        categoryId:8,
        base64image: null
    };
    const onFormSubmit = async (values) => {
        const encodedImage = image;
        const requestData = {
            name:values.name,
            description:values.description,
            price:values.price,
            categoryId:values.categoryId,
            base64image:`${encodedImage}`
        }
        console.log(requestData);

        await bookService.addBook(requestData).then((res) => {
            navigate("/booklisting");
            toast.success("Book Added Successfully");       
        });
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Book name is Required"),
        price: Yup.number().required("Price is required"),
        description: Yup.string().required("Description is required")
    });
    return(
        <div className={addBookStyles.addBookWrapper}>            
            <Typography 
            variant="h4" 
            sx={{
                fontWeight:"bold", 
                color:"#414141"}}
            >
                Add Book
            </Typography>
            <div className={addBookStyles.underline}></div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit}
            >
            {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
                <form onSubmit={handleSubmit}>
                    <div className={addBookStyles.fieldsWrapper}>
                        <div className={addBookStyles.twoTextFieldContainer}>
                            <div className={addBookStyles.description}>
                                Book Name*
                                <TextField 
                                name="name" 
                                placeholder="Book Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small"
                                sx={{
                                    width:500,
                                    marginRight:5
                                }}
                                ></TextField>
                            </div>
                            <div className={addBookStyles.description}>
                            Price*
                                <TextField 
                                name="price" 
                                placeholder="Price"
                                value={values.price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small"
                                sx={{
                                    width:500,
                                }}></TextField>
                            </div>
                        </div>
                        
                        <div className={addBookStyles.twoTextFieldContainer}>
                            <div 
                            className={addBookStyles.description}
                            style={{
                                marginLeft:35
                            }}
                            >
                                Category
                                <Select
                                    name="categoryId"
                                    value={values.categoryId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    size="small"
                                    sx={{
                                        // marginLeft:5,
                                        width:500,
                                        marginRight:5
                                    }}  
                                >
                                    {categories.map((bookcategory,index) => (
                                        <MenuItem key={index} value={bookcategory.id}>{bookcategory.name}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div 
                            // className={addBookStyles.description}
                            >
                            <Input
                                value={values.base64image} 
                                name="base64image"
                                type="file"
                                variant="outlined"
                                sx={{
                                    width:500,
                                    marginRight:5,
                                    marginTop:3
                                }}
                                    onChange={(e) => uploadImage(e)}
                            />
                            </div>
                        </div>   
                         
                        <div>
                            <div className={addBookStyles.description}>
                            Description*
                            <TextField 
                            name="description" 
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // size="small"
                            sx={{
                                // width:1000,
                                '& .MuiInputBase-input': {
                                    width:1015,
                                    height: '50px',
                                },
                            }}
                            ></TextField>
                            </div>
                            
                        </div>          
                        <div>
                            <Button 
                            variant="contained"
                            align="left"
                            type="submit"
                            sx={{
                                backgroundColor:"#80BF32",
                                width:100,
                                height:40,
                                marginRight:5,
                                textTransform:"capitalize",
                                fontSize:17,
                                '&:hover': {
                                    backgroundColor: '#548814', // Adjust the desired background color on hover
                                    color: 'white', // Adjust the desired text color on hover
                                },
                            }}
                            >Save</Button>
                            <Button
                            variant="contained"
                            onClick={redirectToBookListing}
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