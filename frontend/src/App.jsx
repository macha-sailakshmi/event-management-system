import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const emptyParticipant = { id: '', name: '' };

function App() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [participantForm, setParticipantForm] = useState(emptyParticipant);
  const [registrationForm, setRegistrationForm] = useState({ eventId: '', participantId: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    const uniqueEvents = events.length;
    const uniqueParticipants = participants.length;
    const totalRegistrations = registrations.length;

    return { uniqueEvents, uniqueParticipants, totalRegistrations };
  }, [events, participants, registrations]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [eventsResponse, participantsResponse, registrationsResponse] = await Promise.all([
        fetch('/api/db_events'),
        fetch('/api/db_participants'),
        fetch('/api/registrations'),
      ]);

      const [eventsData, participantsData, registrationsData] = await Promise.all([
        eventsResponse.json(),
        participantsResponse.json(),
        registrationsResponse.json(),
      ]);

      if (!eventsResponse.ok) throw new Error(eventsData.error || 'Failed to fetch events');
      if (!participantsResponse.ok) throw new Error(participantsData.error || 'Failed to fetch participants');
      if (!registrationsResponse.ok) throw new Error(registrationsData.error || 'Failed to fetch registrations');

      setEvents(eventsData);
      setParticipants(participantsData);
      setRegistrations(registrationsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2500);
  };

  const handleAddParticipant = async (event) => {
    event.preventDefault();

    if (!participantForm.id || !participantForm.name.trim()) {
      setError('Enter both participant ID and participant name.');
      return;
    }

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: participantForm.id,
          name: participantForm.name.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add participant');

      setParticipantForm(emptyParticipant);
      showMessage(data.message || 'Participant added successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm('Delete this participant? Related event registrations may block this if the database has linked rows.')) {
      return;
    }

    try {
      const response = await fetch(`/api/participants/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete participant');

      showMessage(data.message || 'Participant deleted successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!registrationForm.eventId || !registrationForm.participantId) {
      setError('Select both event and participant.');
      return;
    }

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to register participant');

      setRegistrationForm({ eventId: '', participantId: '' });
      showMessage(data.message || 'Registration created successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveRegistration = async (eventId, participantId) => {
    try {
      const response = await fetch(`/api/registrations/${eventId}/${participantId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove registration');

      showMessage(data.message || 'Registration removed successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">DBMS + React Project</p>
          <h1>Event Management System</h1>
          <p className="hero-copy">
            Manage events, participants, schedules, and event registrations from one full-stack dashboard.
          </p>
        </div>
        <button className="ghost-btn" onClick={loadDashboard}>Refresh Data</button>
      </section>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error" onClick={() => setError('')}>{error}</div>}

      <section className="stats-grid">
        <article>
          <span>Events</span>
          <strong>{stats.uniqueEvents}</strong>
        </article>
        <article>
          <span>Participants</span>
          <strong>{stats.uniqueParticipants}</strong>
        </article>
        <article>
          <span>Registrations</span>
          <strong>{stats.totalRegistrations}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Events</p>
            <h2>Scheduled Events</h2>
          </div>
          {loading && <span className="status-pill">Loading...</span>}
        </div>

        <div className="event-grid">
          {events.map((event) => (
            <article className="event-card" key={event.event_id}>
              <div>
                <span className="event-id">#{event.event_id}</span>
                <h3>{event.event_name}</h3>
                <p>Organizer: {event.organizer_name}</p>
              </div>
              <div className="event-meta">
                <span>{formatDate(event.event_date)}</span>
                <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                <strong>{event.participant_count} registered</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Participants</p>
              <h2>Add Participant</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleAddParticipant}>
            <input
              type="number"
              placeholder="Participant ID"
              value={participantForm.id}
              onChange={(event) => setParticipantForm({ ...participantForm, id: event.target.value })}
            />
            <input
              type="text"
              placeholder="Participant Name"
              value={participantForm.name}
              onChange={(event) => setParticipantForm({ ...participantForm, name: event.target.value })}
            />
            <button type="submit">Add Participant</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.participant_id}>
                    <td>{participant.participant_id}</td>
                    <td>{participant.participant_name}</td>
                    <td>
                      <button className="danger-btn" onClick={() => handleDeleteParticipant(participant.participant_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Registrations</p>
              <h2>Register for Event</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleRegister}>
            <select
              value={registrationForm.eventId}
              onChange={(event) => setRegistrationForm({ ...registrationForm, eventId: event.target.value })}
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.event_id} value={event.event_id}>{event.event_name}</option>
              ))}
            </select>
            <select
              value={registrationForm.participantId}
              onChange={(event) => setRegistrationForm({ ...registrationForm, participantId: event.target.value })}
            >
              <option value="">Select Participant</option>
              {participants.map((participant) => (
                <option key={participant.participant_id} value={participant.participant_id}>
                  {participant.participant_name}
                </option>
              ))}
            </select>
            <button type="submit">Register Participant</button>
          </form>

          <div className="registration-list">
            {registrations.map((registration) => (
              <article className="registration-card" key={`${registration.event_id}-${registration.participant_id}`}>
                <div>
                  <strong>{registration.participant_name}</strong>
                  <span>{registration.event_name}</span>
                </div>
                <button
                  className="danger-btn subtle"
                  onClick={() => handleRemoveRegistration(registration.event_id, registration.participant_id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function formatDate(value) {
  if (!value) return 'Date not set';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(value) {
  if (!value) return '--';
  return String(value).slice(0, 5);
}

export default App;
