'use strict';

const crypto = require('crypto');

const projects = Object.create(null);

function getProjectIssues(project) {
  if (!projects[project]) {
    projects[project] = [];
  }
  return projects[project];
}

function makeId() {
  return crypto.randomBytes(12).toString('hex');
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

const updateFields = [
  'issue_title',
  'issue_text',
  'created_by',
  'assigned_to',
  'status_text',
  'open'
];

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const issues = getProjectIssues(req.params.project);
      const filters = req.query || {};

      const filtered = issues.filter(issue => {
        return Object.keys(filters).every(key => {
          if (key === 'open') {
            return String(issue.open) === String(filters[key]);
          }
          return String(issue[key]) === String(filters[key]);
        });
      });

      res.json(filtered);
    })
    
    .post(function (req, res){
      const issues = getProjectIssues(req.params.project);
      const { issue_title, issue_text, created_by } = req.body;

      if (!hasValue(issue_title) || !hasValue(issue_text) || !hasValue(created_by)) {
        return res.json({ error: 'required field(s) missing' });
      }

      const now = new Date();
      const issue = {
        _id: makeId(),
        issue_title,
        issue_text,
        created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: now,
        updated_on: now,
        open: true
      };

      issues.push(issue);
      res.json(issue);
    })
    
    .put(function (req, res){
      const issues = getProjectIssues(req.params.project);
      const id = req.body._id;

      if (!hasValue(id)) {
        return res.json({ error: 'missing _id' });
      }

      const fieldsToUpdate = updateFields.filter(field => hasValue(req.body[field]));
      if (fieldsToUpdate.length === 0) {
        return res.json({ error: 'no update field(s) sent', _id: id });
      }

      const issue = issues.find(item => item._id === id);
      if (!issue) {
        return res.json({ error: 'could not update', _id: id });
      }

      fieldsToUpdate.forEach(field => {
        if (field === 'open') {
          issue.open = req.body.open === true || req.body.open === 'true';
        } else {
          issue[field] = req.body[field];
        }
      });
      issue.updated_on = new Date();

      res.json({ result: 'successfully updated', _id: id });
    })
    
    .delete(function (req, res){
      const issues = getProjectIssues(req.params.project);
      const id = req.body._id;

      if (!hasValue(id)) {
        return res.json({ error: 'missing _id' });
      }

      const index = issues.findIndex(item => item._id === id);
      if (index === -1) {
        return res.json({ error: 'could not delete', _id: id });
      }

      issues.splice(index, 1);
      res.json({ result: 'successfully deleted', _id: id });
    });
    
};
