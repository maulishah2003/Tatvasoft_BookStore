import { useEffect, useState } from "react";
// import { defaultFilter, RecordsPerPage } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import { defaultFilter, RecordsPerPage } from "../../constants/constant"
import DialogBox from "../DialogBox/DialogBox";
import { 
    Typography,
    Table,
    TableCell,
    TableBody,
    TableRow,
    TableHead,
    TableContainer,
    TextField,
    Button,
    TablePagination
 } from "@mui/material";
import categoryService from "../../services/category.service";
import { toast } from "react-toastify";
import categoryStyles from "./CategoryStyles.module.css";

export const Category = () => {
  const [filters, setFilters] = useState(defaultFilter);
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };

  const columns = [{ id: "name", label: "Category Name", minWidth: 100 }];

  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success("Record deleted successfully");
        setOpen(false);
        setFilters({ ...filters });
      })
      .catch((e) => toast.error("Record cannot be deleted"));
  };
  return (
    <div className={categoryStyles.categoryWrapper}>
        <Typography variant="h4" 
        sx={{
            fontWeight:"bold", 
            color:"#414141"
        }}    
        >Category</Typography>
        <div className={categoryStyles.underline}></div>
        <div className={categoryStyles.addAndSearch}>
          <TextField
            id="text"
            name="text"
            placeholder="Search..."
            variant="outlined"
            inputProps={{ className: "small" }}
            onChange={(e) => {
              setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
            }}
            size="small"
            sx={{
                width:"30%"
            }}
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => navigate("/add-category")}
            sx={{
            width:100, 
            height:37, 
            backgroundColor:"#f14d54", 
            textTransform:"capitalize", 
            fontSize:15,
            '&:hover': {
                borderColor:"#FD1823",
                backgroundColor: '#FD1823', // Example background color on hover
                color: 'white', // Example text color on hover
            },                      
            }}
          >
            Add
          </Button>
        </div>
        <TableContainer align="center">
          <Table sx={{ width: 1000 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    sx={{fontWeight:"bold", fontSize:15}}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryRecords?.items?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">
                    <Button
                    type="button"
                    onClick={() => {
                        navigate(`/edit-category/${row.id}`);
                    }}
                    variant="outlined"
                    sx={{
                    marginRight:5,
                    textTransform:"capitalize",
                    border:1,
                    borderColor:"#80BF32",
                    color:"#80BF32",
                    width: 100,
                    '&:hover': {
                        borderColor:"#80BF32",
                        backgroundColor: '#80BF32', // Example background color on hover
                        color: 'white', // Example text color on hover
                        },     
                    }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setOpen(true);
                        setSelectedId(row.id ?? 0);
                      }}
                      variant="outlined"
                    sx={{
                        marginRight:5,
                        textTransform:"capitalize",
                        border:1,
                        borderColor:"#f14d54",
                        color:"#f14d54",
                        width: 100,
                        '&:hover': {
                        borderColor:"#f14d54",
                        backgroundColor: '#f14d54', 
                        color: 'white', 
                        },                      
                    }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!categoryRecords?.items.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center">
                      No Category
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={categoryRecords?.totalItems || 0}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        <DialogBox
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete category"
          description="Are you sure you want to delete this category?"
        />
      </div>
  );
};
