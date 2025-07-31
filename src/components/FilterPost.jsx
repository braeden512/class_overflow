import React, { useState } from 'react';
import '../styles/FilterPost.css';

const FilterPost = ({ universities, classes, onApply, onClose }) => {
    const [selectedUniversities, setSelectedUniversities] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);

    const toggleSelection = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleApply = () => {
        onApply({
            universities: selectedUniversities,
            classes: selectedClasses,
        });
        onClose();
    };

    return (
        <div className="filter-modal-backdrop">
            <div className="filter-modal">
                <h2>Filter Posts</h2>

                <div className="filter-group">
                    <h3>Universities</h3>
                    {universities.map((uni, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                checked={selectedUniversities.includes(uni)}
                                onChange={() => toggleSelection(uni, selectedUniversities, setSelectedUniversities)}
                            />
                            {uni}
                        </label>
                    ))}
                </div>

                <div className="filter-group">
                    <h3>Classes</h3>
                    {classes.map((cls, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                checked={selectedClasses.includes(cls)}
                                onChange={() => toggleSelection(cls, selectedClasses, setSelectedClasses)}
                            />
                            {cls}
                        </label>
                    ))}
                </div>

                <div className="filter-actions">
                    <button className="apply-button" onClick={handleApply}>Apply</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default FilterPost;
