import React, { useState } from 'react';
import axios from 'axios';

function Profile({ token, user }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info');
  const [showChange, setShowChange] = useState(false);

  const handleChangePassword = async e => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post('http://localhost:5000/change-password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Password changed successfully!');
      setMsgType('success');
      setOldPassword('');
      setNewPassword('');
      setShowChange(false);
    } catch (err) {
      setMsg(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Something went wrong'
      );
      setMsgType('danger');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #181c24 0%, #232a36 100%)',
      color: '#e5e7eb',
      padding: 0,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '48px 16px 0 16px'
      }}>
        {/* Profile Header */}
        <div className="d-flex flex-column align-items-center mb-4">
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            boxShadow: '0 8px 32px rgba(80,120,255,0.18)'
          }}>
            <i className="bi bi-person-circle text-white" style={{ fontSize: 80 }}></i>
          </div>
          <h1 className="fw-bold mb-1" style={{ color: '#fff', fontSize: 36, letterSpacing: 1 }}>Profile</h1>
          <div className="text-secondary mb-3" style={{ fontSize: 17 }}>View and manage your account details</div>
        </div>

        {/* Info & Actions Panel */}
        <div className="row g-4">
          {/* User Info */}
          <div className="col-md-6">
            <div style={{
              background: 'rgba(36,41,54,0.95)',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 2px 16px rgba(80,120,255,0.07)',
              minHeight: 180
            }}>
              <div className="mb-3">
                <span className="fw-semibold text-info">Username:</span>{' '}
                <span className="text-light">{user?.username}</span>
              </div>
              <div className="mb-3">
                <span className="fw-semibold text-info">Role:</span>{' '}
                <span className="text-light">{user?.role}</span>
              </div>
              {/* Add more user info here if needed */}
            </div>
          </div>
          {/* Password Change */}
          <div className="col-md-6">
            <div style={{
              background: 'rgba(36,41,54,0.95)',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 2px 16px rgba(80,120,255,0.07)',
              minHeight: 180
            }}>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-shield-lock-fill text-primary me-2" style={{ fontSize: 22 }}></i>
                <span className="fw-semibold text-light" style={{ fontSize: 18 }}>Security</span>
              </div>
              <button
                className={`btn btn-outline-info w-100 mb-2 fw-semibold`}
                type="button"
                style={{
                  transition: 'background 0.2s, color 0.2s',
                  background: showChange ? 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)' : '',
                  color: showChange ? '#fff' : ''
                }}
                onClick={() => setShowChange(!showChange)}
              >
                {showChange ? 'Cancel' : 'Change Password'}
              </button>
              <div
                style={{
                  maxHeight: showChange ? 300 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(.4,2,.6,1)'
                }}
              >
                {showChange && (
                  <form onSubmit={handleChangePassword} className="mt-2">
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      required
                      style={{
                        background: '#232a36',
                        color: '#e5e7eb',
                        border: '1px solid #374151'
                      }}
                    />
                    <input
                      type="password"
                      className="form-control mb-3"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      style={{
                        background: '#232a36',
                        color: '#e5e7eb',
                        border: '1px solid #374151'
                      }}
                    />
                    <button className="btn btn-info w-100 fw-semibold" type="submit">
                      <i className="bi bi-arrow-repeat me-1"></i>Update Password
                    </button>
                  </form>
                )}
              </div>
              {msg && <div className={`alert alert-${msgType} py-1 text-center mt-3 mb-0`}>{msg}</div>}
            </div>
          </div>
        </div>
        {/* Add more sections (social, stats, etc.) here if you want */}
      </div>
    </div>
  );
}

export default Profile;