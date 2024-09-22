import React, { useState } from 'react';
import { TextField, Checkbox, Button, FormControlLabel, Grid, Typography, Paper, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  // Define labels with initial balances
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

  const handleSubmit = (e) => {
    e.preventDefault();
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

  return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Cost Tracker
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Entry Text Input */}
            <Grid item xs={12}>
              <TextField
                  label="Entry Text"
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
                  label="Cost"
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
              <Typography variant="h6">Select Labels:</Typography>
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
                          label={`${label.name} (Balance: ${label.balance})`}
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
          Entries
        </Typography>

        <Paper elevation={3} style={{ padding: '10px' }}>
          <List>
            {entries.map((entry, index) => (
                <ListItem key={index} divider>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8}>
                      <Typography>
                        <strong>{entry.text}</strong> - Cost: {entry.cost}, Labels: {entry.labels.join(', ')}
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
      </div>
  );
}

export default App;