const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  const project = 'apitest';
  let firstIssueId;
  let secondIssueId;

  suite('POST /api/issues/:project', function() {
    test('Create an issue with every field', function(done) {
      chai.request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: 'Full issue',
          issue_text: 'Functional test text',
          created_by: 'fcc tester',
          assigned_to: 'assignee',
          status_text: 'in progress'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body.issue_title, 'Full issue');
          assert.equal(res.body.issue_text, 'Functional test text');
          assert.equal(res.body.created_by, 'fcc tester');
          assert.equal(res.body.assigned_to, 'assignee');
          assert.equal(res.body.status_text, 'in progress');
          assert.isTrue(res.body.open);
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          firstIssueId = res.body._id;
          done();
        });
    });

    test('Create an issue with only required fields', function(done) {
      chai.request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: 'Required only issue',
          issue_text: 'Required only text',
          created_by: 'fcc tester'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.isTrue(res.body.open);
          secondIssueId = res.body._id;
          done();
        });
    });

    test('Create an issue with missing required fields', function(done) {
      chai.request(server)
        .post(`/api/issues/${project}`)
        .send({ issue_title: 'Missing fields' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });
  });

  suite('GET /api/issues/:project', function() {
    test('View issues on a project', function(done) {
      chai.request(server)
        .get(`/api/issues/${project}`)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 2);
          assert.includeMembers(res.body.map(issue => issue._id), [firstIssueId, secondIssueId]);
          done();
        });
    });

    test('View issues on a project with one filter', function(done) {
      chai.request(server)
        .get(`/api/issues/${project}`)
        .query({ assigned_to: 'assignee' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 1);
          assert.isTrue(res.body.every(issue => issue.assigned_to === 'assignee'));
          done();
        });
    });

    test('View issues on a project with multiple filters', function(done) {
      chai.request(server)
        .get(`/api/issues/${project}`)
        .query({ open: 'true', created_by: 'fcc tester' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 2);
          assert.isTrue(res.body.every(issue => issue.open === true && issue.created_by === 'fcc tester'));
          done();
        });
    });
  });

  suite('PUT /api/issues/:project', function() {
    test('Update one field on an issue', function(done) {
      chai.request(server)
        .put(`/api/issues/${project}`)
        .send({ _id: firstIssueId, issue_title: 'Updated title' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: firstIssueId });
          done();
        });
    });

    test('Update multiple fields on an issue', function(done) {
      chai.request(server)
        .put(`/api/issues/${project}`)
        .send({ _id: firstIssueId, issue_text: 'Updated text', open: false })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: firstIssueId });
          done();
        });
    });

    test('Update an issue with missing _id', function(done) {
      chai.request(server)
        .put(`/api/issues/${project}`)
        .send({ issue_title: 'No id' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    test('Update an issue with no fields to update', function(done) {
      chai.request(server)
        .put(`/api/issues/${project}`)
        .send({ _id: firstIssueId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: firstIssueId });
          done();
        });
    });

    test('Update an issue with an invalid _id', function(done) {
      chai.request(server)
        .put(`/api/issues/${project}`)
        .send({ _id: 'not-a-real-id', issue_title: 'No issue' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', _id: 'not-a-real-id' });
          done();
        });
    });
  });

  suite('DELETE /api/issues/:project', function() {
    test('Delete an issue', function(done) {
      chai.request(server)
        .delete(`/api/issues/${project}`)
        .send({ _id: secondIssueId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', _id: secondIssueId });
          done();
        });
    });

    test('Delete an issue with an invalid _id', function(done) {
      chai.request(server)
        .delete(`/api/issues/${project}`)
        .send({ _id: 'not-a-real-id' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not delete', _id: 'not-a-real-id' });
          done();
        });
    });

    test('Delete an issue with missing _id', function(done) {
      chai.request(server)
        .delete(`/api/issues/${project}`)
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });
  });
});
