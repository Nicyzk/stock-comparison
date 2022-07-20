import React from 'react'

const Templates = (props) => {
    const { setCurrentTemplate, templates } = props
    return (
        <div className='fl fl-wrap'>
            {templates.map((el, index) => (
                <div
                    key={index}
                    onClick={() => setCurrentTemplate(el.name)}
                    className='px-1 py-05 fs-14px mr-1 text-primary border-light br-5px' role='button'>{el.name}</div>
            ))}
        </div>
    )
}

export default Templates