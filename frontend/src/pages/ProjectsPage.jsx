import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProjects, createProject } from '../api';

const STATUS_BADGE = {
  Open: 'badge-open',
  Assigned: 'badge-assigned',
  InProgress: 'badge-inprogress',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled'
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', budget: '', skills: '', deadline: '', postedBy: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (form.budget === '' || Number(form.budget) < 0) e.budget = 'Valid budget required';
    if (!form.skills.trim()) e.skills = 'Required';
    if (!form.deadline) e.deadline = 'Required';
    if (!form.postedBy.trim()) e.postedBy = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    try {
      const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      const created = await createProject({
        ...form,
        budget: Number(form.budget),
        skills: skillsArr
      });
      setProjects(prev => [created, ...prev]);
      setForm({ title: '', description: '', budget: '', skills: '', deadline: '', postedBy: '' });
      setErrors({});
      setShowForm(false);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Failed to create project' });
    }
  };

  return (
    <Layout>
      <h1 className="page-heading">Projects</h1>

      <button className="btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(v => !v)}>
        {showForm ? 'Cancel' : '+ Post New Project'}
      </button>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input className="form-control" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              {errors.title && <div className="error-msg">{errors.title}</div>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              {errors.description && <div className="error-msg">{errors.description}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Budget ($)</label>
                <input type="number" min="0" className="form-control" value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
                {errors.budget && <div className="error-msg">{errors.budget}</div>}
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input type="date" className="form-control" value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                {errors.deadline && <div className="error-msg">{errors.deadline}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input className="form-control" placeholder="e.g. React, Node.js, MongoDB"
                value={form.skills}
                onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
              {errors.skills && <div className="error-msg">{errors.skills}</div>}
            </div>
            <div className="form-group">
              <label>Your Name / Client</label>
              <input className="form-control" value={form.postedBy}
                onChange={e => setForm(f => ({ ...f, postedBy: e.target.value }))} />
              {errors.postedBy && <div className="error-msg">{errors.postedBy}</div>}
            </div>
            {errors.submit && <div className="error-msg" style={{ marginBottom: 8 }}>{errors.submit}</div>}
            <button type="submit" className="btn-primary">Post Project</button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="info-msg">No projects yet. Post your first project above.</p>
      ) : (
        projects.map(p => (
          <div key={p._id} className="project-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3>{p.title}</h3>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>
                  {p.description.length > 100 ? p.description.slice(0, 100) + '…' : p.description}
                </p>
                <div className="meta-row">
                  <div className="meta-item"><strong>Budget:</strong> ${Number(p.budget).toLocaleString()}</div>
                  <div className="meta-item"><strong>Deadline:</strong> {new Date(p.deadline).toLocaleDateString()}</div>
                  <div className="meta-item"><strong>Posted by:</strong> {p.postedBy}</div>
                  <div className="meta-item">
                    <span className={`badge ${STATUS_BADGE[p.status] || 'badge-pending'}`}>{p.status}</span>
                  </div>
                </div>
                <div className="skills-wrap" style={{ marginTop: 8 }}>
                  {p.skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}
                </div>
              </div>
              <div style={{ marginLeft: 16 }}>
                <Link to={`/projects/${p._id}`} className="btn-secondary btn-sm" style={{ display: 'inline-block', textDecoration: 'none' }}>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </Layout>
  );
}
