import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import * as Papa from 'papaparse';


const App = ( ) => {

    const [data, setData] = useState<Array<DrugEntry>>([]);

    const toParse = "DDInterID_A,Drug_A,DDInterID_B,Drug_B,Level\n" +
        "DDInter513,Dexamethasone,DDInter582,Dolutegravir,Minor\n" +
        "DDInter582,Dolutegravir,DDInter625,Elagolix,Minor\n" +
        "DDInter582,Dolutegravir,DDInter1700,Somatrem,Minor\n" +
        "DDInter1699,Somatotropin,DDInter582,Dolutegravir,Minor\n" +
        "DDInter195,Betamethasone,DDInter1961,Zidovudine,Moderate\n" +
        "DDInter1961,Zidovudine,DDInter513,Dexamethasone,Moderate\n" +
        "DDInter1961,Elagolix,DDInter747,Fludrocortisone,Moderate\n" +
        "DDInter1961,Zidovudine,DDInter885,Hydrocortisone,Moderate\n" +
        "DDInter1961,Zidovudine,DDInter1191,Methylprednisolone,Moderate\n" +
        "DDInter1961,Zidovudine,DDInter1513,Prednisolone,Moderate\n" +
        "DDInter1961,Zidovudine,DDInter1515,Prednisone,Moderate";

    const parseCSV = () => {
        Papa.parse(toParse, {
            delimiter: ',',
            header: true,
            complete: (results) => {
                setData(results.data as DrugEntry[])
            }
        });
    }

    const compareDrug = (drug: string) => {
        const interactiveDrugs = data.filter(item => (item.Drug_A === drug || item.Drug_B === drug))
        console.log(interactiveDrugs);
    }

    useEffect(() => {
        parseCSV();
        compareDrug("Elagolix");
    }, []);

  return (
    <div className="App">
        <header className="App-header">
            <h1>
              Squirrels are fun
            </h1>
            <button className="header-button">
              FAQ
            </button>
        </header>
        <body>
            <input
                type="search"
                className="input-field"
                placeholder="Start typing a drug..."
            />
        </body>
    </div>
  );
}

export default App;

export interface AppProps {
    temp: string;
}

interface DrugEntry {
    DDInterID_A: string;
    DDInterID_B: string;
    Drug_A: string;
    Drug_B: string;
    Level: string;

}
