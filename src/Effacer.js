function Effacer(props){
    return(
        <div>
            <button onClick={() => props.onClick(props.valeur)}>Effacer</button>
        </div>
    );
}
export default Effacer;