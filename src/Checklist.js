import { CheckCircle as CheckCircleIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const Checklist = ({ labelsData, totalProgressValue }) => {
    const totalEctsLimit = 53;

    // Count how many labels (excluding THEO and WZ) have balance > initialBalance
    const domainsOverBalance = labelsData.filter(label =>
        label.name !== 'THEO' && label.name !== 'WZ' && label.balance > label.initialBalance
    ).length;

    const theoLabel = labelsData.find(label => label.name === 'THEO');

    const isThreeDomainsDone = domainsOverBalance >= 3;
    const isTheoDone = theoLabel && theoLabel.balance >= theoLabel.initialBalance;
    const isTotalEctsFull = totalProgressValue >= totalEctsLimit;

    const checklistItems = [
        {
            label: "At least 3 Domains done",
            condition: isThreeDomainsDone,
        },
        {
            label: "Theo modules done",
            condition: isTheoDone,
        },
        {
            label: "Total ECTS at least 53",
            condition: isTotalEctsFull,
        }
    ];

    return (
        <div style={{ marginTop: '30px' }}>
            <Typography variant="h4" style={{ marginBottom: '10px' }}>
                Completion Checklist
            </Typography>
            <List>
                {checklistItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            {item.condition ? (
                                <CheckCircleIcon style={{ color: 'green' }} />
                            ) : (
                                <ErrorOutlineIcon style={{ color: '#f57c00' }} />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Checklist;
