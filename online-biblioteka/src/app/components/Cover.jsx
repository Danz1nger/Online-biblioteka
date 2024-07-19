import React, { useState, useEffect } from 'react';
import './Cover.css';

const Cover = () => {
  const [covers, setCovers] = useState([]);
  const [newCover, setNewCover] = useState('');
  const [showAddCover, setShowAddCover] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  useEffect(() => {
    // Fetch initial covers data from server or initialize with empty array
    setCovers([
      { id: 1, name: 'Tvrdi povez' },
      { id: 2, name: 'Meki povez' }
    ]);
  }, []);

  const handleAddCover = () => {
    if (newCover.trim()) {
      const newCoverItem = { id: Date.now(), name: newCover };
      setCovers([...covers, newCoverItem]);
      setNewCover('');
      setShowAddCover(false);
    }
  };

  const handleDeleteCover = (id) => {
    setCovers(covers.filter(cover => cover.id !== id));
  };

  const handleUpdateCover = (id, updatedName) => {
    setCovers(covers.map(cover => (cover.id === id ? { ...cover, name: updatedName } : cover)));
  };

  const toggleActionMenu = (id) => {
    setActiveActionMenu(activeActionMenu === id ? null : id);
  };

  return (
    <div className="cover">
      {!showAddCover ? (
        <a
          href="#"
          className="add-cover-link"
          onClick={() => setShowAddCover(true)}
        >
          <span className="plus-sign">+</span> Novi povez
        </a>
      ) : (
        <div className="cover-form">
          <input
            type="text"
            value={newCover}
            onChange={(e) => setNewCover(e.target.value)}
            placeholder="Add new cover"
          />
          <button onClick={handleAddCover}>Add</button>
        </div>
      )}

      <table className="cover-table">
        <thead style={{ backgroundColor: '#EFF3F6' }}>
          <tr>
            <th></th>
            <th>Naziv poveza</th>
            <th></th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'white' }}>
          {covers.map(cover => (
            <tr key={cover.id}>
              <td><input type="checkbox" /></td>
              <td>
                <input
                  type="text"
                  value={cover.name}
                  onChange={(e) => handleUpdateCover(cover.id, e.target.value)}
                />
              </td>
              <td>
                <div className="actions">
                  <i
                    className="fas fa-ellipsis-v"
                    onClick={() => toggleActionMenu(cover.id)}
                  ></i>
                  {activeActionMenu === cover.id && (
                    <div className="action-menu">
                      <div onClick={() => handleUpdateCover(cover.id, cover.name)}>
                        <i className="fas fa-edit"></i> <span>Izmijeni povez</span>
                      </div>
                      <div onClick={() => handleDeleteCover(cover.id)}>
                        <i className="fa fa-trash"></i> <span>Izbrisi povez</span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cover;
