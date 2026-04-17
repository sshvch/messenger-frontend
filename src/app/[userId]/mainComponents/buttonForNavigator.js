export default function Button({method,text}){

    return (
        <div>
           <button  type ="button" onClick={() => method()}>{text}</button>
        </div>
    )
}