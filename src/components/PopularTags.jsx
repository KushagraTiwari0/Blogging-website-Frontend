import React from 'react'
import { useTagsQuery } from '../hooks'

function PopularTags({ onTagClick }) {

    const  {
        isTagsLoading,
        tags,
        tagsError,
      } = useTagsQuery();

    function content(){
        if (isTagsLoading) return <div>Loading tags...</div>;
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