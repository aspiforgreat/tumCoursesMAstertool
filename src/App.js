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
  const [labelsData, setLabelsData] = useState(initialLabelsData.map(label => ({ ...label, balance: label.initialBalance }))); // Add current balance

  const totalCostLimit = 53;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLabels.length === 0) {
      alert('Please select at least one label.');
      return;
    }

    const entryCost = parseInt(cost) || 0;
    const newEntry = {
      text: entryText,
      cost: entryCost,
      labels: selectedLabels,
    };

    setEntries([...entries, newEntry]);

    // Update label balances
    setLabelsData(prevLabels =>
        prevLabels.map(label => {
          if (selectedLabels.includes(label.name)) {
            return { ...label, balance: Math.max(label.balance - entryCost, 0) };
          }
          return label;
        })
    );

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
    const totalDeducted = entries.reduce((total, entry) => total + entry.cost, 0);
    return (totalDeducted / totalCostLimit) * 100;
  };

  const getLabelProgress = (label) => {
    const totalDeductedForLabel = entries
        .filter(entry => entry.labels.includes(label.name))
        .reduce((total, entry) => total + entry.cost, 0);
    return (totalDeductedForLabel / label.initialBalance) * 100;
  };

  const totalProgressValue = calculateTotalProgress();

  return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold' }}>
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
              <Typography variant="h4" style={{ fontWeight: 'bold' }}>Select Domains:</Typography>
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
                          Cost: {entry.cost || ''} | Domains : {
                          entry.labels.map(label => {
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
                          })
                        }
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

        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>Module Distribution:</Typography>
          {labelsData.map(({ name, fullName, color, initialBalance, balance }) => {
            const totalDeductedForLabel = entries
                .filter(entry => entry.labels.includes(name))
                .reduce((total, entry) => total + entry.cost, 0);

            // Only display labels that have entries
            if (totalDeductedForLabel === 0) return null;

            const labelProgress = getLabelProgress({ name, initialBalance });
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
                    <span style={{ marginLeft: '10px', fontWeight: 'bold' }}></span>
                  </div>
                  <LinearProgress variant="determinate" value={labelProgress} />
                  <Typography variant="body2" style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '8px' }}>
                    {`Current Balance: ${balance} / Total Balance: ${initialBalance}`}
                  </Typography>
                </div>
            );
          })}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total ECTS Progress:</Typography>
          <LinearProgress variant="determinate" value={totalProgressValue} />
          <Typography variant="body2" style={{ textAlign: 'right', fontWeight: 'bold' }}>
            {`${entries.reduce((total, entry) => total + entry.cost, 0)} / ${totalCostLimit}`}
          </Typography>
        </div>
      </div>
  );
}

export default App;