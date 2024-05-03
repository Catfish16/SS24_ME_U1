import React, {useMemo, useState} from 'react';
import Select, { ActionMeta } from 'react-select';
import {DrugEntry} from "./App";

interface SelectOption {
    value: string;
    label: string;
}

type OptionType = SelectOption[];

const DrugSelect = ({ drugs }: { drugs: DrugEntry[] }) => {
    console.log(drugs.length)

    const [selectedOption, setSelectedOption] = useState<OptionType>([]);
    const filterDuplicateOptions = (options: OptionType): OptionType => {
        return options.reduce((uniqueOptions: OptionType, option: SelectOption) => {
            const duplicate = uniqueOptions.find(
                uniqueOption => uniqueOption.value === option.value && uniqueOption.label === option.label
            );

            return duplicate ? uniqueOptions : [...uniqueOptions, option];
        }, []);
    }
    const mapDrugsToOptions = (drugs: DrugEntry[]): OptionType => {
        return drugs.flatMap(drug => [
            { value: drug.Drug_A, label: drug.Drug_A },
            { value: drug.Drug_B, label: drug.Drug_B }
        ]);
    };

    // Convert drugs to {value, label} objects
    const options: OptionType = useMemo(() => {
        return filterDuplicateOptions(mapDrugsToOptions(drugs));
    }, [drugs]);

    const handleChange = (
        selectedOptions: readonly SelectOption[] | null,
        _: ActionMeta<SelectOption>
    ) => {
        // @ts-ignore
        setSelectedOption(selectedOptions || []);
    };

    return (
        <Select
            isMulti={true}
            options={options}
            value={selectedOption}
            onChange={handleChange}
        />
    );
};

export default DrugSelect;
