import React, { useState } from 'react';
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Define pastel colors, full names, and initial balances for each label
const initialLabelsData = [
  { name: 'THEO', fullName: 'THEO', color: '#FFABAB', initialBalance: 10 },
  { name: 'ALG', fullName: 'Algorithmen', color: '#FFC3A0', initialBalance: 8 },
  { name: 'CGV', fullName: 'Computergrafik und -vision', color: '#FF677D', initialBalance: 8 },
  { name: 'DBI', fullName: 'Datenbanken und Informationssysteme', color: '#D4A5A5', initialBalance: 8 },
  { name: 'DBM', fullName: 'Digitale Biologie und Digitale Medizin', color: '#a196c2', initialBalance: 8 },
  { name: 'SE', fullName: 'Engineering software-intensiver Systeme', color: '#F9F7F7', initialBalance: 18 },
  { name: 'FMA', fullName: 'Formale Methoden und ihre Anwendungen', color: '#F4C2C2', initialBalance: 8 },
  { name: 'MLA', fullName: 'Maschinelles Lernen und Datenanalyse', color: '#F6E58D', initialBalance: 8 },
  { name: 'RRV', fullName: 'Rechnerarchitektur, Rechnernetze und Verteilte Systeme', color: '#45AAB8', initialBalance: 8 },
  { name: 'ROB', fullName: 'Robotik', color: '#78C4D4', initialBalance: 8 },
  { name: 'SP', fullName: 'Sicherheit und Datenschutz', color: '#A6D6D5', initialBalance: 8 },
  { name: 'HPC', fullName: 'Wissenschaftliches Rechnen und High Performance Computing', color: '#B9FBC0', initialBalance: 8 },
  { name: 'WZ', fullName: 'Wahlmodule ohne Zuordnung zu einem Fachgebiet', color: '#F9E6B2', initialBalance: 19 },
];

function App() {
  const [entryText, setEntryText] = useState('');
  const [cost, setCost] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [entries, setEntries] = useState([]);
  const [labelsData, setLabelsData] = useState(initialLabelsData.map(label => ({ ...label, balance: label.initialBalance })));
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [updatedBalances, setUpdatedBalances] = useState({}); // State to track updated balances

  const totalCostLimit = 53;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedLabels.length === 0) {
      alert('Please select at least one label.');
      return;
    }

    if (selectedLabels.includes('THEO') && selectedLabels.length === 1) {
      alert('If THEO is selected, at least one other label must also be selected.');
      return;
    }

    const entryCost = parseInt(cost) || 0;
    const newEntry = {
      text: entryText,
      cost: entryCost,
      labels: selectedLabels,
    };

    let overflow = 0;

    // Log initial WZ balance
    const initialWZBalance = labelsData.find(label => label.name === 'WZ').balance;
    console.log('Initial WZ Balance:', initialWZBalance);

    setLabelsData((prevLabels) => {
      return prevLabels.map((label) => {
        if (selectedLabels.includes(label.name)) {
          let newBalance = label.balance - entryCost;

          // Check for overflow
          if (newBalance < 0 && label.name !== 'THEO') {
            overflow += Math.abs(newBalance);
            newBalance = 0; // Set to 0 if it goes negative
          }

          return { ...label, balance: newBalance };
        }
        return label;
      });
    });

    // Log WZ balance after label updates
    const updatedWZBalanceAfterLabels = labelsData.find(label => label.name === 'WZ').balance;
    console.log('WZ Balance after label updates:', updatedWZBalanceAfterLabels);

    // Apply overflow to WZ only
    if (overflow > 0) {
      setLabelsData((prevLabels) => {
        return prevLabels.map((label) => {
          if (label.name === 'WZ') {
            const newWZBalance = label.balance - overflow;
            console.log('WZ Balance before overflow adjustment:', label.balance);
            console.log('Overflow amount:', overflow);
            console.log('New WZ Balance after overflow adjustment:', newWZBalance);
            return { ...label, balance: newWZBalance };
          }
          return label;
        });
      });
    }

    setEntries((prevEntries) => [...prevEntries, newEntry]);
    setEntryText('');
    setCost('');
    setSelectedLabels([]);
  };

  const handleDelete = (index) => {
    const entryToDelete = entries[index];

    // Restore the balances of the corresponding labels
    setLabelsData(prevLabels =>
        prevLabels.map(label => {
          if (entryToDelete.labels.includes(label.name)) {
            return { ...label, balance: Math.min(label.balance + entryToDelete.cost, label.initialBalance) };
          }
          return label;
        })
    );

    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const handleLabelSelection = (e) => {
    const labelName = e.target.name;
    if (e.target.checked) {
      setSelectedLabels([...selectedLabels, labelName]);
    } else {
      setSelectedLabels(selectedLabels.filter((label) => label !== labelName));
    }
  };

  const calculateTotalProgress = () => {
    const totalDeducted = entries.reduce((total, entry) => {
      let entryCost = entry.cost;

      // For each entry, ensure overflow isn't counted by comparing with available balances
      const labelsForEntry = labelsData.filter(label => entry.labels.includes(label.name));
      labelsForEntry.forEach(label => {
        entryCost = Math.min(entryCost, label.initialBalance); // Deduct only up to the label's initial balance
      });

      return total + entryCost;
    }, 0);

    return totalDeducted;
  };

  const handleOpenDialog = () => {
    setUpdatedBalances(
        labelsData.reduce((acc, label) => ({ ...acc, [label.name]: label.initialBalance }), {})
    );
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBalanceChange = (name, value) => {
    setUpdatedBalances(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmitBalances = () => {
    setLabelsData(prevLabels =>
        prevLabels.map(label => ({
          ...label,
          initialBalance: updatedBalances[label.name],
          balance: updatedBalances[label.name], // Update both initial and current balance
        }))
    );
    setOpenDialog(false);
  };

  const calculateWZProgress = () => {
    const wZLabel = labelsData.find(label => label.name === 'WZ');
    if (!wZLabel) return 0;

    const totalDeductedForWZ = calculateTotalDeductedForWZ();
    return (totalDeductedForWZ / wZLabel.initialBalance) * 100;
  };
  const calculateTotalDeductedForWZ = () => {
    return labelsData.find(label => label.name === 'WZ').initialBalance - labelsData.find(label => label.name === 'WZ').balance
  };

  const totalProgressValue = calculateTotalProgress();

  return (
      <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '0 20px', // Padding on left and right
          }}
      >
        <div style={{ maxWidth: '800px', width: '100%' }}> {/* Centered container */}
          <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold' }}>
            TUM Informatics Master ECTS Calculator
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                    label="Module Name"
                    variant="outlined"
                    fullWidth
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                    label="ECTS"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h4" style={{ fontWeight: 'bold', display: 'inline-block', marginRight: '10px' }}>
                  Select Domains:
                </Typography>
                <Button variant="outlined" color="primary" onClick={handleOpenDialog} style={{ display: 'inline-block' }}>
                  Edit Balances
                </Button>
                <Grid container spacing={1}>
                  {labelsData.map(({ name, fullName,initialBalance ,color }) => (
                      <Grid item xs={6} sm={4} md={3} key={name}>
                        <FormControlLabel
                            control={
                              <Checkbox
                                  checked={selectedLabels.includes(name)}
                                  name={name}
                                  onChange={handleLabelSelection}
                              />
                            }
                            label={
                              <Tooltip title={fullName} placement="top">
                                <div
                                    style={{
                                      backgroundColor: color,
                                      borderRadius: '20px',
                                      padding: '5px 10px',
                                      color: '#333',
                                      display: 'inline-block',
                                    }}
                                >
                                  <span>{name +" (" +  initialBalance+")"}</span>
                                </div>
                              </Tooltip>
                            }
                        />
                      </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Add Entry
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Dialog for editing balances */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Initial Balances</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                {labelsData.map(({ name, fullName, color }) => (
                    <Grid item xs={12} key={name}>
                      <TextField
                          label={`${fullName} Balance`}
                          variant="outlined"
                          fullWidth
                          value={updatedBalances[name] || ''}
                          onChange={(e) => handleBalanceChange(name, e.target.value)}
                          InputProps={{ style: { backgroundColor: color } }}
                      />
                    </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSubmitBalances} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Display list of entries */}
          <Typography variant="h5" gutterBottom style={{ marginTop: '20px', fontWeight: 'bold' }}>
            Modules
          </Typography>

          <Paper elevation={3} style={{ padding: '10px' }}>
            <List>
              {entries.map((entry, index) => (
                  <ListItem key={index} divider>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item xs={8}>
                        <Typography style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                          {entry.text}
                          <div style={{ fontStyle: 'italic', fontWeight: 'lighter', fontSize: '0.9em' }}>
                            Cost: {entry.cost || ''} | Domains :{' '}
                            {entry.labels.map((label) => {
                              const labelData = labelsData.find((l) => l.name === label);
                              return (
                                  <div
                                      key={label}
                                      style={{
                                        backgroundColor: labelData.color,
                                        borderRadius: '20px',
                                        padding: '5px 10px',
                                        color: '#333',
                                        display: 'inline-block',
                                        marginRight: '5px',
                                      }}
                                  >
                                    {label}
                                  </div>
                              );
                            })}
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4} textAlign="right">
                        <IconButton onClick={() => handleDelete(index)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
              ))}
            </List>
          </Paper>

          {/* Display domain distribution progress */}
          <Typography variant="h5" style={{ fontWeight: 'bold', marginTop: '20px' }}>
            Module Distribution:
          </Typography>

          {labelsData.map(({ name, fullName, color, initialBalance, balance }) => {
            const totalDeductedForLabel = entries
                .filter((entry) => entry.labels.includes(name))
                .reduce((total, entry) => {
                  if (name === 'WZ') {
                    // Calculate total overflow to be added to WZ
                    const overflowFromOtherLabels = entries.reduce((overflowTotal, entry) => {
                      return entry.labels.reduce((acc, labelName) => {
                        const labelData = labelsData.find(label => label.name === labelName);
                        const balanceDiff = Math.max(0, entry.cost - labelData.initialBalance); // Calculate the overflow
                        return acc + balanceDiff;
                      }, 0);
                    }, 0);
                    return overflowFromOtherLabels;
                  } else {
                    // Normal label calculation
                    return total + entry.cost;
                  }
                }, 0);

            if (totalDeductedForLabel === 0) return null;

            const labelProgress = (totalDeductedForLabel / initialBalance) * 100;

            return (
                <div key={name} style={{ marginBottom: '20px' }}>
                  <div
                      style={{
                        backgroundColor: color,
                        borderRadius: '20px',
                        padding: '5px 10px',
                        color: '#333',
                        display: 'inline-block',
                        justifyContent: 'space-between',
                      }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{fullName}</span>
                  </div>
                  <LinearProgress variant="determinate" value={labelProgress} />
                  <Typography variant="body2" style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '5px' }}>
                    {totalDeductedForLabel}/{initialBalance} ECTS
                  </Typography>
                </div>
            );
          })}

          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Module ohne Zuordnung und Overflow:</Typography>
            <LinearProgress variant="determinate" value={calculateWZProgress()} />
            <Typography variant="body2" style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '5px' }}>
              {calculateTotalDeductedForWZ()} ECTS of {labelsData.find(label => label.name === 'WZ').initialBalance} ECTS
            </Typography>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total Progress:</Typography>
            <LinearProgress variant="determinate" value={(calculateTotalProgress() / totalCostLimit) * 100} />
            <Typography variant="body2" style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '5px' }}>
              {calculateTotalProgress()} ECTS (Max {totalCostLimit} ECTS)
            </Typography>
          </div>
        </div>
      </div>
  );
}

export default App;