const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// READ jobs
app.get('/jobs', (req, res) => {
  fs.readFile('jobs.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading jobs');
    res.send(JSON.parse(data));
  });
});

// CREATE job
app.post('/jobs', (req, res) => {
  const newJob = req.body;  

  fs.readFile('jobs.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let jobs = JSON.parse(data);
    jobs.push(newJob);

    fs.writeFile('jobs.json', JSON.stringify(jobs, null, 2), err => {
      if (err) return res.status(500).send('Error saving job');
      res.status(200).send({ message: 'Job added successfully' });
    });
  });
});

// DELETE job
app.delete('/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  fs.readFile('jobs.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let jobs = JSON.parse(data);
    const filteredJobs = jobs.filter(job => job.id !== jobId);

    if (jobs.length === filteredJobs.length) {
      return res.status(404).send({ message: 'Job not found' });
    }

    fs.writeFile('jobs.json', JSON.stringify(filteredJobs, null, 2), err => {
      if (err) return res.status(500).send('Error deleting job');
      res.status(200).send({ message: 'Job deleted successfully' });
    });
  });
});

// UPDATE job
app.put('/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  const updatedJob = req.body;

  fs.readFile('jobs.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let jobs = JSON.parse(data);
    const index = jobs.findIndex(job => job.id === jobId);

    if (index === -1) {
      return res.status(404).send({ message: 'Job not found' });
    }

    jobs[index] = { ...jobs[index], ...updatedJob };

    fs.writeFile('jobs.json', JSON.stringify(jobs, null, 2), err => {
      if (err) return res.status(500).send('Error updating job');
      res.status(200).send({ message: 'Job updated successfully' });
    });
  });
});

// PORT server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
