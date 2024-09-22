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

// Define colors for each label
const labelColors = {
  THEO: '#3f51b5',
  'Algorithmen (ALG)': '#f50057',
  'Computergrafik und -vision (CGV)': '#4caf50',
  'Datenbanken und Informationssysteme (DBI)': '#ff9800',
  'Digitale Biologie und Digitale Medizin (DBM)': '#2196f3',
  'Engineering software-intensiver Systeme (SE)': '#9c27b0',
  'Formale Methoden und ihre Anwendungen (FMA)': '#e91e63',
  'Maschinelles Lernen und Datenanalyse (MLA)': '#3f51b5',
  'Rechnerarchitektur, Rechnernetze und Verteilte Systeme (RRV)': '#009688',
  'Robotik (ROB)': '#ff5722',
  'Sicherheit und Datenschutz (SP)': '#795548',
  'Wissenschaftliches Rechnen und High Performance Computing (HPC)': '#607d8b',
  'Wahlmodule ohne Zuordnung zu einem Fachgebiet': '#cddc39',
};

function App() {
  const initialLabels = [
    { name: 'THEO', balance: 10 },
    { name: 'Algorithmen (ALG)', balance: 8 },
    { name: 'Computergrafik und -vision (CGV)', balance: 8 },
    { name: 'Datenbanken und Informationssysteme (DBI)', balance: 8 },
    { name: 'Digitale Biologie und Digitale Medizin (DBM)', balance: 8 },
    { name: 'Engineering software-intensiver Systeme (SE)', balance: 18 },
    { name: 'Formale Methoden und ihre Anwendungen (FMA)', balance: 8 },
    { name: 'Maschinelles Lernen und Datenanalyse (MLA)', balance: 8 },
    { name: 'Rechnerarchitektur, Rechnernetze und Verteilte Systeme (RRV)', balance: 8 },
    { name: 'Robotik (ROB)', balance: 8 },
    { name: 'Sicherheit und Datenschutz (SP)', balance: 8 },
    { name: 'Wissenschaftliches Rechnen und High Performance Computing (HPC)', balance: 8 },
    { name: 'Wahlmodule ohne Zuordnung zu einem Fachgebiet', balance: 19 },
  ];

  const [entryText, setEntryText] = useState('');
  const [cost, setCost] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [labels, setLabels] = useState(initialLabels);
  const [entries, setEntries] = useState([]);

  const totalCostLimit = 53;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLabels.length === 0) {
      alert('Please select at least one label.');
      return;
    }
    let remainingCost = cost;
    const lastLabelName = 'Wahlmodule ohne Zuordnung zu einem Fachgebiet';

    const updatedLabels = labels.map((label) => {
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
      cost: cost,
      labels: selectedLabels,
    };

    setEntries([...entries, newEntry]);
    setLabels(finalLabels);
    setEntryText('');
    setCost(0);
    setSelectedLabels([]);
  };

  const handleDelete = (index) => {
    const entryToDelete = entries[index];
    let restoredLabels = [...labels];
    entryToDelete.labels.forEach((labelName) => {
      const labelIndex = labels.findIndex(label => label.name === labelName);
      if (labelIndex !== -1) {
        restoredLabels[labelIndex].balance += entryToDelete.cost;
      }
    });

    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    setLabels(restoredLabels);
  };

  const handleLabelSelection = (e) => {
    const labelName = e.target.name;
    if (e.target.checked) {
      setSelectedLabels([...selectedLabels, labelName]);
    } else {
      setSelectedLabels(selectedLabels.filter((label) => label !== labelName));
    }
  };

  const calculateProgress = () => {
    const totalDeducted = entries.reduce((total, entry) => total + entry.cost, 0);
    return (totalDeducted / totalCostLimit) * 100;
  };

  const progressValue = calculateProgress();

  const getLabelProgress = (label) => {
    const totalDeductedForLabel = entries
        .filter(entry => entry.labels.includes(label.name))
        .reduce((total, entry) => total + entry.cost, 0);
    return ((label.balance + totalDeductedForLabel) / (label.balance + totalCostLimit - totalDeductedForLabel)) * 100;
  };

  return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          TUM Informatics Master ECTS Calculator
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Entry Text Input */}
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

            {/* Cost Input */}
            <Grid item xs={12}>
              <TextField
                  label="ECTS"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={cost}
                  onChange={(e) => setCost(parseInt(e.target.value))}
                  required
              />
            </Grid>

            {/* Labels Selection */}
            <Grid item xs={12}>
              <Typography variant="h6">Select Domains:</Typography>
              <Grid container spacing={1}>
                {labels.map((label) => (
                    <Grid item xs={6} sm={4} md={3} key={label.name}>
                      <FormControlLabel
                          control={
                            <Checkbox
                                checked={selectedLabels.includes(label.name)}
                                name={label.name}
                                onChange={handleLabelSelection}
                            />
                          }
                          label={
                            <Tooltip title={label.name} placement="top">
                              <div
                                  style={{
                                    backgroundColor: labelColors[label.name],
                                    borderRadius: '20px',
                                    padding: '5px 10px',
                                    color: '#fff',
                                    display: 'inline-block',
                                  }}
                              >
                                <span>{label.name.includes('(') ? label.name.split('(')[1].split(')')[0].trim() : label.name}</span>
                              </div>
                            </Tooltip>
                          }
                      />
                    </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Add Entry
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Displaying Entries */}
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
                        <strong>{entry.text}</strong> - Cost: {entry.cost}, Labels: {entry.labels.map(label => (
                          <div
                              key={label}
                              style={{
                                backgroundColor: labelColors[label],
                                borderRadius: '20px',
                                padding: '5px 10px',
                                color: '#fff',
                                display: 'inline-block',
                                marginRight: '5px',
                              }}
                          >
                            {label.includes('(') ? label.split('(')[1].split(')')[0].trim() : label}
                          </div>
                      ))}
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

        {/* Progress Bars for Labels */}
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">Module Distribution:</Typography>
          {labels.map((label) => {
            const labelProgress = getLabelProgress(label);
            if (entries.some(entry => entry.labels.includes(label.name))) {
              return (
                  <div key={label.name} style={{ marginBottom: '10px' }}>
                    <div
                        style={{
                          backgroundColor: labelColors[label.name],
                          borderRadius: '20px',
                          padding: '5px 10px',
                          color: '#fff',
                          display: 'inline-block',
                        }}
                    >
                      {label.name}
                    </div>
                    <LinearProgress variant="determinate" value={labelProgress} />
                    <Typography variant="body2" style={{ textAlign: 'right' }}>
                      Balance: {label.balance}
                    </Typography>
                  </div>
              );
            }
            return null;
          })}
        </div>

        {/* Total ECTS Progress */}
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Total ECTS Progress:</Typography>
          <LinearProgress variant="determinate" value={progressValue} />
          <Typography variant="body2" style={{ textAlign: 'right' }}>
            {`${entries.reduce((total, entry) => total + entry.cost, 0)} / ${totalCostLimit}`}
          </Typography>
        </div>
      </div>
  );
}

export default App;