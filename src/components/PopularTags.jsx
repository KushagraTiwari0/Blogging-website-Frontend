import React from 'react'
import { useTagsQuery } from '../hooks'
import './SkeletonCard.css'


function PopularTags({ onTagClick }) {

    const  {
        isTagsLoading,
        tags,
        tagsError,
      } = useTagsQuery();

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
        
        return tags?.tags?.map((tag) => (
            <span 
              key={tag} 
              className='tag-pill tag-default'
              onClick={() => onTagClick(tag)}
            >
                {tag}
            </span>
        ))
    }
  return (
    <div className='tag-list'>{content()}</div>
  )
}

export default PopularTags