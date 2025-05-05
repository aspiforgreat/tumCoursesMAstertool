import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  IconButton,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
    Link
} from '@mui/material';
import Checklist from './Checklist';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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

  const updateBalances = () => {
    setLabelsData(prevLabelsData => {
      let wzUpdate = 0;
      const labelMap = new Map();

      // Initialize a map for easy updates
      prevLabelsData.forEach(label => {
        labelMap.set(label.name, { ...label });
      });

      // Process each entry
      entries.forEach(entry => {
        const { ects, labels } = entry;

        labels.forEach(labelName => {
          const label = labelMap.get(labelName);
          if (!label) return;

          const newBalance = label.balance + ects;

          // Track WZ updates
          if (label.name !== 'THEO') {
            if (label.balance <= label.initialBalance && newBalance > label.initialBalance) {
              wzUpdate += newBalance - label.initialBalance;
            } else if (label.balance > label.initialBalance && newBalance < label.initialBalance) {
              wzUpdate -= label.balance - label.initialBalance;
            }
          }

          label.balance = newBalance;
          labelMap.set(labelName, label);
        });
      });

      // Update WZ balance
      if (labelMap.has('WZ')) {
        const wzLabel = labelMap.get('WZ');
        wzLabel.balance += wzUpdate;
        labelMap.set('WZ', wzLabel);
      }

      return Array.from(labelMap.values());
    });
  };

  useEffect(() => {
    // Reset all balances to 0 so it recalculates correctly
    setLabelsData(initialLabelsData);
    updateBalances()
  }, [entries]);

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

    setEntries(prevEntries => [...prevEntries, newEntry]);
    setEntryText('');
    setEcts('');
    setSelectedLabels([]);
  };

  const handleDelete = (index) => {
    const entryToDelete = entries[index];
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
          initialBalance: updatedBalances[label.name]
        }))
    );
    setOpenDialog(false);
  };

  const totalProgressValue = entries.reduce((total, entry) => total + entry.ects, 0);

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
                        padding: '5px 15px'
                      }}
                  >
                    Edit Balances
                  </Button>
                  <Button
                      variant="outlined"
                      color="error" // Use "error" for red in MUI
                      onClick={handlePopoverOpen}
                      style={{
                        display: 'inline-block',
                        // Increased left padding
                        marginLeft: '10px', // Added margin to separate from the previous button
                      }}
                  >
                    Guide & Important Notes
                  </Button>

                  <Popover
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      PaperProps={{
                        sx: { p: 2, maxWidth: 500 },
                      }}
                  >
                    <Typography variant="h4" gutterBottom>
                      Edit the balances to choose your distribution according to the following information:
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Important TUM Information about Modules:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {`In the electives area, 53 credits must be earned. You will select:
                      - One specialization area with at least 18 credits
                      - Two supplementary areas with at least 8 credits each from the specializations offered
                      - An additional 9 credits in any subject areas
                      
                      Excess credits in the three chosen subject areas automatically count towards the "free elective".
                      
                      Theory Modules:
                      - At least 10 credits from "Theory" modules must be earned
                      - These can be found under "Theory" in the study tree of each subject area
                      - They can belong to any subject area and do not need to be in the focus or supplementary areas
                      
                      Remaining 10 Credits — Choose One Profile:
                      - Research: Take the guided research module
                      - Practice: Complete a second Master's practical course
                      - Practice in Depth: Complete an Advanced Master's practical course
                      - Fundamentals: Earn all remaining credits through elective modules from any subject area
                      
                      Special Regulations for Individual Modules:
                      
                      Machine Learning and Data Analysis — Only one of the following three:
                      - IN2028 Business Analytics and Machine Learning
                      - IN2339 Data Analysis and Visualization in R
                      - IN2030 Data Mining and Knowledge Discovery
                      
                      Machine Learning and Data Analysis — Only one of the following two:
                      - IN2064 Machine Learning
                      - IN2332 Statistical Modeling and Machine Learning
                      
                      Formal Methods and Their Application — Only one of the following two:
                      - IN2048 Equational Logic and Lambda Calculus
                      - IN2358 Lambda Calculus
                      
                      Computer Graphics and Vision — Only one of the following three:
                      - IN2364 Advanced Deep Learning for Computer Vision
                      - IN2389 Advanced Deep Learning for Computer Vision: Dynamic Vision
                      - IN2390 Advanced Deep Learning for Computer Vision: Visual Computing
                      
                      Source (as of May 5, 2025):`}
                    </Typography>

                    <Link
                        href="https://www.cit.tum.de/en/cit/studies/degree-programs/master-informatics/"
                        target="_blank"
                        rel="noopener"
                    >
                      https://www.cit.tum.de/en/cit/studies/degree-programs/master-informatics/
                    </Link>

                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                      TUM Master Informatics, DEA: Offered Lectures
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      Check out the list of available modules which I got from this Github project by Vincent Bürgin
            and Fehmi :
    <Link
                          href="https://github.com/Vuenc/TUM-Master-Informatics-Offered-Lectures#tum-master-informatics-dea-offered-lectures"
                          target="_blank"
                          rel="noopener"
                      >
                    TUM-Master-Informatics-Offered-Lectures{' '}
                      </Link>

                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Informatics master:
                    </Typography>
                    <Typography variant="body2">

                      <Link
                          href="https://vuenc.github.io/TUM-Master-Informatics-Offered-Lectures/informatics-ss25.html"
                          target="_blank"
                          rel="noopener"
                      >
                        List of courses offered in summer semester 2025{' '}
                      </Link>
                    </Typography>

                    <Typography variant="body2">

                      <Link
                          href="https://vuenc.github.io/TUM-Master-Informatics-Offered-Lectures/informatics-all.html"
                          target="_blank"
                          rel="noopener"
                      >
                        List of all courses and when last offered{' '}
                      </Link>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                      DEA master:
                    </Typography>

                    <Typography variant="body2">

                      <Link
                          href="https://vuenc.github.io/TUM-Master-Informatics-Offered-Lectures/dea-ss25.html"
                          target="_blank"
                          rel="noopener"
                      >
                        List of elective courses offered in summer semester 2025{' '}
                      </Link>
                    </Typography>

                    <Typography variant="body2">

                      <Link
                          href="https://vuenc.github.io/TUM-Master-Informatics-Offered-Lectures/dea-all.html"
                          target="_blank"
                          rel="noopener"
                      >
                        List of all courses and when last offered{' '}
                      </Link>
                    </Typography>

                    <Typography variant="h6">

                      <Link
                          href="https://github.com/aspiforgreat/tumCoursesMAstertool"
                          target="_blank"
                          rel="noopener"
                      >
                        Link to the github project of this ECTS Calculator{' '}
                      </Link>
                    </Typography>


                  </Popover>
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
            {labelsData.map(({ name, fullName, color, balance, initialBalance }) => {
              if (balance <= 0) return null;

              // If there's overflow, calculate the percentage split
              const hasOverflow = balance > initialBalance;
              const overflowPct = hasOverflow ? ((balance - initialBalance) / balance) * 100 : 0;
              const normalPct = hasOverflow ? (initialBalance / balance) * 100 : (balance / initialBalance) * 100;

              return (
                  <div key={name} style={{ marginBottom: '15px' }}>
                    <Typography
                        style={{
                          marginBottom: '5px',
                          color: '#333',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '1rem' // Base size for text and icon
                        }}
                    >
                      <span style={{
                        marginRight: '8px',
                        color: balance >= initialBalance ? 'green' : '#f57c00',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {balance >= initialBalance ? (
                            <CheckCircleIcon fontSize="inherit" />
                        ) : (
                            <ErrorOutlineIcon fontSize="inherit" />
                        )}
                      </span>
                                          <span>
                        <strong>{fullName}</strong> — Balance:
                        <span style={{
                          color: balance >= initialBalance ? 'green' : '#d32f2f',
                          fontWeight: '700',
                          fontSize: '1.1rem',
                          marginLeft: '4px',
                          marginRight: '4px'
                        }}>
                          {balance}
                        </span>
                        / {initialBalance}
                      </span>
                    </Typography>

                    <Tooltip title={`Overflow: ${Math.abs(Math.min(initialBalance - balance,0))}`} arrow>
                      <div style={{ position: 'relative', height: '20px', borderRadius: '5px', backgroundColor: '#e0e0e0', overflow: 'hidden', display: 'flex' }}>
                        {hasOverflow && (
                            <div style={{ width: `${overflowPct}%`, backgroundColor: "#F7D87C" }} />
                        )}
                        <div style={{ width: `${normalPct}%`, backgroundColor: color }} />
                      </div>
                    </Tooltip>
                  </div>
              );
            })}
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
          <Checklist labelsData={labelsData} totalProgressValue={totalProgressValue} />

        </div>
      </div>
  );
}

export default App;