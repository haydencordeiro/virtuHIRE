import React, { useState, useEffect } from 'react';
import { Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const LeaderboardComponent = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_all_candidates');
        const data = await response.json();
        setCandidates(data.candidates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <Typography variant="h4" gutterBottom style={{margin:'1 rem'}}>
        Leaderboard
      </Typography>
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight:'bold'}}>Name</TableCell>
              <TableCell style={{fontWeight:'bold'}}>Role</TableCell>
              <TableCell style={{fontWeight:'bold'}}>Score</TableCell>
              <TableCell style={{fontWeight:'bold'}}>Interviewed On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.uuid}>
                <TableCell style={{textTransform:'capitalize'}}>{candidate.name}</TableCell>
                <TableCell style={{textTransform:'capitalize'}}>{candidate.role}</TableCell>
                <TableCell>{candidate.score}</TableCell>
                <TableCell style={{textTransform:'capitalize'}}>{candidate.interviewed_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeaderboardComponent;
