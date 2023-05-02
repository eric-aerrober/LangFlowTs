import { useState } from "react";

let _state = 0;
let _stateListeners: any[] = [];

export function useGraphState () {
    const [state, setState] = useState(_state);
    _stateListeners.push(setState);
}

export function updateGraphState () {
    _state++;
    _stateListeners.forEach(setState => setState(_state));
    _stateListeners = [];
}