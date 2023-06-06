import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { defaultFilter } from "../../constants/constant"
import { useAuthContext } from "../../context/auth.context"
import userService from "../../services/user.service"; 
import DialogBox from "../DialogBox/DialogBox"
import { RecordsPerPage } from "../../constants/constant"
import { Table,
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Typography, 
    TablePagination, 
    Button, 
    TextField,
    TableContainer } from "@mui/material";
import { toast } from "react-toastify";
import userStyles from "./UserStyles.module.css"
export const User    = () => {
    const authContext = useAuthContext();

    const [filters, setFilters] = useState(defaultFilter);
    const [userList, setUserList] = useState({
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
        getAllUsers({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const getAllUsers = async (filters) => {
        await userService.getAllUsers(filters).then((res) => {
        if (res) {
            setUserList(res);
        }
        });
    };

    const columns = [
        { id: "firstName", label: "First Name", minWidth: 100 },
        { id: "lastName", label: "Last Name", minWidth: 100 },
        {
        id: "email",
        label: "Email",
        minWidth: 170,
        },
        {
        id: "roleName",
        label: "Role",
        minWidth: 130,
        },
    ];

    const onConfirmDelete = async () => {
        await userService
        .deleteUser(selectedId)
        .then((res) => {
            if (res) {
            toast.success("Record deleted successfully");
            setOpen(false);
            setFilters({ ...filters });
            }
        })
        .catch((e) => toast.error("Record cannot be deleted"));
    };

    return (
        <div className={userStyles.userWrapper}>
                <Typography variant="h4" sx={{fontWeight:"bold", color:"#414141"}}>User</Typography>
                <div className={userStyles.underline}></div>
                <div className={userStyles.search}>
                <TextField
                    id="text"
                    name="text"
                    placeholder="Search..."
                    variant="outlined"
                    onChange={(e) => {
                    setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
                    }}
                    sx={{
                        width:"25%"
                    }}
                    size="small"
                
                />
                </div>
                <TableContainer sx={{width:"87%"}}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            style={{ minWidth: column.minWidth, fontWeight:"bold" }}
                        >
                            {column.label}
                        </TableCell>
                        ))}
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {userList?.items?.map((row, index) => (
                        <TableRow key={`${index}-${row.id}-${row.email}`}>
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>
                            <Button
                            type="button"
                            variant="outlined"
                            onClick={() => {
                                navigate(`/edit-user/${row.id}`);
                            }}
                            
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
                            {row.id !== authContext.user.id && (
                            <Button
                                type="button"
                                variant="outlined"
                                disableElevation
                                onClick={() => {
                                setOpen(true);
                                setSelectedId(row.id ?? 0);

                                }}
                                sx={{
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
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    {!userList?.items?.length && (
                        <TableRow className="TableRow">
                        <TableCell colSpan={5} className="TableCell">
                            <Typography align="center" className="noDataText">
                            No Users
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
                count={userList?.totalItems || 0}
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
                title="Delete user"
                description={"Are you sure you want to delete this user?"}
                />
        </div>
      );
}