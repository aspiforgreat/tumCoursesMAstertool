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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Define pastel colors, full names, and initial balances for each label
const labelsData = [
  { name: 'THEO', fullName: 'THEO', color: '#FFABAB', balance: 10 },
  { name: 'ALG', fullName: 'Algorithmen', color: '#FFC3A0', balance: 8 },
  { name: 'CGV', fullName: 'Computergrafik und -vision', color: '#FF677D', balance: 8 },
  { name: 'DBI', fullName: 'Datenbanken und Informationssysteme', color: '#D4A5A5', balance: 8 },
  { name: 'DBM', fullName: 'Digitale Biologie und Digitale Medizin', color: '#a196c2', balance: 8 },
  { name: 'SE', fullName: 'Engineering software-intensiver Systeme', color: '#F9F7F7', balance: 18 },
  { name: 'FMA', fullName: 'Formale Methoden und ihre Anwendungen', color: '#F4C2C2', balance: 8 },
  { name: 'MLA', fullName: 'Maschinelles Lernen und Datenanalyse', color: '#F6E58D', balance: 8 },
  { name: 'RRV', fullName: 'Rechnerarchitektur, Rechnernetze und Verteilte Systeme', color: '#45AAB8', balance: 8 },
  { name: 'ROB', fullName: 'Robotik', color: '#78C4D4', balance: 8 },
  { name: 'SP', fullName: 'Sicherheit und Datenschutz', color: '#A6D6D5', balance: 8 },
  { name: 'HPC', fullName: 'Wissenschaftliches Rechnen und High Performance Computing', color: '#B9FBC0', balance: 8 },
  { name: 'WZ', fullName: 'Wahlmodule ohne Zuordnung zu einem Fachgebiet', color: '#F9E6B2', balance: 19 },
];

function App() {
  const [entryText, setEntryText] = useState('');
  const [cost, setCost] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [entries, setEntries] = useState([]);

  const totalCostLimit = 53;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLabels.length === 0) {
      alert('Please select at least one label.');
      return;
    }

    let remainingCost = parseInt(cost) || 0;
    const lastLabelName = 'WZ';

    const updatedLabels = labelsData.map((label) => {
      if (selectedLabels.includes(label.name)) {
        let newBalance = label.balance - remainingCost;

        if (newBalance < 0) {
          remainingCost = Math.abs(newBalance);
          newBalance = 0;
        } else {
          remainingCost = 0;
        }

        return { ...label, balance: newBalance };
      }
      return label;
    });

    const finalLabels = updatedLabels.map((label) => {
      if (label.name === lastLabelName && remainingCost > 0) {
        return { ...label, balance: label.balance - remainingCost };
      }
      return label;
    });

    const newEntry = {
      text: entryText,
      cost: parseInt(cost),
      labels: selectedLabels,
    };

    setEntries([...entries, newEntry]);
    setEntryText('');
    setCost('');
    setSelectedLabels([]);
  };

  const handleDelete = (index) => {
    const entryToDelete = entries[index];
    let restoredLabels = [...labelsData];
    entryToDelete.labels.forEach((labelName) => {
      const labelIndex = restoredLabels.findIndex(label => label.name === labelName);
      if (labelIndex !== -1) {
        restoredLabels[labelIndex].balance += entryToDelete.cost;
      }
    });

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
    const totalDeducted = entries.reduce((total, entry) => total + entry.cost, 0);
    return (totalDeducted / totalCostLimit) * 100;
  };

  const getLabelProgress = (label) => {
    const totalDeductedForLabel = entries
        .filter(entry => entry.labels.includes(label.name))
        .reduce((total, entry) => total + entry.cost, 0);
    const totalForLabel = label.balance + (label.balance + totalCostLimit); // Total available balance
    return ((totalDeductedForLabel) / totalForLabel) * 100; // Calculate progress as a percentage of the total balance
  };

  const totalProgressValue = calculateTotalProgress();

  return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          TUM Informatics Master ECTS Calculator
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                  label="Module Name"
                  variant="outlined"
                  fullWidth
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  required
              />
            </Grid>
            <Grid item xs={12}>
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
              <Typography variant="h6">Select Domains:</Typography>
              <Grid container spacing={1}>
                {labelsData.map(({ name, fullName, color }) => (
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
                                <span>{name}</span>
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

        <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
          Modules
        </Typography>

        <Paper elevation={3} style={{ padding: '10px' }}>
          <List>
            {entries.map((entry, index) => (
                <ListItem key={index} divider>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8}>
                      <Typography>
                        <strong>{entry.text}</strong>
                        <span style={{ marginLeft: '10px' }}>Cost: {entry.cost || ''}</span>
                        <span> Labels: {entry.labels.map(label => {
                          const labelData = labelsData.find(l => l.name === label);
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
                        })}</span>
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

        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">Module Distribution:</Typography>
          {labelsData.map(({ name, fullName, color, balance }) => {
            const labelProgress = getLabelProgress({ name, balance });
            if (entries.some(entry => entry.labels.includes(name))) {
              return (
                  <div key={name} style={{ marginBottom: '10px' }}>
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
                      <span>{fullName}</span>
                      <span style={{ marginLeft: '10px' }}>Balance: {balance}</span>
                    </div>
                    <LinearProgress variant="determinate" value={labelProgress} />
                  </div>
              );
            }
            return null;
          })}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Total ECTS Progress:</Typography>
          <LinearProgress variant="determinate" value={totalProgressValue} />
          <Typography variant="body2" style={{ textAlign: 'right' }}>
            {`${entries.reduce((total, entry) => total + entry.cost, 0)} / ${totalCostLimit}`}
          </Typography>
        </div>
      </div>
  );
}

export default App;