import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import request from '@/request/request';

const { TextArea } = Input;

const Notes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [id]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await request.get({ entity: `queries/${id}` });
      setNotes(response.notes || []);
    } catch (error) {
      // Handled by request.errorHandler
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) {
      return;
    }
    setLoading(true);
    try {
      await request.post({
        entity: `queries/${id}/notes`,
        jsonData: { content: newNote },
      });
      setNewNote('');
      await fetchNotes();
    } catch (error) {
      // Handled by request.errorHandler
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    setLoading(true);
    try {
      await request.delete({ entity: `queries/${id}/notes`, id: noteId });
      await fetchNotes();
    } catch (error) {
      // Handled by request.errorHandler
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Button type="link" onClick={() => navigate('/queries')} style={{ marginBottom: '16px' }}>
        Back to Queries
      </Button>
      {loading && <Spin tip="Loading..." />}
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
