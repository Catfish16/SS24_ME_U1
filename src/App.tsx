import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import Papa from 'papaparse';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DrugSelect from "./DrugSelect";

const App = ( ) => {

    const [parsedData, setParsedData] = useState<Array<DrugEntry>>([]);
    const availableDataSets = [ 'hormonal', 'respiratory'];
    const [selectedDataset, setSelectedDataset] = useState('');

    const selectDataset = (name: string) => {
        if (availableDataSets.includes(name)){
            setSelectedDataset(name);
            fetchData();
        }
    }

    const fetchData = useCallback(() => {
        fetch(`/assets/${selectedDataset}.csv`)
            .then(response => {
                if(!response.ok) {
                    throw new Error('Error: Network response' + response.statusText);
                }
                return response.blob();
            })
            .then(blob => {
                let file = new File([blob], `${selectedDataset}.csv`, {type: "text/csv"});
                Papa.parse(file, {
                    delimiter: ',',
                    header: true,
                    complete: (results) => {
                        console.log(results);
                        setParsedData(results.data as DrugEntry[]);
                    }
                });
            })
            .catch(error => console.error('There has been a problem with your fetch operation: ', error.message));
    }, [selectedDataset, setSelectedDataset]);


    const compareDrug = (drug: string) => {
        const interactiveDrugs = parsedData.filter(item => (item.Drug_A === drug || item.Drug_B === drug))
    }

    useEffect(() => {
        console.log(parsedData.length)
    }, [parsedData]);

  return (
    <div className="App">
        <header className="App-header">
            <h1>
              MediMatch
            </h1>
        </header>
        <div className="content">
            <ToastContainer
                position="bottom-right"
                theme="light"
            />
            <div className="menu-button-container">
                <button className="menu-button">
                    <a href=''>
                        Home
                    </a>
                </button>
                <button
                    className="menu-button"
                    onClick={() => toast(`Oh no! This page isn't implemented...`)}
                >
                    About
                </button>
                <button
                    className="menu-button"
                    onClick={() => toast(`Oh no! This page isn't implemented...`)}
                >
                    Help & Contact
                </button>
            </div>
            <div className="interaction-checker">
                <button
                    className='dataset-button'
                    onClick={() => selectDataset('hormonal')}
                >
                    Load hormonal drugs dataset
                </button>
                <button
                    className='dataset-button'
                    onClick={() => selectDataset('respiratory')}
                >
                    Load respiratory drugs dataset
                </button>
                {selectedDataset &&
                    <span>
                        <hr />
                        <p className="instruction-text"> Select at least two and up to five drugs </p>
                            <DrugSelect
                            drugs={parsedData}
                        />
                    </span>
                }
            </div>
        </div>
    </div>
  );
}

export default App;

export interface AppProps {
    temp: string;
}

export interface DrugEntry {
    DDInterID_A: string;
    DDInterID_B: string;
    Drug_A: string;
    Drug_B: string;
    Level: string;
}
