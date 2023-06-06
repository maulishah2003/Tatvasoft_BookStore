import {
    MenuItem, 
    Select, 
    Typography, 
    Pagination, 
    TextField, 
    FormControl, 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions,
    Button} from "@mui/material"
import {useAuthContext} from "../../context/auth.context"
import { useEffect, useState, useMemo } from "react";
import { defaultFilter } from "../../constants/constant";
import categoryService from "../../services/category.service";
import bookService from "../../services/book.service";
import bookListingStyles from "./BookListing.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons"
import { AddToCart } from "../../utils/shared";
import cartService from "../../services/cart.service";
import { useCartContext } from "../../context/cart.context"
import { toast } from "react-toastify"
export const BookListing = () => {
    const authContext = useAuthContext();
    const cartContext = useCartContext();
    // const materialClasses = materialCommonStyles();
    const [bookResponse, setBookResponse] = useState({
        pageIndex: 0,
        pageSize: 10, 
        totalPages: 1,
        items: [],
        totalItems: 0,
    });
    const [categories, setCatogries] = useState([]);
    const [sortBy, setSortBy] = useState();
    const [filters, setFilters] = useState(defaultFilter);

    useEffect(() => {
        
    });
    useEffect(() => {
        getAllCategories();
        const timer = setTimeout(() => {
            if(filters.keyword === "") delete filters.keyword;
            searchAllBooks({...filters});   
        },500);
        return () => clearTimeout(timer);
    },[filters]);

    const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
            setBookResponse(res);
        });
    };
    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if(res){
                setCatogries(res);
            }
        });
    };

    const books = useMemo(() => {
        const bookList = [...bookResponse.items];
        if(bookList) {
            bookList.forEach((element) => {
                element.category = categories.find(
                    (a) => a.id === element.categoryId
                )?.name;
            });
            return bookList;
        }
        return [];
    },[categories, bookResponse]);

    const sortBooks = (e) => {
        setSortBy(e.target.value);
        const bookList = [...bookResponse.items];
        bookList.sort((a,b) => {
            if(a.name < b.name) {
                return e.target.value === "a-z" ? -1 : 1;
            }
            if(a.name > b.name) {
                return e.target.value === "a-z" ? 1 : -1;
            }
            return 0;
        });
        setBookResponse({...bookResponse, items: bookList});
    };
    const addToCart = (book) => {
        AddToCart(book, authContext.user.id).then((res) => {
            if (res.error) {
                toast.error(res.message);
            } else {
                toast.success(res.message);
                cartContext.updateCart();
            }
        });
    };

    return(
       <div className={bookListingStyles.bookListingWrapper}>
            <Typography variant="h4" sx={{fontWeight:"bold", color:"#414141"}}>
                Book Listing
            </Typography> 
            <div className={bookListingStyles.underline}></div>
            <div className={bookListingStyles.pageControlBar}>
                <div className={bookListingStyles.total}>
                    Total - {bookResponse.totalItems} items
                </div>
                <div className={bookListingStyles.searchTextField}>
                    <TextField 
                        sx={{
                            width:"100%"
                        }}
                        placeholder="Search..."
                        size="small"
                        onChange = {(e) =>{
                            setFilters({
                                ...filters,
                                keyword: e.target.value,
                                pageIndex: 1
                            });
                        }}
                    />
                </div>
                <div className={bookListingStyles.sortByTag}>Sort By</div>
                <div className={bookListingStyles.sortBooksSelect}>
                
                    <FormControl sx={{float:"left",width:"100%"}}>
                        <Select
                        size="small"
                        onChange={sortBooks}
                        value={sortBy}
                        >
                            <MenuItem value="a-z">a-z</MenuItem>
                            <MenuItem value="z-a">z-a</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={bookListingStyles.bookCardsWrapper}> 
                {books.map((book, index)=> (
                    <div key={index} className={bookListingStyles.bookCard}>
                        <Card sx={{ width: 280 }}>
                            <CardMedia
                                sx={{ height: 240 }}
                                image={book.base64image}
                                title={book.name}
                            />
                            <CardContent>
                                <Typography noWrap variant="h5" sx={{fontWeight:"bold"}}>
                                    {book.name}
                                </Typography>
                                <Typography noWrap gutterBottom variant="h6">
                                    {book.category}
                                </Typography>
                                <Typography noWrap color="text.secondary" sx={{height:30}}>
                                    {book.description}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    MRP <FontAwesomeIcon icon={faIndianRupeeSign} /> {book.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                size="large" 
                                variant="contained"
                                sx={{
                                    width:"100%",
                                    backgroundColor:"#f14d54",
                                    fontWeight:"bold",
                                    '&:hover': {
                                    backgroundColor:"#FF101B", 
                                    }
                                }}
                                onClick={() => addToCart(book)}
                                >Add to Cart</Button>
                                {/* <Button size="small">Learn More</Button> */}
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </div>
            <Pagination
            count={bookResponse.totalPages}
            page={filters.pageIndex}
            onChange={(e, newPage) => {
                setFilters({...filters, pageIndex: newPage});
            }}
            />
       </div>
    )
}