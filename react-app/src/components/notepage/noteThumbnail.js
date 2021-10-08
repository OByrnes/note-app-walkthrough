import Editor from "rich-markdown-editor";


const NoteThumbnail = ({note}) => {
    const {title, text} = note

    return (
        <div className="thumbnail__container">
            <h4>{title}</h4>
            <div>
                <Editor readOnly={true} defaultValue={text} dark/>
            </div>
        </div>
    )

}

export default NoteThumbnail