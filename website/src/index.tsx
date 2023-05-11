import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago';

TimeAgo.addDefaultLocale(en)

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <RecoilRoot>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </RecoilRoot>
);