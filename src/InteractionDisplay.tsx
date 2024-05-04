import './InteractionDisplay.css'
import {Interaction} from "./DrugSelect";
import {useCallback} from "react";

const InteractionDisplay = ( {drugInteractions} : { drugInteractions: Interaction[]}) => {
    const interactionsFound = !!drugInteractions.length

    const interactionDivs = useCallback (() => {
        return drugInteractions.map( (item, index) => {
            return (
            <div key={item.drugs.join('-')} className="interaction-item">
                <p>{item.drugs[0]} and {item.drugs[1]}</p>
                <p>Level: {item.level}</p>
                { index !== drugInteractions.length - 1 ? <hr /> : null}
            </div>
            );
            }
        )
    }, [drugInteractions]);

    return (
        <div>
            {interactionsFound ? (
                <div>
                    <h3>
                        Interactions found
                    </h3>
                    <div className="interaction-container">
                        {interactionDivs()}
                    </div>
                </div>
            ) : (
                <div className="no-interaction-container">
                    <h3>
                        No interactions found ✔️
                    </h3>
                </div>
            )}

        </div>
    );
}

export default InteractionDisplay;
