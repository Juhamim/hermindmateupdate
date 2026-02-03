"use client";

import { useState, useEffect } from "react";
import { getPsychologists, Psychologist } from "@/app/lib/actions/psychologists";

export default function TestFiltersPage() {
    const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
    const [log, setLog] = useState<string[]>([]);

    // Test params
    const [specs, setSpecs] = useState<string[]>([]);
    const [price, setPrice] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    const runTest = async () => {
        addLog(`Fetching with: Specs=[${specs.join(',')}], Price=[${price.join(',')}]`);
        try {
            const data = await getPsychologists("", {
                specializations: specs,
                priceRange: price
            });
            setPsychologists(data);
            addLog(`Result Count: ${data.length}`);
            data.forEach(p => {
                addLog(` - Found: ${p.name} | Specs: [${p.specializations?.join(', ')}] | Price: ${p.price}`);
            });
        } catch (e: any) {
            addLog(`Error: ${e.message}`);
        }
    };

    return (
        <div className="p-8 space-y-4 font-mono text-sm">
            <h1 className="text-xl font-bold">Filter Debugger</h1>

            <div className="flex gap-4 border p-4">
                <div>
                    <h3 className="font-bold">Specializations</h3>
                    {["Anxiety", "Depression", "anxiety", "depression"].map(s => (
                        <label key={s} className="block">
                            <input
                                type="checkbox"
                                checked={specs.includes(s)}
                                onChange={e => {
                                    if (e.target.checked) setSpecs([...specs, s]);
                                    else setSpecs(specs.filter(x => x !== s));
                                }}
                            /> {s}
                        </label>
                    ))}
                </div>
                <div>
                    <h3 className="font-bold">Price</h3>
                    {['under_500', '500_1500', '1500_plus'].map(p => (
                        <label key={p} className="block">
                            <input
                                type="checkbox"
                                checked={price.includes(p)}
                                onChange={e => {
                                    if (e.target.checked) setPrice([...price, p]);
                                    else setPrice(price.filter(x => x !== p));
                                }}
                            /> {p}
                        </label>
                    ))}
                </div>
                <button onClick={runTest} className="bg-blue-500 text-white px-4 py-2 rounded">Run Query</button>
            </div>

            <div className="bg-gray-100 p-4 rounded min-h-[200px]">
                {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
        </div>
    );
}
