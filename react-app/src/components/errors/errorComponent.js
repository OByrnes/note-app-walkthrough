import { useDispatch, useSelector } from "react-redux"
import {SetErrors} from "../../store/session"
import "./index.css";
const ErrorComponent = () => {
    const errors = useSelector(state => state.session.errors)
    const dismissErrors = () => {
        dispatch(SetErrors(null))
    }
    const dispatch = useDispatch()
    return (
        <>
        {errors &&  <div className="error__container">
            <button className="closeError" onClick={dismissErrors}>x</button>
       { errors.map(error => (<span key={error}>
            {error}
            </span>))}
        </div>}
        </>
    )
}

export default ErrorComponent