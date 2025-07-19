import React, { useState } from 'react';
import { Form, Input, Button, List, Spin, message } from 'antd';

const { TextArea } = Input;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {};

  const addNote = async () => {
    if (!newNote.trim()) {
      message.error('Note content cannot be empty');
      return;
    }
  };

  const deleteNote = async (noteId) => {
    console.log(noteId);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {loading && <Spin tip="Loading..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form layout="vertical">
        <Form.Item label="Add Note">
          <TextArea
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter note content"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={addNote} loading={loading}>
            Add Note
          </Button>
        </Form.Item>
      </Form>
      <List
        bordered
        dataSource={notes}
        renderItem={(note) => (
          <List.Item
            actions={[
              <Button type="danger" size="small" onClick={() => deleteNote(note._id)}>
                Delete
              </Button>,
            ]}
          >
            {note.content}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notes;
