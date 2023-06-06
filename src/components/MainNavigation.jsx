import { RoutePaths } from "../utils/enum"
import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "./Login/Login"
import { Register } from "./Register"
import { Home } from "./Home"
import { BookListing } from "./BookListing/BookListing"
import { useAuthContext } from "../context/auth.context"
import { BookStore } from "../components/BookStore/BookStore"
import { AddBook } from "../components/AddBook/AddBook"
import { EditBook } from "./BookStore/EditBook/EditBook"
import { User } from "./User/User"
import { EditUser } from "./User/EditUser/EditUser"
import { Category } from "./Category/Category"
import { EditCategory } from "./Category/EditCategory/EditCategory"
import { UpdateProfile } from "./UpdateProfile/UpdateProfile"
import { Cart } from "./Cart/Cart"
export const MainNavigation = () => {
    const authContext = useAuthContext();
    const Redirect = <Navigate to={RoutePaths.Login}/>
    return(
        <Routes>
            <Route exact path={RoutePaths.Login} element={<Login/>}/>
            <Route exact path={RoutePaths.Register} element={!authContext.user.id ? <Register/> : Redirect}/>
            <Route exact path={RoutePaths.Home} element={<Home/>}/>
            <Route exact path={RoutePaths.UpdateProfile} element={authContext.user.id ? <UpdateProfile/> : Redirect}/>
            <Route exact path={RoutePaths.BookListing} element={authContext.user.id ? <BookListing/> : Redirect}/>
            <Route exact path={RoutePaths.BookDetails} element={<BookStore/>}/>
            <Route exact path={RoutePaths.AddBook} element={authContext.user.id ? <AddBook/> : Redirect}/>
            <Route exact path={RoutePaths.EditBook} element={authContext.user.id ? <EditBook/> : Redirect}/>
            <Route exact path={RoutePaths.User} element={authContext.user.id ? <User/> : Redirect}/>
            <Route exact path={RoutePaths.EditUser} element={authContext.user.id ? <EditUser/> : Redirect}/>
            <Route exact path={RoutePaths.Category} element={authContext.user.id ? <Category    /> : Redirect}/>
            <Route exact path={RoutePaths.EditCategory} element={authContext.user.id ? <EditCategory /> : Redirect}/>
            <Route exact path={RoutePaths.AddCategory} element={authContext.user.id ? <EditCategory /> : Redirect}/>
            <Route exact path={RoutePaths.AddCategory} element={authContext.user.id ? <EditCategory /> : Redirect}/>
            <Route exact path={RoutePaths.Cart} element={authContext.user.id ? <Cart/> : Redirect}/>

        </Routes>
    )
}