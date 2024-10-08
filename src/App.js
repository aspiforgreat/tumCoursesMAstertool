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
    { name: 'THEO', fullName: 'THEO', color: '#FF7A7A', initialBalance: 10, balance: 0 },
    { name: 'ALG', fullName: 'Algorithmen', color: '#FF9B7A', initialBalance: 8, balance: 0 },
    { name: 'CGV', fullName: 'Computergrafik und -vision', color: '#FF4D5A', initialBalance: 8, balance: 0 },
    { name: 'DBI', fullName: 'Datenbanken und Informationssysteme', color: '#B77C7C', initialBalance: 8, balance: 0 },
    { name: 'DBM', fullName: 'Digitale Biologie und Digitale Medizin', color: '#7F5E8B', initialBalance: 8, balance: 0 },
    { name: 'SE', fullName: 'Engineering software-intensiver Systeme', color: '#aba6a6', initialBalance: 18, balance: 0 },
    { name: 'FMA', fullName: 'Formale Methoden und ihre Anwendungen', color: '#E6A6A6', initialBalance: 8, balance: 0 },
    { name: 'MLA', fullName: 'Maschinelles Lernen und Datenanalyse', color: '#C8B639', initialBalance: 8, balance: 0 },
    { name: 'RRV', fullName: 'Rechnerarchitektur, Rechnernetze und Verteilte Systeme', color: '#388C94', initialBalance: 8, balance: 0 },
    { name: 'ROB', fullName: 'Robotik', color: '#56B3C8', initialBalance: 8, balance: 0 },
    { name: 'SP', fullName: 'Sicherheit und Datenschutz', color: '#80B2B0', initialBalance: 8, balance: 0 },
    { name: 'HPC', fullName: 'Wissenschaftliches Rechnen und High Performance Computing', color: '#99E8B1', initialBalance: 8, balance: 0 },
    { name: 'WZ', fullName: 'Wahlmodule ohne Zuordnung zu einem Fachgebiet', color: '#F7D87C', initialBalance: 19, balance: 0 },
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
          if (newBalance > label.initialBalance && label.name !== 'THEO') {
            wzUpdate = newBalance - label.initialBalance;  // Calculate overflow
            console.log("overflow "+ wzUpdate)
          }

          // Check if previously above initial balance and now below
          if (label.balance > label.initialBalance && newBalance < label.initialBalance && label.name !== 'THEO') {
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
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                  <Typography
                      variant="h4"
                      style={{
                        fontWeight: 'bold',
                        display: 'inline-block',
                        marginRight: '10px',
                        padding: '5px' // Added padding
                      }}
                  >
                    Select Domains:
                  </Typography>
                  <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleOpenDialog}
                      style={{
                        display: 'inline-block',
                        padding: '5px 15px' // Added padding
                      }}
                  >
                    Edit Balances
                  </Button>
                </div>
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
            <List style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
              {entries.map((entry, index) => (
                  <ListItem key={index} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={10}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>
                          {entry.text}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#555' }}>
                          ECTS: {entry.ects} | Domains:
                          {entry.labels.map(label => {
                            const labelData = labelsData.find(l => l.name === label);
                            return (
                                <div
                                    key={label}
                                    style={{
                                      display: 'inline-block',
                                      backgroundColor: labelData.color,
                                      borderRadius: '20px',
                                      padding: '5px 10px',
                                      margin: '2px', // Add some spacing between labels
                                      color: '#fff',  // Change text color to white for better contrast
                                    }}
                                >
                                  {labelData.fullName}
                                </div>
                            );
                          })}
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


            </Paper>

          {/* Display progress bars for each label with balance above 0 */}
          <Paper style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <Typography variant="h4" style={{ marginBottom: '20px', color: '#333' }}>Domain Balances:</Typography>
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
              Total ECTS: {totalProgressValue} / {totalEctsLimit}
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
        </div>
      </div>
  );
}

export default App;