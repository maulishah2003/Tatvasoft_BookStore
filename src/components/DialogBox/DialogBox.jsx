import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const DialogBox = (props) => {
    const { open, onClose, onConfirm, title, description } = props;

    return(
        <Dialog
        open={open}
        onClose={() => onClose()}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                type="button"
                onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button
                type="button"
                onClick={() => onConfirm()}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogBox;