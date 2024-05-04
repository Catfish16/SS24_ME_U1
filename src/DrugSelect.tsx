import React, { useMemo, useState} from 'react';
import Select, { ActionMeta } from 'react-select';
import {DrugEntry} from "./App";
import InteractionDisplay from "./InteractionDisplay";
import './DrugSelect.css';

/** Implements drug selector and comparison */
const DrugSelect = ({ drugs }: { drugs: DrugEntry[] }) => {

    const [selectedOption, setSelectedOption] = useState<OptionType>([]);
    const [drugInteractions, setDrugInteractions] = useState<Interaction[]>([]);
    const [isInteractionDisplayVisible, setIsInteractionDisplayVisible] = useState(false);

    const filterDuplicateOptions = (options: OptionType): OptionType => {
        return options.reduce((uniqueOptions: OptionType, option: SelectOption) => {
            const duplicate = uniqueOptions.find(
                uniqueOption => uniqueOption.value === option.value && uniqueOption.label === option.label
            );

            return duplicate ? uniqueOptions : [...uniqueOptions, option];
        }, []);
    }

    // Transform the drugs array to the type required by react-select library
    const mapDrugsToOptions = (drugs: DrugEntry[]): OptionType => {
        return drugs.flatMap(drug => [
            { value: drug.Drug_A, label: drug.Drug_A },
            { value: drug.Drug_B, label: drug.Drug_B }
        ]);
    };

    // Convert drugs to {value, label} objects and remove duplicates
    const options: OptionType = useMemo(() => {
        return filterDuplicateOptions(mapDrugsToOptions(drugs));
    }, [drugs]);

    const handleChange = (
        selectedOptions: readonly SelectOption[] | null,
        _: ActionMeta<SelectOption>
    ) => {
        if (selectedOptions && selectedOptions.length > 5) {
            alert("You can select upto 5 options only");
        } else {
            // @ts-expect-error type mismatch
            setSelectedOption(selectedOptions || []);
        }
    };

    const compareSelections = () => {
        const interactions: Interaction[] = [];

        // Loop through all selected options
        for(let i=0; i < selectedOption.length; i++) {
            for(let j=i+1; j < selectedOption.length; j++) {
                const drug1 = selectedOption[i].value;
                const drug2 = selectedOption[j].value;

                // Find any existing record in the drugs list where selected drugs appear as Drug_A and Drug_B
                const interaction = drugs.find(drug =>
                    (drug.Drug_A === drug1 && drug.Drug_B === drug2) ||
                    (drug.Drug_A === drug2 && drug.Drug_B === drug1)
                );

                if (interaction) {
                    // Save the drug names and the level of interaction in the drugInteractions array
                    interactions.push({drugs: [drug1, drug2], level: interaction.Level});
                }
            }
        }

        setDrugInteractions(interactions);
        setIsInteractionDisplayVisible(true);
    };


     return (
        <div>
            <Select
                isMulti={true}
                options={options}
                value={selectedOption}
                onChange={handleChange}
            />
            <button className="action-button" onClick={() => compareSelections()}>
                Compare
            </button>
            <button className="action-button" onClick={() => {setSelectedOption([]); setIsInteractionDisplayVisible(false)}}>
                Reset
            </button>
            { isInteractionDisplayVisible &&
                <InteractionDisplay
                    drugInteractions={drugInteractions}
                />
            }
        </div>
    );
};

export default DrugSelect;

interface SelectOption {
    value: string;
    label: string;
}

export type OptionType = SelectOption[];

export interface Interaction {
    drugs: string[];
    level: string;
}
