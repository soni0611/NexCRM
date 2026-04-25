import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BidsSection from '../components/BidsSection';
import AssignmentSection from '../components/AssignmentSection';
import MilestonesSection from '../components/MilestonesSection';
import PaymentsSection from '../components/PaymentsSection';
import { getProject } from '../api';

const STATUS_BADGE = {
  Open: 'badge-open',
  Assigned: 'badge-assigned',
  InProgress: 'badge-inprogress',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled'
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Layout projectId={id}>
      <p className="info-msg">Loading project...</p>
    </Layout>
  );

  if (!project) return (
    <Layout projectId={id}>
      <p className="info-msg">Project not found.</p>
    </Layout>
  );

  return (
    <Layout projectId={id}>
      <Link to="/" className="back-link">&larr; Back to Projects</Link>

      <div className="card" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8 }}>{project.title}</h1>
        <p style={{ color: '#555', fontSize: 15, marginBottom: 14 }}>{project.description}</p>
        <div className="meta-row">
          <div className="meta-item"><strong>Budget:</strong> ${Number(project.budget).toLocaleString()}</div>
          <div className="meta-item"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</div>
          <div className="meta-item"><strong>Posted by:</strong> {project.postedBy}</div>
          <div className="meta-item">
            <span className={`badge ${STATUS_BADGE[project.status] || 'badge-pending'}`}>{project.status}</span>
          </div>
        </div>
        <div className="skills-wrap" style={{ marginTop: 10 }}>
          {project.skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}
        </div>
      </div>

      <nav className="sub-nav">
        <a href="#bids">Bids</a>
        <a href="#assignment">Assignment</a>
        <a href="#milestones">Milestones</a>
        <a href="#payments">Payments</a>
      </nav>

      <BidsSection projectId={id} />
      <hr className="section-divider" />
      <AssignmentSection projectId={id} />
      <hr className="section-divider" />
      <MilestonesSection projectId={id} />
      <hr className="section-divider" />
      <PaymentsSection projectId={id} />
    </Layout>
  );
}
