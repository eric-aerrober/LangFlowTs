import React, { useEffect, useState } from 'react';
import { summaryDataBase } from '../../network/polling';
import { useRecoilState } from 'recoil';
import { selectedRun } from '../../state/selectedRun';
import { getSummaryData } from '../../network/polling';

export default function () {

    const [selected, setSelected] = useRecoilState(selectedRun)
    const [data, setData] = useState<summaryDataBase>();

    useEffect(() => {
        setData(getSummaryData(selected||''))
        const polling = setInterval(() => {
            if (selected) {
                setData(getSummaryData(selected))
            }
        }, 1000);
        return () => {
            clearInterval(polling);
        }
    }, [selected]);

    const deltaTime = (data?.end || 0) - (data?.start || 0);
    const deltaMinutes = Math.floor(deltaTime / 1000 / 60);
    const deltaMinString = deltaMinutes < 10 ? `0${deltaMinutes}` : `${deltaMinutes}`;
    const deltaSeconds = Math.floor(deltaTime / 1000) % 60;
    const deltaSecString = deltaSeconds < 10 ? `0${deltaSeconds}` : `${deltaSeconds}`;
    const deltaString = `${deltaMinString}:${deltaSecString}`;

    const cachePercentString = (((data?.cachedCalls || 0) / (data?.calls || 1))* 100).toFixed(0);

    return (
        <div className="sidebar-footer-2">
            <div>
                Calls: {data?.calls}
            </div>
            <div>
                Tokens: {data?.tokens}
            </div>
            <div>
                Cached: {cachePercentString}%
            </div>
            <div>
                Time: {deltaString}
            </div>
        </div>
    )
}