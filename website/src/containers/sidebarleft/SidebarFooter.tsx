import React from 'react';
import { TbTimelineEventText } from 'react-icons/tb';
import { clearRuns, startRun } from '../../network/startRuns';

export default function () {
    return (
        <div className="sidebar-footer">
            <button
                className="sidebar-footer-button"
                onClick={() => {
                    clearRuns();
                }}
            >
                Clear
            </button>
            <button 
                className="sidebar-footer-button"
                onClick={() => {
                    startRun();
                }}
            >
                Run
            </button>
        </div>
    )
}