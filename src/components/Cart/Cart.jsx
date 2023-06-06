import { useEffect, useState } from "react";
import { Typography, Button, Link } from "@mui/material";
import cartService from "../../services/cart.service";
import { useAuthContext } from "../../context/auth.context";
import { toast } from "react-toastify";
import orderService from "../../services/order.service";
import { useCartContext } from "../../context/cart.context";
import { useNavigate } from "react-router-dom";
import cartStyles from "./CartStyles.module.css"

export const Cart = () => {
    const authContext = useAuthContext();
    const cartContext = useCartContext();
    const navigate = useNavigate();

    const [cartList, setCartList] = useState([]);
    const [itemsInCart, setItemsInCart] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);


    const getTotalPrice = (itemList) => {
        let totalPrice = 0;
        itemList.forEach((item) => {
        const itemPrice = item.quantity * parseInt(item.book.price);
        totalPrice = totalPrice + itemPrice;
        });
        setTotalPrice(totalPrice);
    };

    useEffect(() => {
        setCartList(cartContext.cartData);
        setItemsInCart(cartContext.cartData.length);
        getTotalPrice(cartContext.cartData);
    }, [cartContext.cartData]);

    const removeItem = async (id) => {
        try {
        const res = await cartService.removeItem(id);
        if (res) {
            cartContext.updateCart();
        }
        } catch (error) {
        toast.error("Something went wrong!");
        }
    };

    const updateQuantity = async (cartItem, inc) => {
        const currentCount = cartItem.quantity;
        const quantity = inc ? currentCount + 1 : currentCount - 1;
        if (quantity === 0) {
        toast.error("Item quantity should not be zero");
        return;
        }

        try {
        const res = await cartService.updateItem({
            id: cartItem.id,
            userId: cartItem.userId,
            bookId: cartItem.book.id,
            quantity,
        });
        if (res) {
            const updatedCartList = cartList.map((item) =>
            item.id === cartItem.id ? { ...item, quantity } : item
            );
            cartContext.updateCart(updatedCartList);
            const updatedPrice =
            totalPrice +
            (inc
                ? parseInt(cartItem.book.price)
                : -parseInt(cartItem.book.price));
            setTotalPrice(updatedPrice);
        }
        } catch (error) {
        toast.error("Something went wrong!");
        }
    };

    const placeOrder = async () => {
        if (authContext.user.id) {
        const userCart = await cartService.getList(authContext.user.id);
        if (userCart.length) {
            try {
            let cartIds = userCart.map((element) => element.id);
            const newOrder = {
                userId: authContext.user.id,
                cartIds,
            };
            const res = await orderService.placeOrder(newOrder);
            if (res) {
                cartContext.updateCart();
                navigate("/");
                toast.success("Your order is successfully placed");
            }
            } catch (error) {
            toast.error(`Order cannot be placed ${error}`);
            }
        } else {
            toast.error("Your cart is empty");
        }
        }
    };
    return(
        <div className={cartStyles.cartWrapper}>
          <Typography variant="h4" sx={{fontWeight:"bold", color:"#414141"}}>Cart page</Typography>
          <div className={cartStyles.underline}></div>
          <div className={cartStyles.subTextContainer}>
            <Typography variant="h6" sx={{color:"#414141"}}>
              My Shopping Bag ({itemsInCart} Items)
            </Typography>
            <div className={cartStyles.totalPrice}>Total price: {totalPrice}</div>
          </div>
          <div className={cartStyles.itemCardWrapper}>
            {cartList.map((cartItem) => {
              return (
                <div className={cartStyles.itemCards} key={cartItem.id}>
                  <div className={cartStyles.itemImage}>
                      <img style={{
                        maxWidth: "100px",
                        flex: "0 0 150px",
                        minHeight:"50px",
                      }} src={cartItem.book.base64image} alt="dummy-pic" />
                  </div>
                  <div className={cartStyles.itemDescription}>
                    <div className={cartStyles.itemDescriptionRow}>
                      <div>
                        <span style={{fontWeight:"bold", color:"#414141", fontSize:17}}>{cartItem.book.name}</span>
                        <div style={{color:"#F15B6F"}}>Cart item name</div>
                      </div>
                      <div className={cartStyles.itemPrice}>
                        <span style={{fontWeight:"bold", color:"#414141", fontSize:17}}>
                          MRP &#8377; {cartItem.book.price}
                        </span>
                      </div>
                    </div>
                    <div className={cartStyles.itemDescriptionRow}>
                      <div className={cartStyles.quantityContainer}>
                        <div
                          onClick={() => updateQuantity(cartItem, true)}
                          className={cartStyles.quantityButton}
                        >+</div>
                        <span className={cartStyles.quantityNumber}>{cartItem.quantity}</span>
                        <div
                          onClick={() => updateQuantity(cartItem, false)}
                          className={cartStyles.quantityButton}
                        >-</div>
                      </div>
                      <div className={cartStyles.itemPrice}>
                        <Link sx={{cursor:"pointer",color:"#F15B6F", textDecoration:"none"}} onClick={() => removeItem(cartItem.id)}>Remove</Link>
                      </div>
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={cartStyles.placeOrderButton}>
            <Button sx={{ 
              backgroundColor:"#f14d54", 
              borderRadius:"2px", 
              color:"white",
              '&:hover': {
                backgroundColor: '#FD1823', // Example styling on hover
                color: 'white', // Example styling on hover
              },
              textTransform:"capitalize",
              fontSize:20,
              width:"170px",
              height:"50px"
              }}
            onClick={placeOrder}>
              Place order
            </Button>
          </div>
      </div>
    )
}