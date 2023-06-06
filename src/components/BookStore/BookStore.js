import bookService from "../../services/book.service";
import categoryService from "../../services/category.service";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { Button, TablePagination, TextField, Typography } from "@mui/material";
import bookPageStyles from "./bookPageStyles.module.css"
import { RoutePaths } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import DialogBox from "../DialogBox/DialogBox";
import { RecordsPerPage, defaultFilter } from "../../constants/constant";
export const BookStore = () => {

    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState(defaultFilter);
    const [bookRecords, setBookRecords] = useState({
        pageIndex: 0,
        pageSize: 10, 
        totalPages: 1,
        items: [],
        totalItems: 0,
    });
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getAllCategories();
    },[]);
    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if(res){
                setCategories(res);
            }
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if(filters.keyword === "") delete filters.keyword;
            searchAllBooks({...filters});
        },500);
        return() => clearTimeout(timer);
    },[filters]);
    const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
            setBookRecords(res);
        });
    };
    const onConfirmDelete = () => {
        bookService.deleteBook(selectedId).then((res) => {
            toast.success("Book deleted successfully");
            setOpen(false);
            setFilters({...filters, pageIndex:1});
        }).catch((e) => toast.error("Record cannot be Deleted"));
    };
    const getAllBooks = async() => {
        await bookService.getAllBooks().then((res) => {
            if(res){
                setBooks(res);
            }
        });
    }
    const redirectToAddBookPage = () => {
        navigate("/addbook");
    }
    const deleteBook = async (id) => {
        console.log("deleteBook Called...:",id);
        // await bookService.deleteBook(id).then((res) => {
        //     console.log(res);
        //     toast.success("Book Deleted Successfully...");
        // });
    }
    return(
        <div className={bookPageStyles.bookPageWrapper}>
            <Typography 
            variant="h4" 
            sx={{
                fontWeight:"bold", 
                color:"#414141"
            }}>Book Page</Typography>
            <div className={bookPageStyles.underline}></div>
            <div className={bookPageStyles.addAndSearch}>
                <TextField 
                variant="outlined" 
                placeholder="Search" 
                size="small" 
                sx={{width:300}}
                onChange={(e) => {
                    setFilters({...filters, keyword: e.target.value, pageIndex: 1});
                }}    
                />
                <Button 
                variant="contained" 
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
                onClick={redirectToAddBookPage}>Add</Button>
            </div>
            <TableContainer align="center">
                <Table sx={{ width: 1200 }} aria-label="simple table">
                <TableHead>
                    <TableRow >
                        <TableCell sx={{fontWeight:"bold", fontSize:15}}>Book Name</TableCell>
                        <TableCell align="left" sx={{fontWeight:"bold"}}>Price</TableCell>
                        <TableCell align="left" sx={{fontWeight:"bold"}}>Category</TableCell>
                        <TableCell align="right" sx={{fontWeight:"bold"}}></TableCell>
                    </TableRow>
                </TableHead>  
                <TableBody>
                    {/* {books.map((book) => ( */}
                    {bookRecords?.items?.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell width="400">{row.name}</TableCell>
                            <TableCell width="200">{row.price}</TableCell>
                            <TableCell>
                                {categories.find((c) => c.id === row.categoryId)?.name}
                            </TableCell>
                            <TableCell align="right">
                                <Button 
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
                                onClick={() =>{navigate(`/edit-book/${row.id}`);}}                     
                                >Edit
                                </Button>
                                <Button 
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
                                onClick={() => {
                                    setOpen(true);
                                    setSelectedId(row.id ?? 0);
                                }}
                                >Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!bookRecords.items.length && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography variant="h6">
                                    No Books
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
            count={bookRecords.totalItems}
            rowsPerPage={filters.pageSize || 0}
            page={filters.pageIndex - 1}
            onPageChange={(e, newPage) => {
                setFilters({
                    ...filters,
                    pageIndex: newPage + 1,
                });
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
                title="Delete Book"
                description="Are you sure you want to delete this book?"
            />
        </div>
    )
}