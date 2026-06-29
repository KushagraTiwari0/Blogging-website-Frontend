import React, { useState, useEffect } from "react";
import { useTagsQuery } from "../hooks";
import "./SkeletonCard.css";

function PopularTags({ onTagClick }) {
    const [isSearching, setIsSearching] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Store click counts in state
    const [clickCounts, setClickCounts] = useState(() => {
        try {
            const saved = localStorage.getItem("blogging_tag_clicks");
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Debounce the search input (500ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(inputValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue]);

    const {
        isTagsLoading,
        tags,
        tagsError,
    } = useTagsQuery();

    const handleTagClickInternal = (tag) => {
        // Increment count
        const newCounts = {
            ...clickCounts,
            [tag]: (clickCounts[tag] || 0) + 1
        };
        setClickCounts(newCounts);
        try {
            localStorage.setItem("blogging_tag_clicks", JSON.stringify(newCounts));
        } catch (e) {
            console.error("Failed to save tag click to localStorage", e);
        }

        // Call the parent handler
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    function content(){
        if (isTagsLoading) {
            return (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <div className="skeleton" style={{ width: "60px", height: "22px", borderRadius: "2px" }}></div>
                    <div className="skeleton" style={{ width: "80px", height: "22px", borderRadius: "2px" }}></div>
                    <div className="skeleton" style={{ width: "45px", height: "22px", borderRadius: "2px" }}></div>
                    <div className="skeleton" style={{ width: "70px", height: "22px", borderRadius: "2px" }}></div>
                    <div className="skeleton" style={{ width: "55px", height: "22px", borderRadius: "2px" }}></div>
                </div>
            );
        }
        if (tagsError) return <div>Error loading tags</div>;
        
        const allTags = tags?.tags ?? [];

        // Sort by click counts descending, then filter by searchQuery, then take at most 5
        const processedTags = allTags
            .map(tag => ({
                name: tag,
                count: clickCounts[tag] || 0
            }))
            .sort((a, b) => {
                if (b.count !== a.count) {
                    return b.count - a.count;
                }
                return a.name.localeCompare(b.name);
            })
            .filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 5);

        if (processedTags.length === 0) {
            return <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontStyle: "italic", padding: "4px 0" }}>No tags found</div>;
        }

        return processedTags.map(({ name, count }) => (
            <span 
              key={name} 
              className="tag-pill tag-default"
              onClick={() => handleTagClickInternal(name)}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
                {name}
                {count > 0 && <span style={{ fontSize: "0.55rem", opacity: 0.7, fontWeight: 500 }}>({count})</span>}
            </span>
        ));
    }

    return (
      <div className="popular-tags-container">
        <div 
          className="tags-header" 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "14px", 
            borderBottom: "1px solid var(--rule)", 
            paddingBottom: "12px" 
          }}
        >
          <p 
            style={{ 
              margin: 0, 
              border: "none", 
              padding: 0, 
              fontFamily: "var(--font-ui)", 
              fontSize: "0.62rem", 
              fontWeight: 700, 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              color: "var(--muted)" 
            }}
          >
            Popular Tags
          </p>
          <button 
            onClick={() => {
              setIsSearching(!isSearching);
              if (isSearching) {
                setInputValue("");
                setSearchQuery("");
              }
            }}
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              color: isSearching ? "var(--black)" : "var(--muted)", 
              display: "flex", 
              alignItems: "center", 
              padding: "4px",
              transition: "color var(--transition)" 
            }}
            className="search-tag-toggle-btn"
            title="Search Tags"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {isSearching && (
          <div style={{ marginBottom: "14px" }}>
            <input
              type="text"
              placeholder="Search tag..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="form-control"
              style={{ padding: "6px 10px", fontSize: "0.85rem", height: "auto", borderRadius: "var(--radius)" }}
              autoFocus
            />
          </div>
        )}

        <div className="tag-list">{content()}</div>
      </div>
    );
}

export default PopularTags;