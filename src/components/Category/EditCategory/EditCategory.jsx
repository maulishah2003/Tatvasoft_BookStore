import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import categoryService from "../../../services/category.service";
import { 
    Typography, 
    TextField,
    Button
} from "@mui/material";
import editCategoryStyles from "./EditCategoryStyles.module.css"

export const EditCategory = () => {
  const navigate = useNavigate();
  const initialValues = { name: "" };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });

  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const onSubmit = (values) => {
    categoryService
      .save(values)
      .then((res) => {
        toast.success("Record updated successfully");
        navigate("/category");
      })
      .catch((e) => toast.error("Record cannot be updated"));
  };
  return (
    <div className={editCategoryStyles.editCategoryWrapper}>
        <Typography variant="h4"
        sx={{
          fontWeight:"bold", 
          color:"#414141"
        }}
        >{id ? "Edit" : "Add"} Category</Typography>
        <div className={editCategoryStyles.underline}></div>
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
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
                <div className={editCategoryStyles.textFieldWrapper}>
                  <div>
                    
                  </div>
                  Category Name *
                  <TextField
                    id="first-name"
                    name="name"
                    variant="outlined"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      width:"600px"
                    }}
                  />
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
                  navigate("/category");
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
