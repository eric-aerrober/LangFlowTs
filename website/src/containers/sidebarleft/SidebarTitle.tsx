import React from 'react';
import { TbTimelineEventText } from 'react-icons/tb';

export default function () {
    return (
        <div className="sidebar-title">
            <TbTimelineEventText color="#585858" className="sidebar-logo" />
            <div className="sidebar-text-title">Lang Flow Ts</div>
        </div>
    )
}