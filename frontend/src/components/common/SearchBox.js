import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBox.css';

function SearchBox({ onSearch }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  };

  return (
    <form className="searchbox-gradient" onSubmit={handleSubmit}>
      <input
        className="searchbox-input"
        type="text"
        placeholder="검색어를 입력해주세요."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button className="searchbox-btn" type="submit" aria-label="검색">
        <FiSearch size={22} />
      </button>
    </form>
  );
}

export default SearchBox; 