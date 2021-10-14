import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AddComment, deleteComment, EditComment } from "../../store/notes"
import { SetErrors } from "../../store/session"
import "./index.css"

const Comment = ({comment, note}) => {

    const user = useSelector(state => state.session.user)
    const [showReplies, setShowReplies] = useState(false)
    const [text, setText] = useState(comment.text)
    const [reply, setReply] = useState("")
    const dispatch = useDispatch()
    const addReply = async () => {
        let newreply = {
            text: reply,
            parent_id: comment.id,
            note_id: note.id
        }
        let shared = user.id !== note.user_id
        let good = await dispatch(AddComment(newreply, shared))
        if (good){
            setReply("")
            setShowReplies(true)
            dispatch(SetErrors([`Reply added to comment on ${note.title}`]))
        }
    }
    const editComment = async () =>{
        let updatedComment = {
            note_id: note.id,
            id: comment.id,
            text: text
        }
        let shared = user.id !== note.user_id
        let good = await dispatch(EditComment(updatedComment, shared))
        if (good) {
            dispatch(SetErrors([`Comment was updated`]))
        }
    }

    const commentDelete = async () => {
        let shared = user.id !== note.user_id
        let good = await dispatch(deleteComment(comment,note.id, shared))
        if(good){
            dispatch(SetErrors([`Comment was deleted`]))
        }
    }

    return (
        <div>
            <div className="comment__container"> 
            
            {comment.username ===user.username ?
            <>
                    <input type="text" value={text} onChange={(e)=> setText(e.target.value)} placeholder="comment text" />
                    <div className="button__container" ><button onClick={editComment}>Save Edits</button><button onClick={commentDelete}>Delete</button></div>
                    </>:
                    <p>
                 {comment.text}
                </p> }
                <input type="text" value={reply} onChange={(e)=> setReply(e.target.value)} placeholder="reply to comment" />
                <button onClick={addReply}>Reply to Comment</button>
                    </div>
            {comment.comments.length !== 0 && <button onClick={()=>setShowReplies(prev => !prev)}>{showReplies?"Hide Replies":"View replies"}</button>}
            <div className="reply__container">
                {showReplies? 
                <>
                {comment.comments.map(com => <Comment key={com.id} comment={com} note={note}/>)}</>
                :
                <>
                
                </>}
            </div>
            
            
        </div>
        
    )
}
export default Comment