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

function App() {
  const initialLabelsData = [
    { name: 'THEO', fullName: 'THEO', color: '#FFABAB', initialBalance: 10, balance: 0 },
    { name: 'ALG', fullName: 'Algorithmen', color: '#FFC3A0', initialBalance: 8, balance: 0 },
    { name: 'CGV', fullName: 'Computergrafik und -vision', color: '#FF677D', initialBalance: 8, balance: 0 },
    { name: 'DBI', fullName: 'Datenbanken und Informationssysteme', color: '#D4A5A5', initialBalance: 8, balance: 0 },
    { name: 'DBM', fullName: 'Digitale Biologie und Digitale Medizin', color: '#a196c2', initialBalance: 8, balance: 0 },
    { name: 'SE', fullName: 'Engineering software-intensiver Systeme', color: '#F9F7F7', initialBalance: 18, balance: 0 },
    { name: 'FMA', fullName: 'Formale Methoden und ihre Anwendungen', color: '#F4C2C2', initialBalance: 8, balance: 0 },
    { name: 'MLA', fullName: 'Maschinelles Lernen und Datenanalyse', color: '#F6E58D', initialBalance: 8, balance: 0 },
    { name: 'RRV', fullName: 'Rechnerarchitektur, Rechnernetze und Verteilte Systeme', color: '#45AAB8', initialBalance: 8, balance: 0 },
    { name: 'ROB', fullName: 'Robotik', color: '#78C4D4', initialBalance: 8, balance: 0 },
    { name: 'SP', fullName: 'Sicherheit und Datenschutz', color: '#A6D6D5', initialBalance: 8, balance: 0 },
    { name: 'HPC', fullName: 'Wissenschaftliches Rechnen und High Performance Computing', color: '#B9FBC0', initialBalance: 8, balance: 0 },
    { name: 'WZ', fullName: 'Wahlmodule ohne Zuordnung zu einem Fachgebiet', color: '#F9E6B2', initialBalance: 19, balance: 0 },
  ];

  const [labelsData, setLabelsData] = useState(initialLabelsData);
  const [entryText, setEntryText] = useState('');
  const [ects, setEcts] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [entries, setEntries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedBalances, setUpdatedBalances] = useState({});

  const totalEctsLimit = 53;

  const updateBalances = (name, amount) => {
    setLabelsData(prevLabelsData => {
      let wzUpdate = 0;
      return prevLabelsData.map(label => {
        if (label.name === name) {
          const newBalance = label.balance + amount;
          let adjustedBalance = newBalance;
          console.log("balance "+label.balance)
          console.log("new balance "+newBalance)
          console.log("initial balance "+label.initialBalance)

          // Check for overflow
          if (newBalance > label.initialBalance) {
            wzUpdate = newBalance - label.initialBalance;  // Calculate overflow
            console.log("overflow "+ wzUpdate)
          }

          // Check if previously above initial balance and now below
          if (label.balance > label.initialBalance && newBalance < label.initialBalance) {
            let wz = label.balance - label.initialBalance
            wzUpdate = -( label.balance - label.initialBalance )// Remove overflow from WZ
          }

          return { ...label, balance: adjustedBalance };
        } else {
          return label;
        }
      }).map(label => {
        if (label.name === 'WZ') {
          return { ...label, balance: label.balance + wzUpdate }; // Update WZ
        }
        return label;
      });
    });
  };

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

    const entryEcts = parseInt(ects) || 0;
    const newEntry = {
      text: entryText,
      ects: entryEcts,
      labels: selectedLabels,
    };

    // Update balances for the selected labels
    selectedLabels.forEach(labelName => {
      updateBalances(labelName, entryEcts);
    });

    setEntries(prevEntries => [...prevEntries, newEntry]);
    setEntryText('');
    setEcts('');
    setSelectedLabels([]);
  };

  const handleDelete = (index) => {
    const entryToDelete = entries[index];
    entryToDelete.labels.forEach(labelName => {
      updateBalances(labelName, -entryToDelete.ects);
    });
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const handleLabelSelection = (e) => {
    const labelName = e.target.name;
    if (e.target.checked) {
      setSelectedLabels([...selectedLabels, labelName]);
    } else {
      setSelectedLabels(selectedLabels.filter(label => label !== labelName));
    }
  };

  const handleOpenDialog = () => {
    setUpdatedBalances(labelsData.reduce((acc, label) => ({ ...acc, [label.name]: label.initialBalance }), {}));
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
          balance: updatedBalances[label.name],
        }))
    );
    setOpenDialog(false);
  };

  const totalProgressValue = entries.reduce((total, entry) => total + entry.ects, 0);

  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', padding: '20px 20px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
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
                    value={ects}
                    onChange={(e) => setEcts(e.target.value)}
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
                  {labelsData.map(({ name, fullName, initialBalance, color }) => (
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
                                  <span>{name + " (" + initialBalance + ")"}</span>
                                </div>
                              </Tooltip>
                            }
                        />
                      </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Entry
                </Button>
              </Grid>
            </Grid>
          </form>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Balances</DialogTitle>
            <DialogContent>
              {labelsData.map(({ name, fullName }) => (
                  <TextField
                      key={name}
                      label={fullName}
                      value={updatedBalances[name] || ''}
                      onChange={(e) => handleBalanceChange(name, e.target.value)}
                      fullWidth
                      type="number"
                      margin="normal"
                  />
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitBalances} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Paper style={{ marginTop: '20px', padding: '20px' }}>
            <Typography variant="h5">Module Overview:</Typography>
            <List style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9' }}>
              {entries.map((entry, index) => (
                  <ListItem key={index} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={10}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>
                          {entry.text}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#555' }}>
                          ECTS: {entry.ects} | Domains: {entry.labels.join(', ')}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)} style={{ padding: '10px' }}>
                          <DeleteIcon fontSize="large" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
              ))}
            </List>

            <div style={{ marginTop: '20px' }}>
              <Typography
                  variant="h6"
                  style={{
                    fontWeight: 'bold',
                    marginTop: '10px',
                    marginBottom: '5px',  // Add margin below the text
                    color: '#333',        // Change text color for better contrast
                  }}
              >
                Total ECTS used: {totalProgressValue} / {totalEctsLimit}
              </Typography>

              <LinearProgress
                  variant="determinate"
                  value={(totalProgressValue / totalEctsLimit) * 100}
                  style={{
                    backgroundColor: "#e0e0e0",   // Background color for the track
                    borderRadius: '5px',          // Rounded corners for the progress bar
                    height: '10px',                // Increase the height for better visibility
                    marginTop: '5px',             // Add some space between text and progress bar
                  }}
                  classes={{
                    bar: {
                      backgroundColor: "#3f51b5", // Customize bar color
                    },
                  }}
              />
            </div>
          </Paper>

          {/* Display progress bars for each label with balance above 0 */}
          <Paper style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" style={{ marginBottom: '20px', color: '#333' }}>Domain Balances:</Typography>
            {labelsData.map(({ name, fullName, color, balance, initialBalance }) => (
                balance > 0 ? (
                    <div key={name} style={{ marginBottom: '15px' }}>
                      <Typography style={{ marginBottom: '5px', color: '#555' }}>
                        {fullName} - Balance: {balance} / {initialBalance}
                      </Typography>
                      <Tooltip title={`${balance} / ${initialBalance}`} arrow>
                        <div style={{ position: 'relative' }}>
                          <LinearProgress
                              variant="determinate"
                              value={(balance / initialBalance) * 100}
                              style={{
                                height: '20px',
                                borderRadius: '5px',
                                backgroundColor: '#e0e0e0', // Light gray background for the bar
                              }}
                              sx={{
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: color, // Keep the original color
                                },
                              }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                ) : null
            ))}
          </Paper>
        </div>
      </div>
  );
}

export default App;