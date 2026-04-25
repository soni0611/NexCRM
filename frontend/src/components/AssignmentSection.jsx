import { useState, useEffect } from 'react';
import { getAssignments, updateAssignment, createStageProgress, getStageProgress } from '../api';

const STAGES = ['NotStarted', 'InProgress', 'UnderReview', 'Completed'];

function stageBadgeClass(stage) {
  if (stage === 'Completed') return 'badge badge-accepted';
  if (stage === 'InProgress') return 'badge badge-inprogress';
  if (stage === 'UnderReview') return 'badge badge-assigned';
  return 'badge badge-pending';
}

export default function AssignmentSection({ projectId }) {
  const [assignment, setAssignment] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ stage: 'InProgress', comment: '', updatedBy: '' });
  const [errors, setErrors] = useState({});

  const loadAssignment = async () => {
    try {
      const list = await getAssignments({ projectId });
      if (list.length > 0) {
        setAssignment(list[0]);
        const prog = await getStageProgress({ assignmentId: list[0]._id });
        setHistory(prog);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadAssignment(); }, [projectId]);

  const validate = () => {
    const e = {};
    if (!form.stage) e.stage = 'Required';
    if (!form.comment.trim()) e.comment = 'Required';
    if (!form.updatedBy.trim()) e.updatedBy = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    try {
      await createStageProgress({ assignmentId: assignment._id, ...form });
      await updateAssignment(assignment._id, { currentStage: form.stage });
      setForm({ stage: 'InProgress', comment: '', updatedBy: '' });
      setErrors({});
      loadAssignment();
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Failed to update stage' });
    }
  };

  if (!assignment) {
    return (
      <div id="assignment" style={{ marginBottom: 32 }}>
        <h2 className="section-heading">Assignment</h2>
        <p className="info-msg">No assignment yet — accept a bid to create one.</p>
      </div>
    );
  }

  return (
    <div id="assignment" style={{ marginBottom: 32 }}>
      <h2 className="section-heading">Assignment</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="meta-row">
          <div className="meta-item"><strong>Freelancer:</strong> {assignment.freelancerName}</div>
          <div className="meta-item"><strong>Client:</strong> {assignment.clientName}</div>
          <div className="meta-item"><strong>Assigned:</strong> {new Date(assignment.assignedAt).toLocaleDateString()}</div>
          <div className="meta-item">
            <strong>Stage:</strong>{' '}
            <span className={stageBadgeClass(assignment.currentStage)}>{assignment.currentStage}</span>
          </div>
        </div>
        {assignment.notes && <p style={{ fontSize: 14, color: '#555' }}>{assignment.notes}</p>}
      </div>

      <div className="form-card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Update Stage</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Stage</label>
            <select className="form-control" value={form.stage}
              onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.stage && <div className="error-msg">{errors.stage}</div>}
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea className="form-control" value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
            {errors.comment && <div className="error-msg">{errors.comment}</div>}
          </div>
          <div className="form-group">
            <label>Updated By</label>
            <input className="form-control" value={form.updatedBy}
              onChange={e => setForm(f => ({ ...f, updatedBy: e.target.value }))} />
            {errors.updatedBy && <div className="error-msg">{errors.updatedBy}</div>}
          </div>
          {errors.submit && <div className="error-msg" style={{ marginBottom: 8 }}>{errors.submit}</div>}
          <button type="submit" className="btn-primary">Update Stage</button>
        </form>
      </div>

      <div className="stage-history">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Stage History</h3>
        {history.length === 0 ? (
          <p className="info-msg">No stage updates yet.</p>
        ) : (
          history.map(entry => (
            <div key={entry._id} className="stage-history-item">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
                <span className={stageBadgeClass(entry.stage)}>{entry.stage}</span>
                <span style={{ fontSize: 12, color: '#939598' }}>{new Date(entry.updatedAt).toLocaleString()}</span>
                <span style={{ fontSize: 13, color: '#555' }}>by <strong>{entry.updatedBy}</strong></span>
              </div>
              <p style={{ fontSize: 14, color: '#333', margin: 0 }}>{entry.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
