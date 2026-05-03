import React, { useState } from 'react'
import { useTagsQuery } from '../hooks'

function TagsInput({ field, form }) {
  const { tags } = useTagsQuery();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableTags = tags?.tags || [];
  
  // Filter suggestions based on input, excluding already selected tags
  const suggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(inputValue.toLowerCase()) && 
    !(field.value || []).includes(tag)
  );

  const handleAddTag = (tag) => {
    if (!tag.trim()) return;
    if (!(field.value || []).includes(tag)) {
      form.setFieldValue(field.name, [...(field.value || []), tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <div className="tags-input-container" style={{ position: 'relative' }}>
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(inputValue);
          }
        }}
        type="text"
        className="form-control"
        placeholder="Enter tags (Press Enter to add)"
      />
      
      {showSuggestions && inputValue && suggestions.length > 0 && (
        <ul className="tag-suggestions" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          border: '1px solid var(--rule-dark)',
          borderTop: 'none',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 10,
          maxHeight: '200px',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {suggestions.map(tag => (
            <li 
              key={tag}
              style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--rule)', color: 'var(--body-text)', fontSize: '0.9rem' }}
              onMouseDown={(e) => {
                // onMouseDown fires before onBlur, allowing the click to register
                e.preventDefault(); 
                handleAddTag(tag);
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--surface-hover)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="tag-list" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {(field?.value || []).map((tag) => (
          <span key={tag} className="tag-default tag-pill" style={{ margin: 0 }}>
            <i
              className="ion-close-round"
              style={{ marginRight: '6px', cursor: 'pointer', opacity: 0.7 }}
              onClick={() =>
                form.setFieldValue(
                  field.name,
                  field.value.filter((item) => item !== tag)
                )
              }
            />
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TagsInput
