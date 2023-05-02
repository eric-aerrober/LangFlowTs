// Hud in bottom left corner of screen

import React from 'react';
import { useGraphState } from '../state/network/network.hook';
import network from '../state/network/network.class';

export default function Hud() {
    useGraphState();

    const calls = network.getCalls();
    const tokens = calls.reduce((acc, call) => acc + call.tokens, 0);
    return <div className="hud">
        <pre>
            <code>
                {JSON.stringify({
                    calls: calls.length,
                    tokens,
                    cost: '$' + Math.round(((tokens / 1000) * 0.04)*100)/100
                }, null, 2)}
            </code>
        </pre>
    </div>

}
