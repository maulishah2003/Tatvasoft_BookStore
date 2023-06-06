import { useMemo, useState } from "react"
import {NavigationItems} from "../../utils/shared";
import { Link, useNavigate } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";
import siteLogo from "../../assets/images/tatvasoftLogo.svg"
import headerStyles from "./headerStyle.module.css";
import { Button, Breadcrumbs, TextField, } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import bookService from "../../services/book.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useAuthContext } from "../../context/auth.context";
import { toast } from "react-toastify"
import { AddToCart } from "../../utils/shared";
import { useCartContext } from "../../context/cart.context";
// import { cartService } from "../../services/cart.service"
export const Headers = () => {
    const authContext = useAuthContext();
    const cartContext = useCartContext();
    // const open = false;
    const [query, setQuery] = useState("");
    const [bookList, setBookList] = useState([]);
    const [openSearchResult, setOpenSearchResult] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const items = useMemo(() => {
        return NavigationItems.filter(
            (item) => !item.access.length || item.access.includes(authContext.user.roleId)
        );
    },[authContext.user]);
    const navigate = useNavigate();
    const searchBook = async () => {
        const res = await bookService.searchBook(query);
        setBookList(res)
        console.log(res);
    }
    const search = async () => {
        await searchBook();
        setOpenSearchResult(true);
        setOverlay(true);
    }
    const logout = () => {
        authContext.signOut();
        cartContext.emptyCart();
    }
    const addToCart = (book) => {
        if (!authContext.user.id) {
            navigate(RoutePaths.Login);
            toast.error("Please login before adding books to cart");
        } else {
            AddToCart(book, authContext.user.id).then((res) => {
                if (res.error) {
                toast.error(res.error);
                } else {
                toast.success("Item added in cart");
                cartContext.updateCart();
                console.log(cartContext.cartData.length);
                }
            });
        }
    };
    // const resizeDescription = () => {
    //     DialogContent
    // }
    return(
        <div>
            <div className={headerStyles.redLine}></div>
            <div className={headerStyles.header}>
                <div className={headerStyles.tatvasoftLogoClass}>
                    <Link to={RoutePaths.Home} >
                        <img src={siteLogo} width="180" alt="tatvasoft.svg"></img>
                    </Link>
                </div>
                <div className={headerStyles.headerLinks}>
                    {!authContext.user.id && (
                        <>
                        <div style={{color:"#f14d54"}}>
                        <Link
                        style={{
                            color:"#f14d54",
                            textDecoration:"none"
                        }}
                        to={RoutePaths.Login} >
                            Login
                        </Link>
                        </div> 
                        <span style={{
                            color:"#999999", 
                            fontWeight:100
                        }}>|</span>
                        <div style={{color:"#f14d54"}}>
                            <Link
                            style={{
                                color:"#f14d54",
                                textDecoration:"none"
                            }}
                            to={RoutePaths.Register} >
                                Register
                            </Link>
                        </div>
                        </>
                    )}
                    {/* {!authContext.user.id && ( */}
                        <Breadcrumbs separator="|" aria-label="breadcrumb">
                            {items.map((item, index) => (
                                <div key={index}>
                                    <Link
                                    style={{
                                        color:"#f14d54",
                                        textDecoration:"none"
                                    }}
                                    to={item.route}>
                                        {item.name}
                                    </Link>
                                </div>  
                            ))}
                        </Breadcrumbs>
                    {/* )}  */}
                </div>
                <div>
                    <Link to="/cart">
                        <Button variant="contained" style={{
                            backgroundColor:"white",
                            color:"#f14d54",
                            boxShadow:"0 0 0 0",
                            border:1,
                            borderStyle:"solid",
                            borderColor:"#999999",
                            marginLeft:10,
                            textTransform:"capitalize"
                        }}
                        >
                            <ShoppingCartIcon/>
                            <span style={{
                                paddingLeft:5,
                                paddingRight:5,
                                fontSize:15,
                                fontWeight:"bold",
                                
                            }}>
                                {cartContext.cartData.length}
                            </span> 
                            <span style={{color:"black"}}> Cart </span> 
                        </Button>
                    </Link>
                </div>
                {authContext.user.id && (
                    <div 
                    onClick={logout}
                    className={headerStyles.logout}>Log out</div>
                )}
                <div className={headerStyles.emptySpaceRight}></div>
            </div>
            <div className={headerStyles.searchContainer}>
                <div>
                    <TextField 
                    variant="outlined" 
                    // label="Search Book"
                    placeholder="What you are looking for..."
                    value={query}
                    style={{
                        width:550,
                        backgroundColor:"white",
                        borderRadius:5,
                        marginRight:10
                    }}
                    size="small"
                    onChange={(e) => {setQuery(e.target.value)}}
                    ></TextField>
                    <div>
                        {openSearchResult && (
                            <div className={headerStyles.searchResults}>
                                {bookList?.length === 0 && (
                                    <p className={headerStyles.noProduct}>No Product Found</p>
                                )}
                                {/* <div> */}
                                    {bookList?.length > 0 && 
                                    bookList.map((item, index) => {
                                        return(
                                            <div key={index} className={headerStyles.singleBookDetails}>
                                                <div className={headerStyles.bookDetailsLeft}>
                                                    <div>{item.name}</div>
                                                    <div className={headerStyles.itemDescription} noWrap>{item.description}</div>
                                                </div>
                                                <div className={headerStyles.bookDetailsright}>
                                                    <div style={{textAlign:"right"}}>{item.price}</div>
                                                    <div>
                                                        <Link
                                                        style={{
                                                            color:"#f14d54",
                                                            textDecoration:"none"
                                                        }}
                                                        onClick={() => addToCart(item)}
                                                        >Add to cart</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Button variant="Contained" onClick={search}
                    style={{
                        backgroundColor:"#7EC21F",
                        width:130,
                        height:40,
                        color:"white",
                        textTransform:"capitalize",
                        fontSize:15,
                        fontWeight:600,
                    }}>
                        <span style={{fontSize:20}}><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                        <span style={{paddingLeft:5}}>Search</span>
                    </Button>
                </div>
                
            </div>
            <div>
                {overlay && (
                    <div 
                    className={headerStyles.overlay}
                    onClick={() => {
                        setOpenSearchResult(false);
                        setOverlay(false);
                    }}>  
                    </div>
                )}
            </div>
        </div>
    )
}