import { ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ConfirmDialogProps } from '../types/Candidate';

const dialogStyles = `
.p-dialog .p-dialog-footer {
    gap: 1rem;
    display: flex;
    justify-content: flex-end;
}
.p-dialog .p-dialog-footer button {
    margin: 0;
    padding: 0.75rem 1.5rem;
    min-width: 6rem;
}
.p-confirm-dialog .p-dialog-content {
    padding: 1.5rem;
}
.p-dialog .p-dialog-header {
    padding: 1.25rem 1.5rem;
}
`;



export const ReusableConfirmDialog: React.FC<ConfirmDialogProps> = ({
    visible,
    onHide,
    message,
    header,
    acceptLabel = 'Yes',
    rejectLabel = 'No',
    acceptClassName = 'p-button-danger', 
    rejectClassName = 'p-button-secondary',
    onAccept,
    onReject,
}) => {
    return (
        <div>
            <style>{dialogStyles}</style> 
            <ConfirmDialog
                visible={visible}
                onHide={onHide}
                message={message}
                header={header}
                accept={onAccept}
                reject={onReject}
                acceptLabel={acceptLabel}
                rejectLabel={rejectLabel}
                acceptClassName={acceptClassName}
                rejectClassName={rejectClassName}
            />
        </div>
    );
};
