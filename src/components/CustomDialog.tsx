import {Dialog, DialogTitle, DialogContent, DialogContentText} from '@mui/material';
import RoundedIconButton from './RoundedIconButton'; // 你自定义的按钮
import Close from '@mui/icons-material/Close';

interface CustomDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    content: string;
}

export function CustomDialog({open, title, setOpen, content}: CustomDialogProps) {
    const handleClose = () => setOpen(false);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 2,
                    boxShadow: (theme) => theme.shadows[24],
                    backgroundColor: (theme) => theme.palette.background.paper,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '1.25rem',
                    paddingRight: 1,
                }}
            >
                {title}
                <RoundedIconButton
                    onClick={handleClose}
                    icon={<Close/>}
                    title="Close"
                />
            </DialogTitle>

            <DialogContent
                sx={{
                    paddingY: 1,
                }}
            >
                <DialogContentText
                    sx={{
                        fontSize: '1rem',
                        color: 'text.secondary',
                        whiteSpace: 'pre-line',
                        lineHeight: 1.6,
                    }}
                >
                    {content}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}
